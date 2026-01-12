import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  Check,
} from "lucide-react";
import recipeService from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Recipe detail page
 * Full recipe view with ingredients and steps
 */
const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, toggleFavorite, isFavorite } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback image
  const fallbackImage =
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800";

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    // Check if current user has liked this recipe
    if (recipe && user) {
      const liked = recipe.likes?.some(
        (like) => like.toString() === user._id?.toString()
      );
      setIsLiked(liked);
    }
  }, [recipe, user]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipeService.getRecipeById(id);
      setRecipe(response.data.recipe);
    } catch (err) {
      setError(err.response?.data?.message || "Recipe not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const response = await recipeService.toggleLike(id);
      setIsLiked(response.data.isLiked);
      fetchRecipe();
    } catch (err) {
      console.error("Failed to like recipe:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await recipeService.addComment(id, comment);
      setComment("");
      fetchRecipe();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await toggleFavorite(id);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/recipes/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title || "SAVORA Recipe",
          text: recipe?.description || "Check out this recipe!",
          url: url,
        });
      } catch (err) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-savora-brown-800 mb-2">
            {error || "Recipe not found"}
          </h2>
          <Link to="/recipes" className="link">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        to="/recipes"
        className="inline-flex items-center gap-2 text-savora-brown-500 hover:text-savora-green-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to recipes
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero image */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img
            src={
              imageError ? fallbackImage : recipe.image?.url || fallbackImage
            }
            alt={recipe.title}
            className="w-full h-64 sm:h-96 object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-savora-green-600 text-sm font-medium rounded-full">
              {recipe.category}
            </span>
            {recipe.dietType && (
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-savora-brown-600 text-sm font-medium rounded-full">
                {recipe.dietType}
              </span>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-4">
            {recipe.title}
          </h1>

          <p className="text-savora-brown-500 text-lg leading-relaxed mb-4">
            {recipe.description}
          </p>

          {/* Author */}
          {recipe.author?.name && (
            <p className="text-savora-brown-500 mb-6">
              Recipe by{" "}
              <span className="font-semibold text-savora-green-600">
                {recipe.author.name}
              </span>
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-savora-brown-500">
              <Clock className="w-5 h-5" />
              <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
            </div>
            <div className="flex items-center gap-2 text-savora-brown-500">
              <Users className="w-5 h-5" />
              <span>{recipe.servings || 2} servings</span>
            </div>
            <div className="flex items-center gap-2 text-savora-brown-500">
              <ChefHat className="w-5 h-5" />
              <span>{recipe.difficulty || "Medium"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pb-6 border-b border-savora-beige-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "bg-savora-beige-100 text-savora-brown-500 hover:bg-savora-beige-200"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span>{recipe.likes?.length || 0}</span>
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                isFavorite(id)
                  ? "bg-savora-green-50 text-savora-green-600"
                  : "bg-savora-beige-100 text-savora-brown-500 hover:bg-savora-beige-200"
              }`}
            >
              <BookmarkPlus className="w-5 h-5" />
              <span>Save</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-savora-beige-100 text-savora-brown-500 hover:bg-savora-beige-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-serif font-semibold text-savora-brown-800 mb-4">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-savora-brown-600"
                  >
                    <span className="w-2 h-2 bg-savora-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>
                      <strong className="font-medium">
                        {ingredient.quantity}
                      </strong>{" "}
                      {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-serif font-semibold text-savora-brown-800 mb-6">
              Instructions
            </h2>
            <ol className="space-y-6">
              {recipe.steps?.map((step) => (
                <li key={step.stepNumber} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-savora-green-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {step.stepNumber}
                  </span>
                  <p className="text-savora-brown-600 leading-relaxed pt-1">
                    {step.instruction}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Comments section */}
        <div className="border-t border-savora-beige-200 pt-8">
          <h2 className="text-xl font-serif font-semibold text-savora-brown-800 mb-6">
            Comments ({recipe.comments?.length || 0})
          </h2>

          {/* Comment form */}
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isAuthenticated ? "Share your thoughts..." : "Login to comment"
              }
              className="input min-h-24 mb-4"
              disabled={!isAuthenticated}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={!isAuthenticated || !comment.trim()}
            >
              Post Comment
            </button>
          </form>

          {/* Comments list */}
          {recipe.comments?.length > 0 ? (
            <div className="space-y-4">
              {recipe.comments.map((c, index) => (
                <div key={index} className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-savora-green-100 rounded-full flex items-center justify-center">
                      <span className="text-savora-green-600 font-semibold">
                        {c.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-savora-brown-800">
                        {c.user?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-savora-brown-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-savora-brown-600">{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-savora-brown-400 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </motion.article>
    </div>
  );
};

export default RecipeDetail;
