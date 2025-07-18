'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import apiClient from '../lib/api';
import * as React from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile?: any;
  subscription?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem('token');
      
      if (storedToken) {
        apiClient.setToken(storedToken);
        setToken(storedToken);
        
        try {
          const { user } = await apiClient.getCurrentUser();
          setUser(user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          sessionStorage.removeItem('token');
          apiClient.removeToken();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await apiClient.login({ email, password });
      
      apiClient.setToken(token);
      setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const { token, user } = await apiClient.register(data);
      
      apiClient.setToken(token);
      setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiClient.removeToken();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}