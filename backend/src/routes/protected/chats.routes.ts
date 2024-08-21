import express from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import createChat from "../../services/chats/createChat.service";
import addChatParticipants from "../../services/chats/addChatParticipants.service";
import getChats from "../../services/chats/getChats.services";
import {
  emitNewChat,
  emitNewMessage,
} from "../../services/socket/socket.service";
import getChatMembers from "../../services/chats/getChatMembers.service";
import getRole from "../../services/chats/getRole.service";
import addChatMember from "../../services/chats/addChatMember.service";
import uploadChatPicture from "../../services/chats/uploadChatPicture.service";
import updateChatPicture from "../../services/chats/updateChatPicture.service";
import getAllMessages from "../../services/chats/getAllMessages.service";
import sendMessage from "../../services/chats/sendMessage.service";

const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-chat", isAuthenticated, async (req, res) => {
  try {
    const { chatName, filteredParticipants } = req.body;
    const newChat = await createChat(chatName, filteredParticipants);

    emitNewChat(
      newChat.participants.map((participant) => participant.userId),
      {
        chatId: newChat.chatId,
        name: newChat.name,
        chatPicture: newChat.chatPicture,
        mostRecentMessage: newChat.mostRecentMessage,
      }
    );

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
    const { userId } = req.query;
    const chats = await getChats(userId);
    return res
      .status(200)
      .json({ message: "Chats retrieved successfully", chats: chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve chats" });
  }
});

router.post("/get-members", isAuthenticated, async (req, res) => {
  try {
    const { chatId } = req.body;
    const success = await getChatMembers(chatId);
    return res
      .status(200)
      .json({ message: "Members retrieved successfully", result: success });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve Members" });
  }
});

router.post("/get-role", isAuthenticated, async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    const success = await getRole(userId, chatId);
    return res
      .status(200)
      .json({ message: "Role retrieved successfully", result: success });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve role" });
  }
});

router.post("/add-member", isAuthenticated, async (req, res) => {
  try {
    const { chatId, friendName, userId } = req.body;
    const success = await addChatMember(chatId, friendName, userId);

    return res
      .status(200)
      .json({ message: "Member added successfully", result: success });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add member" });
  }
});

router.post(
  "/upload-chat-picture",
  upload.single("chatPicture"),
  isAuthenticated,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const { chatId } = req.body;
      const result: any = await uploadChatPicture(req.file);
      updateChatPicture(chatId, result.secure_url);
      return res.status(200).json({ message: "Upload successful", result });
    } catch (error) {
      return res.status(500).send("Error uploading file");
    }
  }
);

router.post("/get-all-messages", isAuthenticated, async (req, res) => {
  try {
    const { chatId } = req.body;
    const result = await getAllMessages(chatId);
    return res
      .status(200)
      .json({ message: "Messages retrieved successfully", result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve messages" });
  }
});

router.post("/send-message", isAuthenticated, async (req, res) => {
  try {
    const { chatId, userId, content } = req.body;
    const result = await sendMessage(chatId, userId, content);
    const members = await getChatMembers(chatId);

    console.log(members.members);

    emitNewMessage(
      members.members.map((member) => member.id),
      {
        chatId: chatId,
        sender_id: userId,
        content: content,
        created_at: result.created_at,
      }
    );

    return res
      .status(200)
      .json({ message: "Message sent successfully!", result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
