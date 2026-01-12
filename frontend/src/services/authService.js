import api from "./api";

/**
 * Authentication service
 * Handles all auth-related API calls
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password }
   */
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.data.accessToken) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.data.accessToken) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    return response.data;
  },

  /**
   * Get current user profile
   */
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Toggle recipe as favorite
   * @param {string} recipeId
   */
  toggleFavorite: async (recipeId) => {
    const response = await api.post(`/auth/favorites/${recipeId}`);
    return response.data;
  },
};

export default authService;
