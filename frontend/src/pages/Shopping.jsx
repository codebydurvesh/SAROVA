import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingBag, Search, RefreshCw } from "lucide-react";
import ingredientService from "../services/ingredientService";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Ingredient card component
 */
const IngredientCard = ({ ingredient }) => {
  const { addToCart, getCartItem, incrementQuantity, decrementQuantity } =
    useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const cartItem = getCartItem(ingredient._id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    addToCart(ingredient, quantity);
    setQuantity(1);
  };

  // Fallback image
  const fallbackImage =
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card hover:shadow-soft-lg transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-40 -mx-6 -mt-6 mb-4">
        <img
          src={
            imageError ? fallbackImage : ingredient.image?.url || fallbackImage
          }
          alt={ingredient.name}
          className="w-full h-full object-cover rounded-t-2xl"
          onError={() => setImageError(true)}
        />
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-savora-green-600 text-xs font-medium rounded-full">
          {ingredient.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-serif font-semibold text-savora-brown-800 mb-1">
          {ingredient.name}
        </h3>
        <p className="text-sm text-savora-brown-500 mb-2">
          ₹{ingredient.pricePerUnit} per {ingredient.unit}
        </p>

        {ingredient.description && (
          <p className="text-xs text-savora-brown-400 mb-4 line-clamp-2 flex-1">
            {ingredient.description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto">
          {isInCart ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decrementQuantity(ingredient._id)}
                  className="w-8 h-8 bg-savora-beige-100 rounded-lg flex items-center justify-center hover:bg-savora-beige-200 transition-colors"
                >
                  <Minus className="w-4 h-4 text-savora-brown-600" />
                </button>
                <span className="font-medium text-savora-brown-800 w-8 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => incrementQuantity(ingredient._id)}
                  className="w-8 h-8 bg-savora-beige-100 rounded-lg flex items-center justify-center hover:bg-savora-beige-200 transition-colors"
                >
                  <Plus className="w-4 h-4 text-savora-brown-600" />
                </button>
              </div>
              <span className="text-sm font-medium text-savora-green-600">
                In cart
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-savora-beige-100 rounded-lg flex items-center justify-center hover:bg-savora-beige-200 transition-colors"
                >
                  <Minus className="w-4 h-4 text-savora-brown-600" />
                </button>
                <span className="font-medium text-savora-brown-800 w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-savora-beige-100 rounded-lg flex items-center justify-center hover:bg-savora-beige-200 transition-colors"
                >
                  <Plus className="w-4 h-4 text-savora-brown-600" />
                </button>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary text-sm py-2"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Shopping page component
 * Browse and add ingredients to cart
 */
const Shopping = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  const categories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Meat",
    "Seafood",
    "Grains",
    "Spices",
    "Other",
  ];

  useEffect(() => {
    fetchIngredients();
  }, [category]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await ingredientService.getIngredients(params);
      setIngredients(response.data.ingredients);
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
      setError("Failed to load ingredients. Please try again.");
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedIngredients = async () => {
    try {
      setSeeding(true);
      await ingredientService.seedIngredients();
      await fetchIngredients();
    } catch (err) {
      console.error("Failed to seed ingredients:", err);
      setError("Failed to seed ingredients.");
    } finally {
      setSeeding(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIngredients();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-2">
          Shopping
        </h1>
        <p className="text-savora-brown-500">
          Fresh ingredients delivered to your doorstep
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-savora-brown-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredients..."
              className="input pl-12"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input sm:w-48"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Ingredients Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-savora-brown-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-savora-brown-700 mb-2">
            {error}
          </h3>
          <button onClick={fetchIngredients} className="btn-primary mt-4">
            Try Again
          </button>
        </div>
      ) : ingredients.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-savora-brown-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-savora-brown-700 mb-2">
            No ingredients found
          </h3>
          <p className="text-savora-brown-500 mb-6">
            {category || search
              ? "Try adjusting your search or filters"
              : "Click below to load sample ingredients"}
          </p>
          {!category && !search && (
            <button
              onClick={handleSeedIngredients}
              disabled={seeding}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`}
              />
              {seeding ? "Loading ingredients..." : "Load Sample Ingredients"}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {ingredients.map((ingredient) => (
            <IngredientCard key={ingredient._id} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shopping;
