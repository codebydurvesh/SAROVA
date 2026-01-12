import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
  toggleFavorite,
} from "../controllers/authController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

// Protected routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.post("/favorites/:recipeId", authenticate, toggleFavorite);

export default router;
