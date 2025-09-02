import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  lastLogin?: string;
  profileImage?: string;
}

interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  lastLogin?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, onSuccess?: () => void) => Promise<boolean>;
  register: (username: string, email: string, password: string, role?: string, onSuccess?: () => void) => Promise<boolean>;
  logout: (onSuccess?: () => void) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await apiService.getProfile();
          if (response.data) {
            setUser(response.data as User);
          } else {
            apiService.clearToken();
            setToken(null);
          }
        } catch (error) {
          apiService.clearToken();
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email: string, password: string, onSuccess?: () => void): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password);
      if (response.data) {
        const authData = response.data as AuthResponse;
        const { token: newToken, ...userData } = authData;
        apiService.setToken(newToken);
        setToken(newToken);
        setUser(userData);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, role?: string, onSuccess?: () => void): Promise<boolean> => {
    try {
      const response = await apiService.register(username, email, password, role);
      if (response.data) {
        const authData = response.data as AuthResponse;
        const { token: newToken, ...userData } = authData;
        apiService.setToken(newToken);
        setToken(newToken);
        setUser(userData);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = (onSuccess?: () => void) => {
    apiService.clearToken();
    setToken(null);
    setUser(null);
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
