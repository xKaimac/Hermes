import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import updateUsername from "../services/username.service";
import uploadProfilePicture from "../config/cloudinary.config";
import updateProfilePicture from "../services/profilePicture.service";
import updateStatusText from "../services/statusText.service";
import sendFriendRequest from "../services/addFriend.service";
import getFriends from "../services/getFriends";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import handleFriendRequest from "../services/handleFriendRequest.service";

const router = express.Router();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const HERMES_URL = process.env.HERMES_URL;

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

router.post("/username", isAuthenticated, async (req, res) => {
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

router.post("/add-friend", isAuthenticated, async (req, res) => {
  try {
    const { userId, friendName } = req.body;
    const io: Server = (req as any).io;
    const userSocketMap: Map<string, string> = (req as any).userSocketMap;

    const result = await sendFriendRequest(userId, friendName);

    if (result.success) {
      const friendId = result.friendId;
      const recipientSocketId = userSocketMap.get(friendId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("friendRequest", {
          type: "friendRequest",
          senderId: userId,
        });
      }

      return res.status(200).json({
        message: "Friend request sent successfully",
        result: result.success,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to send friend request", result: false });
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    res
      .status(500)
      .json({ message: "Error sending friend request", error: error });
  }
});

router.post("/get-friends", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await getFriends(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error getting friends:", error);
    res.status(500).json({ message: "Error getting friends" });
  }
});

router.post("/handle-friend-request", isAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    const { action, userId, friendId } = req.body;
    const result = await handleFriendRequest(action, userId, friendId);
    return res.status(200).json({
      message: `Friend request handled successfully`,
      result: result,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Failed to handle friend request`, error: error });
  }
});

export default router;
