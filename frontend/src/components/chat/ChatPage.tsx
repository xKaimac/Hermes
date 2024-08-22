import { useState } from 'react';

import { ChatValues } from '../../../../shared/types/ChatValues';
import Profile from '../../pages/Profile';
import ChatMenu from '../navigation/chat-menu/ChatMenu';

import Chat from './Chat';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

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
