import api from "./api";

/**
 * Recipe service
 * Handles all recipe-related API calls
 */
const recipeService = {
  /**
   * Get all recipes with optional filters
   * @param {Object} params - { category, dietType, search, page, limit }
   */
  getRecipes: async (params = {}) => {
    const response = await api.get("/recipes", { params });
    return response.data;
  },

  /**
   * Get single recipe by ID
   * @param {string} id
   */
  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  /**
   * Create new recipe
   * @param {FormData} formData - Recipe data with image
   */
  createRecipe: async (formData) => {
    const response = await api.post("/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Toggle like on recipe
   * @param {string} id
   */
  toggleLike: async (id) => {
    const response = await api.post(`/recipes/${id}/like`);
    return response.data;
  },

  /**
   * Add comment to recipe
   * @param {string} id
   * @param {string} text
   */
  addComment: async (id, text) => {
    const response = await api.post(`/recipes/${id}/comment`, { text });
    return response.data;
  },

  /**
   * Delete recipe
   * @param {string} id
   */
  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },
};

export default recipeService;
