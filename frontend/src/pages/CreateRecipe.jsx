import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Plus,
  Minus,
  ChefHat,
  Clock,
  Users,
} from "lucide-react";
import recipeService from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Create Recipe page
 * Form to add a new recipe
 */
const CreateRecipe = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Lunch",
    dietType: "Balanced",
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    difficulty: "Medium",
    image: null,
    ingredients: [{ name: "", quantity: "" }],
    steps: [{ stepNumber: 1, instruction: "" }],
  });

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Beverage",
  ];
  const dietTypes = ["Balanced", "Keto", "Vegan", "Intermittent", "Fasting"];
  const difficulties = ["Easy", "Medium", "Hard"];

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <ChefHat className="w-20 h-20 text-savora-brown-300 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-savora-brown-800 mb-2">
            Sign in to create recipes
          </h2>
          <p className="text-savora-brown-500 mb-8">
            Create an account to share your favorite recipes
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "" }],
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { stepNumber: index + 1, instruction: value };
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        { stepNumber: prev.steps.length + 1, instruction: "" },
      ],
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNumber: i + 1 }));
      setFormData((prev) => ({ ...prev, steps: newSteps }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter a recipe title");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }
    if (!formData.image) {
      setError("Please upload a recipe image");
      return;
    }
    if (
      formData.ingredients.some((i) => !i.name.trim() || !i.quantity.trim())
    ) {
      setError("Please fill in all ingredients");
      return;
    }
    if (formData.steps.some((s) => !s.instruction.trim())) {
      setError("Please fill in all steps");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("dietType", formData.dietType);
      submitData.append("prepTime", formData.prepTime);
      submitData.append("cookTime", formData.cookTime);
      submitData.append("servings", formData.servings);
      submitData.append("difficulty", formData.difficulty);
      submitData.append("image", formData.image);
      submitData.append("ingredients", JSON.stringify(formData.ingredients));
      submitData.append("steps", JSON.stringify(formData.steps));

      const response = await recipeService.createRecipe(submitData);
      navigate(`/recipes/${response.data.recipe._id}`);
    } catch (err) {
      console.error("Failed to create recipe:", err);
      setError(err.response?.data?.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-2">
          Create Recipe
        </h1>
        <p className="text-savora-brown-500 mb-8">
          Share your culinary creations with the community
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image upload */}
          <div className="card">
            <h2 className="text-lg font-serif font-semibold text-savora-brown-800 mb-4">
              Recipe Image
            </h2>
            <div className="relative">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, image: null }));
                    }}
                    className="absolute top-4 right-4 px-3 py-1 bg-white/90 text-savora-brown-600 rounded-lg text-sm"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-savora-beige-300 rounded-xl cursor-pointer hover:border-savora-green-400 transition-colors">
                  <Upload className="w-12 h-12 text-savora-brown-300 mb-4" />
                  <span className="text-savora-brown-500">
                    Click to upload image
                  </span>
                  <span className="text-sm text-savora-brown-400 mt-1">
                    PNG, JPG up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic info */}
          <div className="card">
            <h2 className="text-lg font-serif font-semibold text-savora-brown-800 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-savora-brown-700 mb-2">
                  Recipe Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Mediterranean Quinoa Bowl"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-savora-brown-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your recipe..."
                  className="input min-h-24"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-savora-brown-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-savora-brown-700 mb-2">
                    Diet Type
                  </label>
                  <select
                    name="dietType"
                    value={formData.dietType}
                    onChange={handleChange}
                    className="input"
                  >
                    {dietTypes.map((diet) => (
                      <option key={diet} value={diet}>
                        {diet}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-savora-brown-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="input"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-savora-brown-700 mb-2">
                    Servings
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    min="1"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-savora-brown-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    min="0"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-savora-brown-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Cook Time (min)
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleChange}
                    min="0"
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold text-savora-brown-800">
                Ingredients
              </h2>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-1 text-sm text-savora-green-600 hover:text-savora-green-700"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                    placeholder="Quantity (e.g., 1 cup)"
                    className="input w-1/3"
                  />
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) =>
                      handleIngredientChange(index, "name", e.target.value)
                    }
                    placeholder="Ingredient name"
                    className="input flex-1"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="w-10 h-10 flex items-center justify-center text-savora-brown-400 hover:text-red-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold text-savora-brown-800">
                Instructions
              </h2>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1 text-sm text-savora-green-600 hover:text-savora-green-700"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>
            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-savora-green-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {step.stepNumber}
                  </span>
                  <textarea
                    value={step.instruction}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`Step ${step.stepNumber} instructions...`}
                    className="input flex-1 min-h-20"
                  />
                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="w-10 h-10 flex items-center justify-center text-savora-brown-400 hover:text-red-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link to="/recipes" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Creating...</span>
                </>
              ) : (
                "Create Recipe"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRecipe;
