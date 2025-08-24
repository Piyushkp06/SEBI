import { Router } from "express";
import {
  login,
  signup,
  getProfile,
  logout
} from "../controllers/authControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.post("/logout", authMiddleware, logout);
authRoutes.get("/profile", authMiddleware, getProfile);

export default authRoutes;

