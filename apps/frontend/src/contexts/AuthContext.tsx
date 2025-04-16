import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { config } from '../config';

// Define types for our authentication context
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(config.authEndpoints.me);
        setUser(response.data.user);
      } catch (err) {
        console.error('Error loading user:', err);
        // If token is invalid, clear it
        localStorage.removeItem('token');
        setToken(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(config.authEndpoints.register, {
        name,
        email,
        password,
      });
      
      const { accessToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
    }
    setLoading(false);
  };

  // Login an existing user
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(config.authEndpoints.login, {
        email,
        password,
      });
      
      const { accessToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
    }
    setLoading(false);
  };

  // Logout the user
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(config.authEndpoints.logout);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  // Clear any authentication errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}