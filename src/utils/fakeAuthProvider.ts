import { User } from '../contexts/AuthContext';

export const fakeAuthProvider = {
  // Sign in using the database
  signin: async (email: string, password: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
        const response = await fetch("http://localhost:5000/api/execute-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, values: [email] }),
        });
        const data = await response.json();
        if (data.success && data.results && data.results.length > 0) {
          const user = data.results[0];
          // Optionally check password here if you store hashed passwords
          resolve({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            profileImage: user.profileImage || "/placeholder.svg",
            email: user.email,
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      } catch (err) {
        reject(new Error('Error connecting to database'));
      }
    });
  },

  // Register a new user in the database
  register: async (user: {
    id: string;
    username: string;
    displayName: string;
    email: string;
    password: string;
    profileImage?: string;
    role?: string;
  }): Promise<User> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        if (data.success) {
          resolve({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            profileImage: user.profileImage || "/placeholder.svg",
            email: user.email,
          });
        } else {
          reject(new Error(data.message || "Registration failed"));
        }
      } catch (err) {
        reject(new Error('Error connecting to database'));
      }
    });
  },

  // Sign out
  signout: (callback: () => void): void => {
    setTimeout(callback, 300);
  }
};