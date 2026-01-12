import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Clock, ChefHat } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import recipeService from "../services/recipeService";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Favorites page component
 * Shows user's saved favorite recipes
 */
const Favorites = () => {
  const { user, toggleFavorite, isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.favorites?.length > 0) {
      fetchFavoriteRecipes();
    } else {
      setLoading(false);
    }
  }, [user?.favorites]);

  const fetchFavoriteRecipes = async () => {
    try {
      setLoading(true);
      // Fetch all recipes and filter by favorites
      const response = await recipeService.getRecipes();
      const favoriteIds = user.favorites.map((f) => f._id || f);
      const favoriteRecipes = response.data.recipes.filter((r) =>
        favoriteIds.includes(r._id)
      );
      setRecipes(favoriteRecipes);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    await toggleFavorite(recipeId);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Heart className="w-20 h-20 text-savora-brown-300 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-savora-brown-800 mb-2">
            Sign in to view favorites
          </h2>
          <p className="text-savora-brown-500 mb-8">
            Create an account to save your favorite recipes
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-2">
          Favorites
        </h1>
        <p className="text-savora-brown-500">
          Your saved recipes for easy access
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-20 h-20 text-savora-brown-300 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-savora-brown-800 mb-2">
            No favorites yet
          </h2>
          <p className="text-savora-brown-500 mb-8">
            Start exploring recipes and save your favorites
          </p>
          <Link to="/recipes" className="btn-primary">
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card group overflow-hidden"
            >
              <div className="relative -mx-6 -mt-6 mb-4">
                <Link to={`/recipes/${recipe._id}`}>
                  <img
                    src={
                      recipe.image?.url ||
                      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                    }
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(recipe._id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
                <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-savora-green-600 text-xs font-medium rounded-full">
                  {recipe.category}
                </span>
              </div>

              <Link to={`/recipes/${recipe._id}`}>
                <h3 className="font-serif font-semibold text-savora-brown-800 mb-2 group-hover:text-savora-green-600 transition-colors">
                  {recipe.title}
                </h3>
              </Link>
              <p className="text-sm text-savora-brown-500 line-clamp-2 mb-4">
                {recipe.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-savora-brown-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="w-4 h-4" />
                  <span>{recipe.difficulty || "Medium"}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
