import Recipe from "../models/Recipe.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { cloudinary } from "../config/cloudinary.js";

/**
 * @desc    Get all recipes
 * @route   GET /api/recipes
 * @access  Public
 */
export const getRecipes = asyncHandler(async (req, res) => {
  const { category, dietType, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};

  if (category) query.category = category;
  if (dietType) query.dietType = dietType;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const recipes = await Recipe.find(query)
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Recipe.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

/**
 * @desc    Get single recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate("author", "name")
    .populate("comments.user", "name");

  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }

  res.status(200).json({
    success: true,
    data: { recipe },
  });
});

/**
 * @desc    Create new recipe
 * @route   POST /api/recipes
 * @access  Private
 */
export const createRecipe = asyncHandler(async (req, res) => {
  // Check if image was uploaded
  if (!req.file) {
    throw new ApiError(400, "Please upload a recipe image");
  }

  const {
    title,
    description,
    ingredients,
    steps,
    prepTime,
    cookTime,
    servings,
    difficulty,
    category,
    dietType,
  } = req.body;

  // Parse JSON strings if needed (from form-data)
  const parsedIngredients =
    typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
  const parsedSteps = typeof steps === "string" ? JSON.parse(steps) : steps;

  const recipe = await Recipe.create({
    title,
    description,
    image: {
      url: req.file.path,
      publicId: req.file.filename,
    },
    ingredients: parsedIngredients,
    steps: parsedSteps,
    prepTime: prepTime || 0,
    cookTime: cookTime || 0,
    servings: servings || 1,
    difficulty: difficulty || "Medium",
    category: category || "Lunch",
    dietType: dietType || "Balanced",
    author: req.user._id,
  });

  await recipe.populate("author", "name");

  res.status(201).json({
    success: true,
    message: "Recipe created successfully",
    data: { recipe },
  });
});

/**
 * @desc    Like/Unlike a recipe
 * @route   POST /api/recipes/:id/like
 * @access  Private
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }

  const userId = req.user._id;
  const isLiked = recipe.likes.includes(userId);

  if (isLiked) {
    // Unlike
    recipe.likes = recipe.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    // Like
    recipe.likes.push(userId);
  }

  await recipe.save();

  res.status(200).json({
    success: true,
    message: isLiked ? "Recipe unliked" : "Recipe liked",
    data: { likeCount: recipe.likes.length, isLiked: !isLiked },
  });
});

/**
 * @desc    Add comment to recipe
 * @route   POST /api/recipes/:id/comment
 * @access  Private
 */
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    throw new ApiError(400, "Comment text is required");
  }

  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }

  recipe.comments.push({
    user: req.user._id,
    text,
  });

  await recipe.save();
  await recipe.populate("comments.user", "name");

  res.status(201).json({
    success: true,
    message: "Comment added",
    data: { comments: recipe.comments },
  });
});

/**
 * @desc    Delete recipe
 * @route   DELETE /api/recipes/:id
 * @access  Private
 */
export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }

  // Check if user is the author
  if (recipe.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this recipe");
  }

  // Delete image from Cloudinary
  if (recipe.image.publicId) {
    await cloudinary.uploader.destroy(recipe.image.publicId);
  }

  await Recipe.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Recipe deleted successfully",
  });
});
