import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import updateUsername from "../services/username.service";
import uploadProfilePicture from "../config/cloudinary.config";
import updateProfilePicture from "../services/profilePicture.service";

const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

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

router.post(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  isAuthenticated,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const result: any = await uploadProfilePicture(req.file);
      updateProfilePicture(req.body, result.secure_url);
      res.status(200).json({ message: "Upload successful", result });
    } catch (error) {
      res.status(500).send("Error uploading file");
    }
  }
);

export default router;
