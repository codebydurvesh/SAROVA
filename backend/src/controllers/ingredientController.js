import Ingredient from '../models/Ingredient.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

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
    query.name = { $regex: search, $options: 'i' };
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
    throw new ApiError(404, 'Ingredient not found');
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
  const { name, category, unit, pricePerUnit, stock, description, imageUrl } = req.body;

  // Check if ingredient already exists
  const existing = await Ingredient.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existing) {
    throw new ApiError(400, 'Ingredient already exists');
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
    message: 'Ingredient created successfully',
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
    {
      name: 'Tomatoes',
      image: { url: 'https://images.unsplash.com/photo-1546470427-227c7369a9b9?w=400' },
      category: 'Vegetables',
      unit: 'kg',
      pricePerUnit: 40,
      stock: 100,
      description: 'Fresh red tomatoes',
    },
    {
      name: 'Onions',
      image: { url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400' },
      category: 'Vegetables',
      unit: 'kg',
      pricePerUnit: 30,
      stock: 150,
      description: 'Fresh onions',
    },
    {
      name: 'Chicken Breast',
      image: { url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400' },
      category: 'Meat',
      unit: 'kg',
      pricePerUnit: 280,
      stock: 50,
      description: 'Boneless chicken breast',
    },
    {
      name: 'Basmati Rice',
      image: { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
      category: 'Grains',
      unit: 'kg',
      pricePerUnit: 120,
      stock: 200,
      description: 'Premium basmati rice',
    },
    {
      name: 'Spinach',
      image: { url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
      category: 'Vegetables',
      unit: 'bunch',
      pricePerUnit: 25,
      stock: 80,
      description: 'Fresh green spinach',
    },
    {
      name: 'Eggs',
      image: { url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400' },
      category: 'Dairy',
      unit: 'dozen',
      pricePerUnit: 80,
      stock: 100,
      description: 'Farm fresh eggs',
    },
    {
      name: 'Garlic',
      image: { url: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2f85?w=400' },
      category: 'Vegetables',
      unit: '100g',
      pricePerUnit: 45,
      stock: 120,
      description: 'Fresh garlic cloves',
    },
    {
      name: 'Olive Oil',
      image: { url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
      category: 'Other',
      unit: 'liter',
      pricePerUnit: 450,
      stock: 60,
      description: 'Extra virgin olive oil',
    },
    {
      name: 'Bell Peppers',
      image: { url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400' },
      category: 'Vegetables',
      unit: 'kg',
      pricePerUnit: 80,
      stock: 70,
      description: 'Mixed color bell peppers',
    },
    {
      name: 'Milk',
      image: { url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
      category: 'Dairy',
      unit: 'liter',
      pricePerUnit: 60,
      stock: 100,
      description: 'Fresh whole milk',
    },
    {
      name: 'Salmon',
      image: { url: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400' },
      category: 'Seafood',
      unit: 'kg',
      pricePerUnit: 800,
      stock: 30,
      description: 'Fresh Atlantic salmon',
    },
    {
      name: 'Avocado',
      image: { url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400' },
      category: 'Fruits',
      unit: 'piece',
      pricePerUnit: 120,
      stock: 50,
      description: 'Ripe Hass avocado',
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
