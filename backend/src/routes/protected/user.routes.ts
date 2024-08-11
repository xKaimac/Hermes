import updateUsername from "../../services/user/username.service";
import uploadProfilePicture from "../../config/cloudinary.config";
import updateProfilePicture from "../../services/user/profilePicture.service";
import updateStatusText from "../../services/user/statusText.service";
import { isAuthenticated } from "../../middleware/auth.middleware";
import express from "express";

const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/logout", isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

router.post("/set-username", isAuthenticated, async (req, res) => {
  const { username, userId } = req.body;
  const success = await updateUsername(username, userId);
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
      const { userId } = req.body;
      const result: any = await uploadProfilePicture(req.file);
      updateProfilePicture(userId, result.secure_url);
      res.status(200).json({ message: "Upload successful", result });
    } catch (error) {
      res.status(500).send("Error uploading file");
    }
  }
);

router.post("/update-status-text", isAuthenticated, async (req, res) => {
  try {
    const { userId, userStatus } = req.body;
    const result: any = await updateStatusText(userId, userStatus);
    return res
      .status(200)
      .json({ message: "Status change successful", result });
  } catch (error) {
    res.status(500).send("Error updating status");
  }
});

export default router;
