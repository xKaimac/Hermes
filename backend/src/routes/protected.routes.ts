import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.json({ message: "Here is your profile", user: req.user });
});

export default router;
