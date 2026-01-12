import express from "express";
import {
  getIngredients,
  getIngredientById,
  createIngredient,
  seedIngredients,
} from "../controllers/ingredientController.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/", getIngredients);
router.get("/:id", getIngredientById);

// Seed route for development
router.post("/seed", seedIngredients);

// Protected routes
router.post("/", authenticate, upload.single("image"), createIngredient);

export default router;
