import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
} from 'lucide-react';
import recipeService from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Recipe detail page
 * Full recipe view with ingredients and steps
 */
const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, toggleFavorite, isFavorite } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await recipeService.getRecipeById(id);
      setRecipe(response.data.recipe);
    } catch (err) {
      setError('Recipe not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await recipeService.toggleLike(id);
      setIsLiked(response.data.isLiked);
      fetchRecipe();
    } catch (err) {
      console.error('Failed to like recipe:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await recipeService.addComment(id, comment);
      setComment('');
      fetchRecipe();
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await toggleFavorite(id);
  };

  // Sample recipe for display
  const sampleRecipe = {
    _id: id,
    title: 'Mediterranean Quinoa Bowl',
    description: 'A healthy and colorful bowl featuring fluffy quinoa, fresh vegetables, creamy hummus, and a tangy lemon dressing. Perfect for a nutritious lunch or light dinner.',
    image: { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800' },
    category: 'Lunch',
    dietType: 'Balanced',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: 'Easy',
    likes: [],
    comments: [],
    ingredients: [
      { name: 'Quinoa', quantity: '1 cup' },
      { name: 'Cherry tomatoes', quantity: '1 cup, halved' },
      { name: 'Cucumber', quantity: '1 medium, diced' },
      { name: 'Red onion', quantity: '1/4, thinly sliced' },
      { name: 'Kalamata olives', quantity: '1/3 cup' },
      { name: 'Feta cheese', quantity: '1/2 cup, crumbled' },
      { name: 'Hummus', quantity: '1/2 cup' },
      { name: 'Olive oil', quantity: '2 tbsp' },
      { name: 'Lemon juice', quantity: '2 tbsp' },
      { name: 'Fresh herbs', quantity: 'to taste' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Rinse quinoa under cold water and cook according to package instructions. Let it cool slightly.' },
      { stepNumber: 2, instruction: 'While quinoa cooks, prepare all vegetables - halve cherry tomatoes, dice cucumber, and thinly slice red onion.' },
      { stepNumber: 3, instruction: 'In a small bowl, whisk together olive oil, lemon juice, salt, and pepper to make the dressing.' },
      { stepNumber: 4, instruction: 'Divide cooked quinoa between two bowls as the base.' },
      { stepNumber: 5, instruction: 'Arrange cherry tomatoes, cucumber, red onion, and olives on top of the quinoa in sections.' },
      { stepNumber: 6, instruction: 'Add a generous dollop of hummus to each bowl.' },
      { stepNumber: 7, instruction: 'Sprinkle crumbled feta cheese over the top.' },
      { stepNumber: 8, instruction: 'Drizzle with the lemon dressing and garnish with fresh herbs. Serve immediately.' },
    ],
    author: { name: 'SAVORA Kitchen' },
  };

  const displayRecipe = recipe || sampleRecipe;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !sampleRecipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-savora-brown-800 mb-2">
            {error}
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
            src={displayRecipe.image?.url}
            alt={displayRecipe.title}
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-savora-green-600 text-sm font-medium rounded-full">
              {displayRecipe.category}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-4">
            {displayRecipe.title}
          </h1>
          
          <p className="text-savora-brown-500 text-lg leading-relaxed mb-6">
            {displayRecipe.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-savora-brown-500">
              <Clock className="w-5 h-5" />
              <span>{displayRecipe.prepTime + displayRecipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-2 text-savora-brown-500">
              <Users className="w-5 h-5" />
              <span>{displayRecipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2 text-savora-brown-500">
              <ChefHat className="w-5 h-5" />
              <span>{displayRecipe.difficulty}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pb-6 border-b border-savora-beige-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                isLiked
                  ? 'bg-red-50 text-red-500'
                  : 'bg-savora-beige-100 text-savora-brown-500 hover:bg-savora-beige-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{displayRecipe.likes?.length || 0}</span>
            </button>
            
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                isFavorite(id)
                  ? 'bg-savora-green-50 text-savora-green-600'
                  : 'bg-savora-beige-100 text-savora-brown-500 hover:bg-savora-beige-200'
              }`}
            >
              <BookmarkPlus className="w-5 h-5" />
              <span>Save</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-savora-beige-100 text-savora-brown-500 hover:bg-savora-beige-200 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
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
                {displayRecipe.ingredients?.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-savora-brown-600"
                  >
                    <span className="w-2 h-2 bg-savora-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>
                      <strong className="font-medium">{ingredient.quantity}</strong>{' '}
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
              {displayRecipe.steps?.map((step) => (
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
            Comments ({displayRecipe.comments?.length || 0})
          </h2>

          {/* Comment form */}
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isAuthenticated ? 'Share your thoughts...' : 'Login to comment'}
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
          {displayRecipe.comments?.length > 0 ? (
            <div className="space-y-4">
              {displayRecipe.comments.map((c, index) => (
                <div key={index} className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-savora-green-100 rounded-full flex items-center justify-center">
                      <span className="text-savora-green-600 font-semibold">
                        {c.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-savora-brown-800">
                        {c.user?.name || 'Anonymous'}
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
