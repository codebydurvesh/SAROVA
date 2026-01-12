import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  toggleLike,
  addComment,
  deleteRecipe,
  seedRecipes,
} from "../controllers/recipeController.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/", getRecipes);
router.post("/seed", seedRecipes);
router.get("/:id", getRecipeById);

// Protected routes
router.post("/", authenticate, upload.single("image"), createRecipe);
router.post("/:id/like", authenticate, toggleLike);
router.post("/:id/comment", authenticate, addComment);
router.delete("/:id", authenticate, deleteRecipe);

export default router;
