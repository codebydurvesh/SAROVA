import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  Filter,
  ChefHat,
} from "lucide-react";
import recipeService from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Recipe card component
 */
const RecipeCard = ({ recipe, onLike }) => {
  const { isAuthenticated, isFavorite } = useAuth();
  const isLiked = recipe.likes?.includes(recipe.userId);

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
              <span className="text-xs text-savora-brown-400">
                {recipe.prepTime + recipe.cookTime} min
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-savora-beige-200">
            <button
              onClick={() => onLike(recipe._id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isLiked
                  ? "text-red-500"
                  : "text-savora-brown-400 hover:text-red-500"
              }`}
              disabled={!isAuthenticated}
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

            <button className="flex items-center gap-1.5 text-sm text-savora-brown-400 hover:text-savora-green-600 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image - Right side */}
        <Link
          to={`/recipes/${recipe._id}`}
          className="sm:w-60 sm:h-48 flex-shrink-0"
        >
          <img
            src={recipe.image?.url || "/placeholder-recipe.jpg"}
            alt={recipe.title}
            className="w-full h-48 sm:h-full object-cover rounded-xl"
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
      const params = {};
      if (category) params.category = category;
      if (dietType) params.dietType = dietType;
      if (search) params.search = search;

      const response = await recipeService.getRecipes(params);
      setRecipes(response.data.recipes);
    } catch (err) {
      setError("Failed to load recipes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleLike = async (recipeId) => {
    try {
      await recipeService.toggleLike(recipeId);
      fetchRecipes(); // Refresh to get updated like count
    } catch (err) {
      console.error("Failed to like recipe:", err);
    }
  };

  // Sample recipes for display when no backend data
  // Note: These are display-only samples - clicking will show "Recipe not found"
  const sampleRecipes = [
    {
      _id: "sample_recipe_001",
      title: "Mediterranean Quinoa Bowl",
      description:
        "A healthy and colorful bowl featuring fluffy quinoa, fresh vegetables, creamy hummus, and a tangy lemon dressing.",
      image: {
        url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
      },
      category: "Lunch",
      prepTime: 15,
      cookTime: 20,
      likes: [],
      comments: [],
      isSample: true,
    },
    {
      _id: "sample_recipe_002",
      title: "Classic Avocado Toast",
      description:
        "Perfectly toasted sourdough bread topped with creamy avocado, cherry tomatoes, microgreens, and a drizzle of olive oil.",
      image: {
        url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500",
      },
      category: "Breakfast",
      prepTime: 5,
      cookTime: 5,
      likes: [],
      comments: [],
      isSample: true,
    },
    {
      _id: "sample_recipe_003",
      title: "Thai Green Curry",
      description:
        "Aromatic and spicy Thai green curry with tender chicken, bamboo shoots, and Thai basil in rich coconut milk.",
      image: {
        url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500",
      },
      category: "Dinner",
      prepTime: 20,
      cookTime: 25,
      likes: [],
      comments: [],
      isSample: true,
    },
    {
      _id: "sample_recipe_004",
      title: "Berry Smoothie Bowl",
      description:
        "A refreshing blend of mixed berries, banana, and almond milk topped with granola, fresh fruits, and chia seeds.",
      image: {
        url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500",
      },
      category: "Breakfast",
      prepTime: 10,
      cookTime: 0,
      likes: [],
      comments: [],
      isSample: true,
    },
  ];

  const displayRecipes = recipes.length > 0 ? recipes : sampleRecipes;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-2">
          Recipes
        </h1>
        <p className="text-savora-brown-500">
          Discover delicious recipes for every occasion
        </p>
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
      </div>

      {/* Recipes List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-savora-brown-500">{error}</p>
        </div>
      ) : displayRecipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-savora-brown-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-savora-brown-700 mb-2">
            No recipes found
          </h3>
          <p className="text-savora-brown-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} onLike={handleLike} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
