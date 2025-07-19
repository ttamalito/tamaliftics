import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ROOT_ROUTES } from '../routes/routes';

// This is a placeholder hook for authentication
// In a real application, this would connect to an API
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate credentials with an API
      localStorage.setItem('auth_token', 'dummy_token');
      setIsAuthenticated(true);
      navigate(ROOT_ROUTES.HOME);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (
    username: string,
    password: string,
    email: string,
    firstName?: string,
    lastName?: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would register the user with an API
      localStorage.setItem('auth_token', 'dummy_token');
      setIsAuthenticated(true);
      navigate(ROOT_ROUTES.HOME);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    navigate(ROOT_ROUTES.LOGIN);
  }, [navigate]);

  return {
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout
  };
}