import { useState } from 'react';

import { ChatValues } from '../../../shared/types/ChatValues';
import Profile from '../../pages/Profile';
import ChatMenu from '../navigation/chat-menu/ChatMenu';

import Chat from './Chat';
import { useEffect } from 'react';
import { useUser } from '../../utils/UserContext';
import io from 'socket.io-client';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const {userData} = useUser();


  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

    socket.emit('authenticate', { user_id: userData.user.id });

    socket.on("chatPictureUpdate", (update: ChatValues) => {
      // Update selectedChat if it's the one that had its picture updated
      setSelectedChat((prevSelectedChat: { id: number; }) => 
        prevSelectedChat?.id === update.id
          ? { ...prevSelectedChat, chat_picture: update.chat_picture }
          : prevSelectedChat
      );
    });

    socket.on("chatNameUpdate", (update: ChatValues) => {
      setSelectedChat((prevSelectedChat: { id: number; }) => 
        prevSelectedChat?.id === update.id
          ? { ...prevSelectedChat, name: update.name }
          : prevSelectedChat
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChat]);



  const handleChatSelect = (chat: ChatValues) => {
    setSelectedChat(chat);
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    setSelectedChat(null);
  };

  return (
    <div className="flex w-full flex-row">
      <ChatMenu
        onChatSelect={handleChatSelect}
        onProfileClick={handleProfileClick}
      />
      {showProfile ? <Profile /> : <Chat selectedChat={selectedChat} />}
    </div>
  );
};

export default ChatPage;
