import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import updateUsername from "../services/username.service";
import dotenv from "dotenv";
import path from "path";

const router = express.Router();

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const HERMES_URL = process.env.HERMES_URL || "";

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

router.get("/Username", isAuthenticated, async (req, res) => {
  await updateUsername(req.body);
  res.redirect(HERMES_URL);
});

export default router;
