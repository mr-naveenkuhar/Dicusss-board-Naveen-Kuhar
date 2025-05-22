
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fakeAuthProvider } from '../utils/fakeAuthProvider';
import { toast } from '@/components/ui/use-toast';

export type User = {
  id: string;
  username: string;
  displayName: string;
  profileImage: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedUser: User) => void;
  isLoading?: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(authData.isAuthenticated);
        setUser(authData.user);
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const newUser = await fakeAuthProvider.signin(email, password);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: newUser }));
      toast({
        title: "Login successful",
        description: `Welcome back, ${newUser.displayName}!`,
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would send this data to your backend
      const newUser: User = {
        id: String(Math.random()),
        username: username,
        displayName: username,
        profileImage: '/placeholder.svg',
        email: email,
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: newUser }));
      toast({
        title: "Registration successful",
        description: `Welcome to DiscussX, ${username}!`,
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    fakeAuthProvider.signout(() => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    });
  };
  
  const updateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: updatedUser }));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
