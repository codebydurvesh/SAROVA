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
        url: "https://media.istockphoto.com/id/531644839/photo/garlic.jpg?s=612x612&w=0&k=20&c=a5wogZyHd1tLmaYp9nldmjP0-MUL2KU68zS-LOqyMC0=",
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
        url: "https://media.istockphoto.com/id/518951178/photo/fresh-raw-green-broccoli-in-bowl.jpg?s=612x612&w=0&k=20&c=wP_y_qqs6_hFVsnkE4MCHLNOOdQ11sg5MBuOjg2AygA=",
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
        url: "https://media.istockphoto.com/id/1338222224/photo/butter-blocks-and-pieces-on-wooden-table-copy-space.jpg?s=612x612&w=0&k=20&c=65ZYwALchrY4iXYkfrchnnWKCpuP20TZvXnSSmWnBPM=",
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
        url: "https://media.istockphoto.com/id/177545720/photo/young-beautiful-woman-eating-yogurt-at-home.jpg?s=612x612&w=0&k=20&c=t_n0Aouu_fB5INzRVVYbXX1kwbmFsyZYtgltf6_0d-4=",
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
        url: "https://media.istockphoto.com/id/1494240398/photo/cooking-whipped-cream-with-hand-mixer-heavy-cream-powdered-sugar-ricotta-cheese-top-view-of.jpg?s=612x612&w=0&k=20&c=eimK5mF_jNkqPOdmrgsa_cv3cD-f0IeAufOgOyontsI=",
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
        url: "https://media.istockphoto.com/id/511486326/photo/raw-chicken-fillets-close-up-isolated-on-white.jpg?s=612x612&w=0&k=20&c=ptabozbp4iO9pLZONQqjlUTSUfUl02Df37G19IOIfGU=",
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
        url: "https://media.istockphoto.com/id/1367399513/photo/raw-lamb-chop-food-concept-photo.jpg?s=612x612&w=0&k=20&c=92f_fISYv3uWq8FwCvJ6j4E2oSEPy0yeBzx0HeXVBCA=",
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
        url: "https://media.istockphoto.com/id/469354734/photo/fresh-and-raw-meat-sirloin-medallions-steaks.jpg?s=612x612&w=0&k=20&c=OH-FtjIgFS2psxomUDTZ450Zc35VvyZCQP2w64cbl_4=",
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
        url: "https://media.istockphoto.com/id/1042438108/photo/prepared-fresh-raw-chicken-for-cooking-on-a-cutting-wooden-board-top-view-selective-focus.jpg?s=612x612&w=0&k=20&c=XhfTORhlSWkwFc2fp67X2VBqJXOoSqaed29Rtabyq60=",
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
        url: "https://media.istockphoto.com/id/187533849/photo/salmon-fillets.jpg?s=612x612&w=0&k=20&c=lrlRXYfXY6588lN8OZwHlrgi9vP440k17pDstvDTaPI=",
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
        url: "https://media.istockphoto.com/id/1237538057/photo/raw-tuna-steak-with-ingredients-ready-to-cook.jpg?s=612x612&w=0&k=20&c=zgkjYmWvFo_SXn8U02IwhsL5G9bTg8JzFMpy8l1s65s=",
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
        url: "https://media.istockphoto.com/id/1455502757/photo/ceramic-plate-with-fresh-cod-fish-rosemary-lime-salt.jpg?s=612x612&w=0&k=20&c=UCEgRzOPow_TyRA4YS7KSyhqFpwTLeq99ireHu2hylg=",
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
        url: "https://media.istockphoto.com/id/1405668886/photo/yellow-uncooked-penne-rigate-pasta-in-a-bowl.jpg?s=612x612&w=0&k=20&c=-xvn3xZ22r-C3ZjOz6hQmotzWaQWeYWO_IHKagqnTiE=",
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
        url: "https://media.istockphoto.com/id/1440082392/photo/mixed-raw-quinoa-in-bowls-on-a-wooden-background-healthy-and-gluten-free-food.jpg?s=612x612&w=0&k=20&c=jbdTYlIfpFgCSmAk_cobYcBWiL2k4i8pLx4yxUg2U_o=",
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
        url: "https://media.istockphoto.com/id/1301622377/photo/ground-black-pepper-in-a-wooden-bowl-and-peppercorns-on-a-white-background-isolated-top-view.jpg?s=612x612&w=0&k=20&c=xPqOOYHRslVzSSlFAyLc9evjCFgLW2oHxgvmw8uR1Nc=",
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
        url: "https://media.istockphoto.com/id/585162374/photo/cumin-seeds-in-wooden-spoon.jpg?s=612x612&w=0&k=20&c=3HIQc474YlkE4NAkHjWLCAxoWPd04XFC9ig2fn7V5RI=",
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
        url: "https://media.istockphoto.com/id/1164067237/photo/turmeric-roots-and-powder-in-wood-spoon.jpg?s=612x612&w=0&k=20&c=gv4pG5WhnmdNGrpepXb3WC65DEoAz3x2P4oi8Htx64Q=",
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
        url: "https://media.istockphoto.com/id/1269840184/photo/scented-spices-background-cinnamon-powder-cinnamon-sticks-star-anise-and-cloves.jpg?s=612x612&w=0&k=20&c=46HCCaLYK0KmgKUc_2Nxfzqqpq86maJzEdD6AeILQJU=",
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
        url: "https://media.istockphoto.com/id/464433694/photo/olive-oil.jpg?s=612x612&w=0&k=20&c=2JGwS4mtdJngCwgdnZfd7PS1l2r5wtzfva2K8zGRBYY=",
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
        url: "https://media.istockphoto.com/id/1184706240/photo/teriyaki-sauce-image-with-chicken-and-broccoli.jpg?s=612x612&w=0&k=20&c=XjemnAAkYB3zG9RQD3hD1TeIqlSFQQ40EZ3sPQ19XYU=",
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
