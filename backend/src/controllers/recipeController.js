import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { cloudinary } from "../config/cloudinary.js";

/**
 * Helper function to validate MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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
  const { id } = req.params;

  // Validate ObjectId format
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid recipe ID format");
  }

  const recipe = await Recipe.findById(id)
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
  const { id } = req.params;

  // Validate ObjectId format
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid recipe ID format");
  }

  const recipe = await Recipe.findById(id);

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
  const { id } = req.params;
  const { text } = req.body;

  // Validate ObjectId format
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid recipe ID format");
  }

  if (!text) {
    throw new ApiError(400, "Comment text is required");
  }

  const recipe = await Recipe.findById(id);

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
  const { id } = req.params;

  // Validate ObjectId format
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid recipe ID format");
  }

  const recipe = await Recipe.findById(id);

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

  await Recipe.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Recipe deleted successfully",
  });
});

/**
 * @desc    Seed sample recipes
 * @route   POST /api/recipes/seed
 * @access  Public
 */
export const seedRecipes = asyncHandler(async (req, res) => {
  // Check for force reseed
  const force = req.query.force === "true" || req.query.force === true;
  const existingCount = await Recipe.countDocuments();
  if (existingCount > 0 && !force) {
    return res.status(200).json({
      success: true,
      message: `${existingCount} recipes already exist. Skipping seed.`,
    });
  }

  // If force, delete all recipes
  if (force && existingCount > 0) {
    await Recipe.deleteMany({});
  }

  // Create a system user for sample recipes if not exists
  let systemUser = await User.findOne({ email: "savora@recipes.com" });
  if (!systemUser) {
    systemUser = await User.create({
      name: "SAVORA Kitchen",
      email: "savora@recipes.com",
      password: "SavoraSystem123!",
    });
  }

  const sampleRecipes = [
    {
      title: "Classic Pancakes",
      description:
        "Fluffy, golden pancakes perfect for a weekend breakfast. Serve with maple syrup and fresh berries for the ultimate morning treat.",
      image: {
        url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-pancakes",
      },
      ingredients: [
        { name: "All-purpose flour", quantity: "2 cups" },
        { name: "Milk", quantity: "1.5 cups" },
        { name: "Eggs", quantity: "2 large" },
        { name: "Sugar", quantity: "3 tbsp" },
        { name: "Baking powder", quantity: "2 tsp" },
        { name: "Butter", quantity: "4 tbsp melted" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction:
            "Mix flour, sugar, baking powder, and salt in a large bowl.",
        },
        {
          stepNumber: 2,
          instruction:
            "In another bowl, whisk together milk, eggs, and melted butter.",
        },
        {
          stepNumber: 3,
          instruction:
            "Pour wet ingredients into dry ingredients and mix until just combined.",
        },
        {
          stepNumber: 4,
          instruction:
            "Heat a non-stick pan over medium heat and pour 1/4 cup batter per pancake.",
        },
        {
          stepNumber: 5,
          instruction:
            "Cook until bubbles form on surface, then flip and cook until golden.",
        },
      ],
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      difficulty: "Easy",
      category: "Breakfast",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Avocado Toast with Poached Egg",
      description:
        "A trendy and nutritious breakfast featuring creamy avocado on crispy toast topped with a perfectly poached egg.",
      image: {
        url: "https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-avocado-toast",
      },
      ingredients: [
        { name: "Sourdough bread", quantity: "2 slices" },
        { name: "Ripe avocado", quantity: "1 large" },
        { name: "Eggs", quantity: "2" },
        { name: "Lemon juice", quantity: "1 tsp" },
        { name: "Red pepper flakes", quantity: "1/4 tsp" },
        { name: "Salt and pepper", quantity: "to taste" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: "Toast the sourdough bread until golden and crispy.",
        },
        {
          stepNumber: 2,
          instruction: "Mash avocado with lemon juice, salt, and pepper.",
        },
        {
          stepNumber: 3,
          instruction:
            "Bring water to a gentle simmer and add a splash of vinegar.",
        },
        {
          stepNumber: 4,
          instruction:
            "Create a whirlpool and carefully drop in eggs to poach for 3-4 minutes.",
        },
        {
          stepNumber: 5,
          instruction:
            "Spread avocado on toast, top with poached egg and red pepper flakes.",
        },
      ],
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      difficulty: "Medium",
      category: "Breakfast",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Grilled Chicken Caesar Salad",
      description:
        "A classic Caesar salad with juicy grilled chicken, crisp romaine lettuce, parmesan cheese, and homemade croutons.",
      image: {
        url: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-caesar-salad",
      },
      ingredients: [
        { name: "Chicken breast", quantity: "2 pieces" },
        { name: "Romaine lettuce", quantity: "1 large head" },
        { name: "Parmesan cheese", quantity: "1/2 cup grated" },
        { name: "Caesar dressing", quantity: "1/2 cup" },
        { name: "Croutons", quantity: "1 cup" },
        { name: "Olive oil", quantity: "2 tbsp" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction:
            "Season chicken breasts with salt, pepper, and olive oil.",
        },
        {
          stepNumber: 2,
          instruction:
            "Grill chicken for 6-7 minutes per side until cooked through.",
        },
        {
          stepNumber: 3,
          instruction: "Let chicken rest for 5 minutes, then slice.",
        },
        {
          stepNumber: 4,
          instruction: "Chop romaine lettuce and place in a large bowl.",
        },
        {
          stepNumber: 5,
          instruction:
            "Toss with Caesar dressing, top with chicken, parmesan, and croutons.",
        },
      ],
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      difficulty: "Easy",
      category: "Lunch",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Vegetable Stir Fry",
      description:
        "A colorful and healthy stir fry loaded with fresh vegetables in a savory sauce. Ready in under 20 minutes!",
      image: {
        url: "https://images.pexels.com/photos/262897/pexels-photo-262897.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-stir-fry",
      },
      ingredients: [
        { name: "Broccoli florets", quantity: "2 cups" },
        { name: "Bell peppers", quantity: "2 mixed colors" },
        { name: "Carrots", quantity: "2 sliced" },
        { name: "Soy sauce", quantity: "3 tbsp" },
        { name: "Garlic", quantity: "4 cloves minced" },
        { name: "Ginger", quantity: "1 tbsp minced" },
        { name: "Sesame oil", quantity: "2 tbsp" },
      ],
      steps: [
        { stepNumber: 1, instruction: "Prep all vegetables and set aside." },
        {
          stepNumber: 2,
          instruction: "Heat sesame oil in a wok or large pan over high heat.",
        },
        {
          stepNumber: 3,
          instruction: "Add garlic and ginger, stir for 30 seconds.",
        },
        {
          stepNumber: 4,
          instruction:
            "Add vegetables starting with carrots, then broccoli, then peppers.",
        },
        {
          stepNumber: 5,
          instruction:
            "Add soy sauce and toss until vegetables are tender-crisp.",
        },
      ],
      prepTime: 15,
      cookTime: 10,
      servings: 4,
      difficulty: "Easy",
      category: "Dinner",
      dietType: "Vegan",
      author: systemUser._id,
    },
    {
      title: "Spaghetti Carbonara",
      description:
        "An authentic Italian pasta dish with crispy pancetta, eggs, parmesan, and black pepper. Simple yet incredibly delicious.",
      image: {
        url: "https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-carbonara",
      },
      ingredients: [
        { name: "Spaghetti", quantity: "400g" },
        { name: "Pancetta or bacon", quantity: "200g diced" },
        { name: "Eggs", quantity: "4 large" },
        { name: "Parmesan cheese", quantity: "1 cup grated" },
        { name: "Black pepper", quantity: "2 tsp freshly ground" },
        { name: "Garlic", quantity: "2 cloves" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: "Cook spaghetti in salted boiling water until al dente.",
        },
        {
          stepNumber: 2,
          instruction: "While pasta cooks, fry pancetta until crispy.",
        },
        {
          stepNumber: 3,
          instruction: "Whisk together eggs, parmesan, and black pepper.",
        },
        {
          stepNumber: 4,
          instruction: "Drain pasta, reserving 1 cup pasta water.",
        },
        {
          stepNumber: 5,
          instruction:
            "Toss hot pasta with pancetta, remove from heat, add egg mixture and toss quickly.",
        },
      ],
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      difficulty: "Medium",
      category: "Dinner",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Thai Green Curry",
      description:
        "A fragrant and creamy Thai curry with vegetables and aromatic herbs. Customize with your choice of protein.",
      image: {
        url: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-green-curry",
      },
      ingredients: [
        { name: "Coconut milk", quantity: "400ml can" },
        { name: "Green curry paste", quantity: "3 tbsp" },
        { name: "Chicken or tofu", quantity: "500g cubed" },
        { name: "Thai basil", quantity: "1 cup leaves" },
        { name: "Bamboo shoots", quantity: "1 cup" },
        { name: "Fish sauce", quantity: "2 tbsp" },
        { name: "Brown sugar", quantity: "1 tbsp" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction:
            "Heat a splash of coconut milk in a wok and fry curry paste for 1 minute.",
        },
        {
          stepNumber: 2,
          instruction: "Add protein and cook until lightly browned.",
        },
        {
          stepNumber: 3,
          instruction: "Pour in remaining coconut milk and bring to a simmer.",
        },
        {
          stepNumber: 4,
          instruction:
            "Add bamboo shoots, fish sauce, and sugar. Simmer for 10 minutes.",
        },
        {
          stepNumber: 5,
          instruction: "Stir in Thai basil and serve over jasmine rice.",
        },
      ],
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: "Medium",
      category: "Dinner",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Berry Smoothie Bowl",
      description:
        "A thick and creamy smoothie bowl topped with fresh fruits, granola, and chia seeds. The perfect healthy breakfast.",
      image: {
        url: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-smoothie-bowl",
      },
      ingredients: [
        { name: "Frozen mixed berries", quantity: "2 cups" },
        { name: "Banana", quantity: "1 frozen" },
        { name: "Greek yogurt", quantity: "1/2 cup" },
        { name: "Almond milk", quantity: "1/4 cup" },
        { name: "Granola", quantity: "1/4 cup" },
        { name: "Chia seeds", quantity: "1 tbsp" },
        { name: "Fresh berries", quantity: "for topping" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction:
            "Add frozen berries, banana, yogurt, and almond milk to a blender.",
        },
        {
          stepNumber: 2,
          instruction:
            "Blend until thick and creamy, using minimal liquid for thickness.",
        },
        { stepNumber: 3, instruction: "Pour into a bowl." },
        {
          stepNumber: 4,
          instruction: "Top with granola, chia seeds, and fresh berries.",
        },
        {
          stepNumber: 5,
          instruction: "Serve immediately and enjoy with a spoon!",
        },
      ],
      prepTime: 10,
      cookTime: 0,
      servings: 1,
      difficulty: "Easy",
      category: "Breakfast",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Beef Tacos",
      description:
        "Delicious Mexican-style tacos with seasoned ground beef, fresh salsa, and all your favorite toppings.",
      image: {
        url: "https://media.istockphoto.com/id/1333647378/photo/homemade-american-soft-shell-beef-tacos.jpg?s=612x612&w=0&k=20&c=ZHhpFNbH_BO4MaXzmcKLjC4cPRptdXlp6IVUfs1sBEs=",
        publicId: "sample-tacos",
      },
      ingredients: [
        { name: "Ground beef", quantity: "500g" },
        { name: "Taco shells", quantity: "8 pieces" },
        { name: "Taco seasoning", quantity: "2 tbsp" },
        { name: "Lettuce", quantity: "1 cup shredded" },
        { name: "Tomatoes", quantity: "2 diced" },
        { name: "Cheddar cheese", quantity: "1 cup shredded" },
        { name: "Sour cream", quantity: "1/2 cup" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: "Brown ground beef in a skillet over medium-high heat.",
        },
        {
          stepNumber: 2,
          instruction:
            "Add taco seasoning and 1/4 cup water, simmer for 5 minutes.",
        },
        {
          stepNumber: 3,
          instruction: "Warm taco shells according to package directions.",
        },
        { stepNumber: 4, instruction: "Fill shells with seasoned beef." },
        {
          stepNumber: 5,
          instruction: "Top with lettuce, tomatoes, cheese, and sour cream.",
        },
      ],
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: "Easy",
      category: "Dinner",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Mushroom Risotto",
      description:
        "Creamy Italian risotto with sautéed mushrooms, parmesan, and fresh herbs. A comforting and elegant dish.",
      image: {
        url: "https://images.pexels.com/photos/6419720/pexels-photo-6419720.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-risotto",
      },
      ingredients: [
        { name: "Arborio rice", quantity: "1.5 cups" },
        { name: "Mixed mushrooms", quantity: "300g sliced" },
        { name: "Vegetable broth", quantity: "4 cups warm" },
        { name: "White wine", quantity: "1/2 cup" },
        { name: "Parmesan cheese", quantity: "1/2 cup grated" },
        { name: "Butter", quantity: "4 tbsp" },
        { name: "Shallots", quantity: "2 minced" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: "Sauté mushrooms in butter until golden, set aside.",
        },
        {
          stepNumber: 2,
          instruction:
            "Cook shallots in butter until soft, add rice and toast for 2 minutes.",
        },
        { stepNumber: 3, instruction: "Add wine and stir until absorbed." },
        {
          stepNumber: 4,
          instruction:
            "Add warm broth one ladle at a time, stirring constantly.",
        },
        {
          stepNumber: 5,
          instruction:
            "Fold in mushrooms and parmesan when rice is creamy and al dente.",
        },
      ],
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: "Hard",
      category: "Dinner",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Chocolate Lava Cake",
      description:
        "Decadent individual chocolate cakes with a molten center. An impressive dessert that's easier than you think!",
      image: {
        url: "https://media.istockphoto.com/id/544716244/photo/warm-chocolate-lava-cake-with-molten-center-and-red-currants.jpg?s=612x612&w=0&k=20&c=i1rRa1x7D1pu-INKabmC21BaU9MC8ZRQdcC7dBLdzUo=",
        publicId: "sample-lava-cake",
      },
      ingredients: [
        { name: "Dark chocolate", quantity: "200g" },
        { name: "Butter", quantity: "100g" },
        { name: "Eggs", quantity: "4" },
        { name: "Sugar", quantity: "100g" },
        { name: "Flour", quantity: "50g" },
        { name: "Vanilla extract", quantity: "1 tsp" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction:
            "Preheat oven to 425°F (220°C). Butter and flour 4 ramekins.",
        },
        {
          stepNumber: 2,
          instruction: "Melt chocolate and butter together, let cool slightly.",
        },
        {
          stepNumber: 3,
          instruction: "Whisk eggs, sugar, and vanilla until thick and pale.",
        },
        {
          stepNumber: 4,
          instruction: "Fold in chocolate mixture and flour until combined.",
        },
        {
          stepNumber: 5,
          instruction:
            "Divide among ramekins and bake for 12-14 minutes until edges are set.",
        },
      ],
      prepTime: 15,
      cookTime: 14,
      servings: 4,
      difficulty: "Medium",
      category: "Dessert",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Greek Salad",
      description:
        "A refreshing Mediterranean salad with ripe tomatoes, cucumbers, olives, and feta cheese. Perfect for summer!",
      image: {
        url: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=800",
        publicId: "sample-greek-salad",
      },
      ingredients: [
        { name: "Cucumbers", quantity: "2 large diced" },
        { name: "Tomatoes", quantity: "4 medium diced" },
        { name: "Red onion", quantity: "1 sliced" },
        { name: "Kalamata olives", quantity: "1/2 cup" },
        { name: "Feta cheese", quantity: "200g cubed" },
        { name: "Olive oil", quantity: "1/4 cup" },
        { name: "Oregano", quantity: "1 tsp dried" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction:
            "Cut cucumbers, tomatoes, and onion into bite-sized pieces.",
        },
        { stepNumber: 2, instruction: "Combine vegetables in a large bowl." },
        { stepNumber: 3, instruction: "Add olives and feta cheese." },
        {
          stepNumber: 4,
          instruction: "Drizzle with olive oil and sprinkle with oregano.",
        },
        { stepNumber: 5, instruction: "Toss gently and serve immediately." },
      ],
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      difficulty: "Easy",
      category: "Lunch",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Banana Bread",
      description:
        "Moist and delicious banana bread made with ripe bananas. A comforting classic that's perfect with coffee.",
      image: {
        url: "https://media.istockphoto.com/id/1147312072/photo/banana-bread-loaf-on-wooden-table.jpg?s=612x612&w=0&k=20&c=BWw5Ew5UhpFimfd6_VkfWXPBpuI0XFpm2Yp90C12Oi4=",
        publicId: "sample-banana-bread",
      },
      ingredients: [
        { name: "Ripe bananas", quantity: "3 large mashed" },
        { name: "All-purpose flour", quantity: "2 cups" },
        { name: "Sugar", quantity: "3/4 cup" },
        { name: "Butter", quantity: "1/3 cup melted" },
        { name: "Egg", quantity: "1 large" },
        { name: "Baking soda", quantity: "1 tsp" },
        { name: "Vanilla extract", quantity: "1 tsp" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction:
            "Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.",
        },
        {
          stepNumber: 2,
          instruction: "Mash bananas in a large bowl until smooth.",
        },
        {
          stepNumber: 3,
          instruction: "Mix in melted butter, sugar, egg, and vanilla.",
        },
        {
          stepNumber: 4,
          instruction: "Stir in flour and baking soda until just combined.",
        },
        {
          stepNumber: 5,
          instruction:
            "Pour into pan and bake for 60-65 minutes until a toothpick comes out clean.",
        },
      ],
      prepTime: 10,
      cookTime: 65,
      servings: 8,
      difficulty: "Easy",
      category: "Dessert",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Chicken Tikka Masala",
      description:
        "Tender chicken pieces in a rich, creamy tomato-based curry sauce. A beloved Indian restaurant favorite.",
      image: {
        url: "https://media.istockphoto.com/id/1735060474/photo/delicious-creamy-chicken-tikka-masala-surrounded-by-ingredients-close-up-in-a-bowl-horizontal.jpg?s=612x612&w=0&k=20&c=85b5F6-g_zxCWaoccAtMyokWho4L1XdNybUBJZyqszk=",
        publicId: "sample-tikka-masala",
      },
      ingredients: [
        { name: "Chicken thighs", quantity: "600g cubed" },
        { name: "Yogurt", quantity: "1 cup" },
        { name: "Tomato puree", quantity: "400g" },
        { name: "Heavy cream", quantity: "1/2 cup" },
        { name: "Garam masala", quantity: "2 tbsp" },
        { name: "Garlic", quantity: "4 cloves minced" },
        { name: "Ginger", quantity: "2 tbsp minced" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction:
            "Marinate chicken in yogurt and half the spices for 1 hour.",
        },
        {
          stepNumber: 2,
          instruction:
            "Grill or pan-fry chicken until charred and cooked through.",
        },
        {
          stepNumber: 3,
          instruction:
            "Sauté garlic and ginger, add remaining spices and tomato puree.",
        },
        {
          stepNumber: 4,
          instruction: "Simmer sauce for 15 minutes, then add cream.",
        },
        {
          stepNumber: 5,
          instruction:
            "Add chicken to sauce, simmer for 5 minutes and serve with rice.",
        },
      ],
      prepTime: 70,
      cookTime: 30,
      servings: 4,
      difficulty: "Medium",
      category: "Dinner",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Veggie Buddha Bowl",
      description:
        "A nourishing bowl filled with roasted vegetables, quinoa, chickpeas, and tahini dressing. Colorful and satisfying!",
      image: {
        url: "https://media.istockphoto.com/id/878734076/photo/healthy-organic-tofu-and-rice-buddha-bowl.jpg?s=612x612&w=0&k=20&c=RE8aZvjQEsr9r3x07IO5HWbaB2PW6xJC-7D9TnjSs9g=",
        publicId: "sample-buddha-bowl",
      },
      ingredients: [
        { name: "Quinoa", quantity: "1 cup cooked" },
        { name: "Sweet potato", quantity: "1 large cubed" },
        { name: "Chickpeas", quantity: "1 can drained" },
        { name: "Kale", quantity: "2 cups chopped" },
        { name: "Avocado", quantity: "1 sliced" },
        { name: "Tahini", quantity: "3 tbsp" },
        { name: "Lemon juice", quantity: "2 tbsp" },
      ],
      steps: [
        { stepNumber: 1, instruction: "Preheat oven to 400°F (200°C)." },
        {
          stepNumber: 2,
          instruction:
            "Roast sweet potato and chickpeas with olive oil for 25 minutes.",
        },
        {
          stepNumber: 3,
          instruction: "Cook quinoa according to package directions.",
        },
        {
          stepNumber: 4,
          instruction: "Massage kale with a little olive oil and salt.",
        },
        {
          stepNumber: 5,
          instruction:
            "Assemble bowls with quinoa, veggies, and drizzle with tahini-lemon dressing.",
        },
      ],
      prepTime: 15,
      cookTime: 25,
      servings: 2,
      difficulty: "Easy",
      category: "Lunch",
      dietType: "Vegan",
      author: systemUser._id,
    },
    {
      title: "Mango Lassi",
      description:
        "A refreshing Indian yogurt drink blended with sweet mango and cardamom. Perfect for cooling down on hot days.",
      image: {
        url: "https://media.istockphoto.com/id/1365859011/photo/drink-mango-lassi-in-two-glasses-on-rustic-concrete-table-with-fresh-ripe-cut-manfo-from-above.jpg?s=612x612&w=0&k=20&c=uHnr_0raQDe2sgUYHdP5GSa2raaj3ILG4m1cmFHtVJA=",
        publicId: "sample-mango-lassi",
      },
      ingredients: [
        { name: "Mango", quantity: "2 cups cubed" },
        { name: "Plain yogurt", quantity: "1 cup" },
        { name: "Milk", quantity: "1/2 cup" },
        { name: "Sugar", quantity: "2 tbsp" },
        { name: "Cardamom powder", quantity: "1/4 tsp" },
        { name: "Ice cubes", quantity: "1 cup" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: "Add mango, yogurt, milk, and sugar to a blender.",
        },
        { stepNumber: 2, instruction: "Add ice cubes and cardamom powder." },
        { stepNumber: 3, instruction: "Blend until smooth and frothy." },
        { stepNumber: 4, instruction: "Taste and adjust sweetness if needed." },
        {
          stepNumber: 5,
          instruction:
            "Pour into glasses and garnish with a pinch of cardamom.",
        },
      ],
      prepTime: 5,
      cookTime: 0,
      servings: 2,
      difficulty: "Easy",
      category: "Beverage",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Caprese Sandwich",
      description:
        "A simple Italian sandwich with fresh mozzarella, ripe tomatoes, basil, and balsamic glaze on crusty bread.",
      image: {
        url: "https://media.istockphoto.com/id/1449737577/photo/pressed-and-toasted-panini-caprese-with-tomato-mozzarella-and-basil-caprese-panini-sandwich.jpg?s=612x612&w=0&k=20&c=PwBOktstNbfO0n0fXxcGkZKQpZbiB6aASl-sSw_40RA=",
        publicId: "sample-caprese",
      },
      ingredients: [
        { name: "Ciabatta bread", quantity: "1 loaf" },
        { name: "Fresh mozzarella", quantity: "200g sliced" },
        { name: "Tomatoes", quantity: "2 large sliced" },
        { name: "Fresh basil", quantity: "1 bunch" },
        { name: "Balsamic glaze", quantity: "2 tbsp" },
        { name: "Olive oil", quantity: "2 tbsp" },
      ],
      steps: [
        { stepNumber: 1, instruction: "Slice ciabatta bread horizontally." },
        { stepNumber: 2, instruction: "Drizzle cut sides with olive oil." },
        {
          stepNumber: 3,
          instruction: "Layer mozzarella slices on bottom half.",
        },
        {
          stepNumber: 4,
          instruction: "Add tomato slices and fresh basil leaves.",
        },
        {
          stepNumber: 5,
          instruction:
            "Drizzle with balsamic glaze, top with bread, and slice.",
        },
      ],
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      difficulty: "Easy",
      category: "Lunch",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Shrimp Scampi",
      description:
        "Succulent shrimp sautéed in garlic butter and white wine, served over linguine. Restaurant quality at home!",
      image: {
        url: "https://media.istockphoto.com/id/1352567176/photo/homemade-cooked-shrimp-scampi-with-pasta.jpg?s=612x612&w=0&k=20&c=tnsG6m4i8IgZ3wdJ57f8tGivJ-BQwv8OslolWq1KciI=",
        publicId: "sample-shrimp-scampi",
      },
      ingredients: [
        { name: "Large shrimp", quantity: "500g peeled" },
        { name: "Linguine", quantity: "400g" },
        { name: "Garlic", quantity: "6 cloves minced" },
        { name: "Butter", quantity: "4 tbsp" },
        { name: "White wine", quantity: "1/2 cup" },
        { name: "Lemon juice", quantity: "3 tbsp" },
        { name: "Parsley", quantity: "1/4 cup chopped" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: "Cook linguine according to package directions.",
        },
        {
          stepNumber: 2,
          instruction: "Sauté garlic in butter until fragrant.",
        },
        {
          stepNumber: 3,
          instruction:
            "Add shrimp and cook until pink, about 2-3 minutes per side.",
        },
        {
          stepNumber: 4,
          instruction: "Add wine and lemon juice, simmer for 2 minutes.",
        },
        {
          stepNumber: 5,
          instruction: "Toss with pasta and parsley, serve immediately.",
        },
      ],
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      difficulty: "Medium",
      category: "Dinner",
      dietType: "Balanced",
      author: systemUser._id,
    },
    {
      title: "Keto Cauliflower Fried Rice",
      description:
        "A low-carb alternative to fried rice using cauliflower. Packed with vegetables and Asian flavors!",
      image: {
        url: "https://media.istockphoto.com/id/1132523140/photo/stir-fried-cauliflower-rice-in-a-bowl.jpg?s=612x612&w=0&k=20&c=Yw8VG2C-b_UHWZRSpCQNra88cwW-W-sW8z7TkKmI-oE=",
        publicId: "sample-cauliflower-rice",
      },
      ingredients: [
        { name: "Cauliflower", quantity: "1 large head" },
        { name: "Eggs", quantity: "3 beaten" },
        { name: "Peas and carrots", quantity: "1 cup" },
        { name: "Green onions", quantity: "4 chopped" },
        { name: "Soy sauce", quantity: "3 tbsp" },
        { name: "Sesame oil", quantity: "2 tbsp" },
        { name: "Garlic", quantity: "3 cloves minced" },
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: "Pulse cauliflower in food processor until rice-sized.",
        },
        {
          stepNumber: 2,
          instruction: "Heat sesame oil in a large wok over high heat.",
        },
        {
          stepNumber: 3,
          instruction: "Scramble eggs, set aside. Sauté garlic and vegetables.",
        },
        {
          stepNumber: 4,
          instruction: "Add cauliflower rice and cook for 5-7 minutes.",
        },
        {
          stepNumber: 5,
          instruction: "Add soy sauce, eggs, and green onions. Toss and serve.",
        },
      ],
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      difficulty: "Easy",
      category: "Dinner",
      dietType: "Keto",
      author: systemUser._id,
    },
  ];

  const recipes = await Recipe.insertMany(sampleRecipes);

  res.status(201).json({
    success: true,
    message: `${recipes.length} sample recipes created successfully`,
    data: { count: recipes.length },
  });
});
