import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized');
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setIsLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Hardcoded admin credentials for security
      const ADMIN_EMAIL = 'admin@beta-secure-2024';
      const ADMIN_PASSWORD = 'BetaAdmin#2024!Secure';

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Create a mock user object for the hardcoded admin
        const mockUser = {
          id: 'admin-user-id',
          email: ADMIN_EMAIL,
          role: 'admin'
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid admin credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signup = async (email, password) => {
    // Signup disabled for security - only one hardcoded admin account allowed
    return { success: false, error: 'Account creation is disabled' };
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    signup,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
