import api from './api';

/**
 * Ingredient service
 * Handles all ingredient-related API calls
 */
const ingredientService = {
  /**
   * Get all ingredients with optional filters
   * @param {Object} params - { category, search }
   */
  getIngredients: async (params = {}) => {
    const response = await api.get('/ingredients', { params });
    return response.data;
  },

  /**
   * Get single ingredient by ID
   * @param {string} id
   */
  getIngredientById: async (id) => {
    const response = await api.get(`/ingredients/${id}`);
    return response.data;
  },

  /**
   * Seed sample ingredients (for development)
   */
  seedIngredients: async () => {
    const response = await api.post('/ingredients/seed');
    return response.data;
  },
};

export default ingredientService;
