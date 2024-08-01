import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import updateUsername from "../services/username.service";

const router = express.Router();

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

router.post("/Username", isAuthenticated, async (req, res) => {
  const success = await updateUsername(req.body);
  res.json(success);
});

export default router;
