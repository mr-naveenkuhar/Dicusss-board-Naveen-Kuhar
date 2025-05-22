import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, MessageCircle, Bell, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const MainNavigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageCircle,
      authRequired: true
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      authRequired: true
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      authRequired: true
    },
    {
      name: 'Chatbot',
      path: '/chatbot',
      icon: MessageCircle
    },
    {
      name: 'SQL Dashboard',
      path: '/sql-dashboard',
      icon: Database,
      authRequired: true
    }
  ];
  
  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired) {
      return isAuthenticated;
    }
    return true;
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          DiscussX
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {filteredNavItems.map((item) => (
              <li className="nav-item" key={item.name}>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "nav-link",
                    location.pathname === item.path
                      ? "active"
                      : "text-gray-700"
                  )}
                >
                  <Link to={item.path}>
                    <item.icon className="mr-2" />
                    {item.name}
                  </Link>
                </Button>
              </li>
            ))}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
