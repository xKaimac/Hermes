import express from 'express';
import multer from 'multer';

import { ChatMember } from '../../../../shared/types/ChatMember';
import { isAuthenticated } from '../../middleware/auth.middleware';
import addChatMember from '../../services/chats/addChatMember.service';
import addChatParticipants from '../../services/chats/addChatParticipants.service';
import createChat from '../../services/chats/createChat.service';
import getAllMessages from '../../services/chats/getAllMessages.service';
import getChatMembers from '../../services/chats/getChatMembers.service';
import getChats from '../../services/chats/getChats.services';
import getRole from '../../services/chats/getRole.service';
import sendMessage from '../../services/chats/sendMessage.service';
import updateChatPicture from '../../services/chats/updateChatPicture.service';
import uploadChatPicture from '../../services/chats/uploadChatPicture.service';
import {
  emitNewChat,
  emitNewMessage,
} from '../../services/socket/socket.service';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create-chat', isAuthenticated, async (req, res) => {
  try {
    const { chat_name, members } = req.body;
    const newChat = await createChat(chat_name, members);

    emitNewChat(
      members.members.map((member: ChatMember) => member.id),
      newChat
    );

    return res.status(200).json({ message: 'Chat created successfully' });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ message: 'Failed to create chat', error: error });
  }
});

router.post('/add-chat-participants', isAuthenticated, async (req, res) => {
  try {
    const { chat_id, participants } = req.body;

    await addChatParticipants(chat_id, participants);

    return res
      .status(200)
      .json({ message: 'Chat participants added successfully' });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to add chat participants' });
  }
});

router.get('/get-chats', isAuthenticated, async (req, res) => {
  try {
    const { user_id } = req.query;
    const chats = await getChats(Number(user_id));

    return res
      .status(200)
      .json({ message: 'Chats retrieved successfully', chats });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to retrieve chats' });
  }
});

router.post('/get-members', isAuthenticated, async (req, res) => {
  try {
    const { chat_id } = req.body;
    const success = await getChatMembers(chat_id);

    return res
      .status(200)
      .json({ message: 'Members retrieved successfully', result: success });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to retrieve Members' });
  }
});

router.post('/get-role', isAuthenticated, async (req, res) => {
  try {
    const { user_id, chat_id } = req.body;
    const success = await getRole(user_id, chat_id);

    return res
      .status(200)
      .json({ message: 'Role retrieved successfully', result: success });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to retrieve role' });
  }
});

router.post('/add-member', isAuthenticated, async (req, res) => {
  try {
    const { chat_id, friendName, user_id } = req.body;
    const success = await addChatMember(chat_id, friendName, user_id);

    return res
      .status(200)
      .json({ message: 'Member added successfully', result: success });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to add member' });
  }
});

router.post(
  '/upload-chat-picture',
  upload.single('chat_picture'),
  isAuthenticated,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    try {
      const { chat_id } = req.body;
      const result: any = await uploadChatPicture(req.file);

      updateChatPicture(chat_id, result.secure_url);

      return res.status(200).json({ message: 'Upload successful', result });
    } catch (error) {
      return res.status(500).send('Error uploading file');
    }
  }
);

router.post('/get-all-messages', isAuthenticated, async (req, res) => {
  try {
    const { chat_id } = req.body;
    const result = await getAllMessages(chat_id);

    return res
      .status(200)
      .json({ message: 'Messages retrieved successfully', result });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve messages' });
  }
});

router.post('/send-message', isAuthenticated, async (req, res) => {
  try {
    const { chat_id, sender_id, content } = req.body;

    const result = await sendMessage(chat_id, sender_id, content);
    const members = await getChatMembers(chat_id);

    emitNewMessage(
      members.map((member) => member.id),
      result
    );

    return res
      .status(200)
      .json({ message: 'Message sent successfully!', result });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;
