import express from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import createChat from "../../services/chats/createChat.service";
import addChatParticipants from "../../services/chats/addChatParticipants.service";

const router = express.Router();

router.post("/create-chat", isAuthenticated, async (req, res) => {
  try {
    const { chatName, filteredParticipants } = req.body;
    await createChat(chatName, filteredParticipants);
    return res.status(200).json({ message: "Chat created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to create chat", error: error });
  }
});

router.post("/add-chat-participants", isAuthenticated, async (req, res) => {
  try {
    const { chatId, participants } = req.body;
    await addChatParticipants(chatId, participants);
    return res
      .status(200)
      .json({ message: "Chat participants added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add chat participants" });
  }
});

router.get("/get-chats", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;
    await getChats(userId);
    return res.status(200).json({ message: "Chats retrieved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve chats" });
  }
});

export default router;
