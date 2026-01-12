import Ingredient from "../models/Ingredient.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Get all ingredients
 * @route   GET /api/ingredients
 * @access  Public
 */
export const getIngredients = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  const query = {};

  if (category) query.category = category;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const ingredients = await Ingredient.find(query).sort({ name: 1 });

  res.status(200).json({
    success: true,
    data: { ingredients },
  });
});

/**
 * @desc    Get single ingredient
 * @route   GET /api/ingredients/:id
 * @access  Public
 */
export const getIngredientById = asyncHandler(async (req, res) => {
  const ingredient = await Ingredient.findById(req.params.id);

  if (!ingredient) {
    throw new ApiError(404, "Ingredient not found");
  }

  res.status(200).json({
    success: true,
    data: { ingredient },
  });
});

/**
 * @desc    Create new ingredient
 * @route   POST /api/ingredients
 * @access  Private (Admin)
 */
export const createIngredient = asyncHandler(async (req, res) => {
  const { name, category, unit, pricePerUnit, stock, description, imageUrl } =
    req.body;

  // Check if ingredient already exists
  const existing = await Ingredient.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  if (existing) {
    throw new ApiError(400, "Ingredient already exists");
  }

  const ingredient = await Ingredient.create({
    name,
    image: {
      url: req.file ? req.file.path : imageUrl,
      publicId: req.file ? req.file.filename : null,
    },
    category,
    unit,
    pricePerUnit,
    stock,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Ingredient created successfully",
    data: { ingredient },
  });
});

/**
 * @desc    Seed sample ingredients
 * @route   POST /api/ingredients/seed
 * @access  Public (for development)
 */
export const seedIngredients = asyncHandler(async (req, res) => {
  const sampleIngredients = [
    // VEGETABLES (10 items)
    {
      name: "Tomatoes",
      image: {
        url: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 40,
      stock: 100,
      description: "Fresh red tomatoes",
    },
    {
      name: "Onions",
      image: {
        url: "https://images.pexels.com/photos/4197447/pexels-photo-4197447.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 30,
      stock: 150,
      description: "Fresh onions",
    },
    {
      name: "Spinach",
      image: {
        url: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "bunch",
      pricePerUnit: 25,
      stock: 80,
      description: "Fresh green spinach",
    },
    {
      name: "Garlic",
      image: {
        url: "https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "100g",
      pricePerUnit: 45,
      stock: 120,
      description: "Fresh garlic cloves",
    },
    {
      name: "Bell Peppers",
      image: {
        url: "https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 80,
      stock: 70,
      description: "Mixed color bell peppers",
    },
    {
      name: "Carrots",
      image: {
        url: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 35,
      stock: 90,
      description: "Fresh orange carrots",
    },
    {
      name: "Potatoes",
      image: {
        url: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 25,
      stock: 200,
      description: "Fresh potatoes",
    },
    {
      name: "Cucumber",
      image: {
        url: "https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 30,
      stock: 85,
      description: "Fresh green cucumber",
    },
    {
      name: "Broccoli",
      image: {
        url: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "kg",
      pricePerUnit: 60,
      stock: 60,
      description: "Fresh broccoli florets",
    },
    {
      name: "Cauliflower",
      image: {
        url: "https://images.pexels.com/photos/6316515/pexels-photo-6316515.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Vegetables",
      unit: "piece",
      pricePerUnit: 40,
      stock: 50,
      description: "Fresh white cauliflower",
    },

    // FRUITS (8 items)
    {
      name: "Avocado",
      image: {
        url: "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Fruits",
      unit: "piece",
      pricePerUnit: 120,
      stock: 50,
      description: "Ripe Hass avocado",
    },
    {
      name: "Lemon",
      image: {
        url: "https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Fruits",
      unit: "kg",
      pricePerUnit: 80,
      stock: 100,
      description: "Fresh yellow lemons",
    },
    {
      name: "Banana",
      image: {
        url: "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Fruits",
      unit: "dozen",
      pricePerUnit: 50,
      stock: 120,
      description: "Fresh ripe bananas",
    },
    {
      name: "Apple",
      image: {
        url: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Fruits",
      unit: "kg",
      pricePerUnit: 150,
      stock: 80,
      description: "Fresh red apples",
    },
    {
      name: "Orange",
      image: {
        url: "https://images.pexels.com/photos/42059/citrus-diet-food-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Fruits",
      unit: "kg",
      pricePerUnit: 70,
      stock: 100,
      description: "Fresh juicy oranges",
    },
    {
      name: "Strawberries",
      image: {
        url: "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Fruits",
      unit: "250g",
      pricePerUnit: 90,
      stock: 60,
      description: "Fresh red strawberries",
    },
    {
      name: "Mango",
      image: {
        url: "https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Fruits",
      unit: "piece",
      pricePerUnit: 60,
      stock: 70,
      description: "Fresh ripe mango",
    },
    {
      name: "Grapes",
      image: {
        url: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Fruits",
      unit: "kg",
      pricePerUnit: 120,
      stock: 50,
      description: "Fresh green grapes",
    },

    // DAIRY (6 items)
    {
      name: "Eggs",
      image: {
        url: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Dairy",
      unit: "dozen",
      pricePerUnit: 80,
      stock: 100,
      description: "Farm fresh eggs",
    },
    {
      name: "Milk",
      image: {
        url: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Dairy",
      unit: "liter",
      pricePerUnit: 60,
      stock: 100,
      description: "Fresh whole milk",
    },
    {
      name: "Cheese",
      image: {
        url: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Dairy",
      unit: "200g",
      pricePerUnit: 150,
      stock: 60,
      description: "Cheddar cheese block",
    },
    {
      name: "Butter",
      image: {
        url: "https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Dairy",
      unit: "200g",
      pricePerUnit: 90,
      stock: 80,
      description: "Fresh unsalted butter",
    },
    {
      name: "Yogurt",
      image: {
        url: "https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Dairy",
      unit: "500g",
      pricePerUnit: 70,
      stock: 90,
      description: "Greek yogurt",
    },
    {
      name: "Cream",
      image: {
        url: "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Dairy",
      unit: "200ml",
      pricePerUnit: 60,
      stock: 50,
      description: "Heavy whipping cream",
    },

    // MEAT (6 items)
    {
      name: "Chicken Breast",
      image: {
        url: "https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Meat",
      unit: "kg",
      pricePerUnit: 280,
      stock: 50,
      description: "Boneless chicken breast",
    },
    {
      name: "Ground Beef",
      image: {
        url: "https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Meat",
      unit: "kg",
      pricePerUnit: 350,
      stock: 40,
      description: "Fresh ground beef",
    },
    {
      name: "Lamb Chops",
      image: {
        url: "https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Meat",
      unit: "kg",
      pricePerUnit: 650,
      stock: 25,
      description: "Fresh lamb chops",
    },
    {
      name: "Bacon",
      image: {
        url: "https://images.pexels.com/photos/1927377/pexels-photo-1927377.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Meat",
      unit: "250g",
      pricePerUnit: 180,
      stock: 45,
      description: "Smoked bacon strips",
    },
    {
      name: "Pork Tenderloin",
      image: {
        url: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Meat",
      unit: "kg",
      pricePerUnit: 320,
      stock: 35,
      description: "Fresh pork tenderloin",
    },
    {
      name: "Turkey",
      image: {
        url: "https://images.pexels.com/photos/5718071/pexels-photo-5718071.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Meat",
      unit: "kg",
      pricePerUnit: 300,
      stock: 30,
      description: "Turkey breast slices",
    },

    // SEAFOOD (4 items)
    {
      name: "Salmon",
      image: {
        url: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Seafood",
      unit: "kg",
      pricePerUnit: 800,
      stock: 30,
      description: "Fresh Atlantic salmon",
    },
    {
      name: "Shrimp",
      image: {
        url: "https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Seafood",
      unit: "kg",
      pricePerUnit: 600,
      stock: 40,
      description: "Fresh tiger shrimp",
    },
    {
      name: "Tuna",
      image: {
        url: "https://images.pexels.com/photos/8969899/pexels-photo-8969899.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Seafood",
      unit: "kg",
      pricePerUnit: 750,
      stock: 25,
      description: "Fresh tuna steak",
    },
    {
      name: "Cod Fish",
      image: {
        url: "https://images.pexels.com/photos/3640451/pexels-photo-3640451.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Seafood",
      unit: "kg",
      pricePerUnit: 500,
      stock: 35,
      description: "Fresh cod fillets",
    },

    // GRAINS (4 items)
    {
      name: "Basmati Rice",
      image: {
        url: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Grains",
      unit: "kg",
      pricePerUnit: 120,
      stock: 200,
      description: "Premium basmati rice",
    },
    {
      name: "Pasta",
      image: {
        url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Grains",
      unit: "500g",
      pricePerUnit: 80,
      stock: 150,
      description: "Italian penne pasta",
    },
    {
      name: "Quinoa",
      image: {
        url: "https://images.pexels.com/photos/6072017/pexels-photo-6072017.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Grains",
      unit: "500g",
      pricePerUnit: 200,
      stock: 60,
      description: "Organic white quinoa",
    },
    {
      name: "Oats",
      image: {
        url: "https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Grains",
      unit: "500g",
      pricePerUnit: 60,
      stock: 100,
      description: "Rolled oats",
    },

    // SPICES (4 items)
    {
      name: "Black Pepper",
      image: {
        url: "https://images.pexels.com/photos/4198745/pexels-photo-4198745.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Spices",
      unit: "100g",
      pricePerUnit: 80,
      stock: 100,
      description: "Ground black pepper",
    },
    {
      name: "Cumin",
      image: {
        url: "https://images.pexels.com/photos/4198936/pexels-photo-4198936.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Spices",
      unit: "100g",
      pricePerUnit: 60,
      stock: 90,
      description: "Ground cumin powder",
    },
    {
      name: "Turmeric",
      image: {
        url: "https://images.pexels.com/photos/4198897/pexels-photo-4198897.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Spices",
      unit: "100g",
      pricePerUnit: 50,
      stock: 110,
      description: "Ground turmeric powder",
    },
    {
      name: "Cinnamon",
      image: {
        url: "https://images.pexels.com/photos/6039349/pexels-photo-6039349.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Spices",
      unit: "100g",
      pricePerUnit: 90,
      stock: 80,
      description: "Ground cinnamon powder",
    },

    // OTHER (3 items)
    {
      name: "Olive Oil",
      image: {
        url: "https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Other",
      unit: "liter",
      pricePerUnit: 450,
      stock: 60,
      description: "Extra virgin olive oil",
    },
    {
      name: "Honey",
      image: {
        url: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Other",
      unit: "500g",
      pricePerUnit: 250,
      stock: 50,
      description: "Pure organic honey",
    },
    {
      name: "Soy Sauce",
      image: {
        url: "https://images.pexels.com/photos/6249498/pexels-photo-6249498.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      category: "Other",
      unit: "250ml",
      pricePerUnit: 80,
      stock: 70,
      description: "Premium soy sauce",
    },
  ];

  // Clear existing and insert sample data
  await Ingredient.deleteMany({});
  const ingredients = await Ingredient.insertMany(sampleIngredients);

  res.status(201).json({
    success: true,
    message: `${ingredients.length} sample ingredients created`,
    data: { ingredients },
  });
});
