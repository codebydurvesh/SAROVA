import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingBag, Search } from "lucide-react";
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

  const cartItem = getCartItem(ingredient._id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    addToCart(ingredient, quantity);
    setQuantity(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card hover:shadow-soft-lg transition-all duration-300 flex flex-col"
      style={{ aspectRatio: "9/12" }}
    >
      {/* Image */}
      <div className="relative h-40 -mx-6 -mt-6 mb-4">
        <img
          src={ingredient.image?.url}
          alt={ingredient.name}
          className="w-full h-full object-cover rounded-t-2xl"
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

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

  // Sample ingredients for display
  // Note: These are display-only samples when no backend data available
  const sampleIngredients = [
    {
      _id: "sample_ingredient_001",
      name: "Tomatoes",
      image: {
        url: "https://images.unsplash.com/photo-1546470427-227c7369a9b9?w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 40,
      description: "Fresh red tomatoes",
    },
    {
      _id: "sample_ingredient_002",
      name: "Onions",
      image: {
        url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 30,
      description: "Fresh onions",
    },
    {
      _id: "sample_ingredient_003",
      name: "Chicken Breast",
      image: {
        url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
      },
      category: "Meat",
      unit: "kg",
      pricePerUnit: 280,
      description: "Boneless chicken breast",
    },
    {
      _id: "sample_ingredient_004",
      name: "Basmati Rice",
      image: {
        url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      },
      category: "Grains",
      unit: "kg",
      pricePerUnit: 120,
      description: "Premium basmati rice",
    },
    {
      _id: "sample_ingredient_005",
      name: "Spinach",
      image: {
        url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
      },
      category: "Vegetables",
      unit: "bunch",
      pricePerUnit: 25,
      description: "Fresh green spinach",
    },
    {
      _id: "sample_ingredient_006",
      name: "Eggs",
      image: {
        url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
      },
      category: "Dairy",
      unit: "dozen",
      pricePerUnit: 80,
      description: "Farm fresh eggs",
    },
    {
      _id: "sample_ingredient_007",
      name: "Garlic",
      image: {
        url: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2f85?w=400",
      },
      category: "Vegetables",
      unit: "100g",
      pricePerUnit: 45,
      description: "Fresh garlic cloves",
    },
    {
      _id: "sample_ingredient_008",
      name: "Olive Oil",
      image: {
        url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
      },
      category: "Other",
      unit: "liter",
      pricePerUnit: 450,
      description: "Extra virgin olive oil",
    },
    {
      _id: "sample_ingredient_009",
      name: "Bell Peppers",
      image: {
        url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 80,
      description: "Mixed color bell peppers",
    },
    {
      _id: "sample_ingredient_010",
      name: "Milk",
      image: {
        url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
      },
      category: "Dairy",
      unit: "liter",
      pricePerUnit: 60,
      description: "Fresh whole milk",
    },
    {
      _id: "sample_ingredient_011",
      name: "Salmon",
      image: {
        url: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400",
      },
      category: "Seafood",
      unit: "kg",
      pricePerUnit: 800,
      description: "Fresh Atlantic salmon",
    },
    {
      _id: "sample_ingredient_012",
      name: "Avocado",
      image: {
        url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400",
      },
      category: "Fruits",
      unit: "piece",
      pricePerUnit: 120,
      description: "Ripe Hass avocado",
    },
  ];

  useEffect(() => {
    fetchIngredients();
  }, [category]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await ingredientService.getIngredients(params);
      setIngredients(response.data.ingredients);
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
      // Use sample data on error
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIngredients();
  };

  // Filter sample ingredients based on category
  const filteredSamples = category
    ? sampleIngredients.filter((i) => i.category === category)
    : sampleIngredients;

  const displayIngredients =
    ingredients.length > 0 ? ingredients : filteredSamples;

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
      ) : displayIngredients.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-savora-brown-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-savora-brown-700 mb-2">
            No ingredients found
          </h3>
          <p className="text-savora-brown-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayIngredients.map((ingredient) => (
            <IngredientCard key={ingredient._id} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shopping;
