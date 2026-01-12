import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  ChefHat,
  Plus,
  Check,
  Copy,
} from "lucide-react";
import recipeService from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Recipe card component
 */
const RecipeCard = ({ recipe, onLike, currentUserId }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if current user has liked this recipe
  const isLiked = recipe.likes?.some(
    (like) => like.toString() === currentUserId?.toString()
  );

  // Fallback image
  const fallbackImage =
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600";

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    onLike(recipe._id);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/recipes/${recipe._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: url,
        });
      } catch (err) {
        // User cancelled or error
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  // Don't render if recipe is sample data
  if (recipe.isSample) {
    return null;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-soft-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Content - Left side */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-savora-green-50 text-savora-green-600 text-xs font-medium rounded-full">
                {recipe.category}
              </span>
              {recipe.dietType && (
                <span className="px-3 py-1 bg-savora-beige-100 text-savora-brown-600 text-xs font-medium rounded-full">
                  {recipe.dietType}
                </span>
              )}
              <span className="text-xs text-savora-brown-400">
                {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
              </span>
            </div>

            <Link to={`/recipes/${recipe._id}`}>
              <h3 className="text-xl font-serif font-semibold text-savora-brown-800 mb-2 hover:text-savora-green-600 transition-colors">
                {recipe.title}
              </h3>
            </Link>

            <p className="text-savora-brown-500 text-sm leading-relaxed line-clamp-2">
              {recipe.description}
            </p>

            {/* Author name */}
            {recipe.author?.name && (
              <p className="text-xs text-savora-brown-400 mt-2">
                by{" "}
                <span className="font-medium text-savora-green-600">
                  {recipe.author.name}
                </span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-savora-beige-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isLiked
                  ? "text-red-500"
                  : "text-savora-brown-400 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{recipe.likes?.length || 0}</span>
            </button>

            <Link
              to={`/recipes/${recipe._id}`}
              className="flex items-center gap-1.5 text-sm text-savora-brown-400 hover:text-savora-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{recipe.comments?.length || 0}</span>
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-savora-brown-400 hover:text-savora-green-600 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Image - Right side */}
        <Link
          to={`/recipes/${recipe._id}`}
          className="sm:w-60 sm:h-48 flex-shrink-0"
        >
          <img
            src={
              imageError ? fallbackImage : recipe.image?.url || fallbackImage
            }
            alt={recipe.title}
            className="w-full h-48 sm:h-full object-cover rounded-xl"
            onError={() => setImageError(true)}
          />
        </Link>
      </div>
    </motion.article>
  );
};

/**
 * Recipes page component
 * Displays all recipes with search and filter
 */
const Recipes = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [dietType, setDietType] = useState("");

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Beverage",
  ];
  const dietTypes = ["Balanced", "Keto", "Vegan", "Intermittent", "Fasting"];

  useEffect(() => {
    fetchRecipes();
  }, [category, dietType]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (category) params.category = category;
      if (dietType) params.dietType = dietType;
      if (search) params.search = search;

      const response = await recipeService.getRecipes(params);
      setRecipes(response.data.recipes || []);
    } catch (err) {
      console.error("Failed to load recipes:", err);
      setError("Failed to load recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleLike = async (recipeId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      // Optimistically update UI
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => {
          if (recipe._id !== recipeId) return recipe;
          const hasLiked = recipe.likes?.some(
            (like) => like.toString() === user?._id?.toString()
          );
          let newLikes;
          if (hasLiked) {
            newLikes = recipe.likes.filter(
              (like) => like.toString() !== user?._id?.toString()
            );
          } else {
            newLikes = [...(recipe.likes || []), user._id];
          }
          return { ...recipe, likes: newLikes };
        })
      );
      await recipeService.toggleLike(recipeId);
    } catch (err) {
      console.error("Failed to like recipe:", err);
    }
  };

  const handleClearFilters = () => {
    setCategory("");
    setDietType("");
    setSearch("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-2">
            Recipes
          </h1>
          <p className="text-savora-brown-500">
            Discover delicious recipes for every occasion
          </p>
        </div>

        {isAuthenticated && (
          <Link
            to="/recipes/create"
            className="btn-primary inline-flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            Add Recipe
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-savora-brown-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="input pl-12"
            />
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input sm:w-40"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Diet type filter */}
          <select
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            className="input sm:w-40"
          >
            <option value="">All Diets</option>
            {dietTypes.map((diet) => (
              <option key={diet} value={diet}>
                {diet}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {/* Active filters */}
        {(category || dietType || search) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-savora-beige-200">
            <span className="text-sm text-savora-brown-500">
              Active filters:
            </span>
            {category && (
              <span className="px-2 py-1 bg-savora-green-50 text-savora-green-600 text-xs rounded-full">
                {category}
              </span>
            )}
            {dietType && (
              <span className="px-2 py-1 bg-savora-beige-100 text-savora-brown-600 text-xs rounded-full">
                {dietType}
              </span>
            )}
            {search && (
              <span className="px-2 py-1 bg-savora-brown-100 text-savora-brown-600 text-xs rounded-full">
                "{search}"
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-savora-brown-400 hover:text-savora-brown-600 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Recipes List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-savora-brown-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-savora-brown-700 mb-2">
            {error}
          </h3>
          <button onClick={fetchRecipes} className="btn-primary mt-4">
            Try Again
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-savora-brown-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-savora-brown-700 mb-2">
            No recipes found
          </h3>
          <p className="text-savora-brown-500 mb-6">
            {category || dietType || search
              ? "Try adjusting your search or filters"
              : "Be the first to add a recipe!"}
          </p>
          {isAuthenticated && (
            <Link to="/recipes/create" className="btn-primary">
              Add Your First Recipe
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onLike={handleLike}
              currentUserId={user?._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
