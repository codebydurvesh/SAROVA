import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Auth Provider component
 * Manages authentication state across the app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.data.user);
        } catch (err) {
          // Token invalid or expired
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.data.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Even if API fails, clear local state
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  }, []);

  /**
   * Toggle favorite recipe
   */
  const toggleFavorite = useCallback(async (recipeId) => {
    try {
      const response = await authService.toggleFavorite(recipeId);
      setUser((prev) => ({
        ...prev,
        favorites: response.data.favorites,
      }));
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update favorites';
      setError(message);
      throw err;
    }
  }, []);

  /**
   * Check if a recipe is in favorites
   */
  const isFavorite = useCallback(
    (recipeId) => {
      return user?.favorites?.some((id) => id === recipeId || id._id === recipeId);
    },
    [user]
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    toggleFavorite,
    isFavorite,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
