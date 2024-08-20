import { useState } from "react";
import ChatMenu from "../navigation/chat-menu/ChatMenu";
import Chat from "./Chat";
import Profile from "../../pages/Profile";
import { ChatValues } from "../../types/ChatValues";

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
    <div className="flex flex-row w-full">
      <ChatMenu
        onChatSelect={handleChatSelect}
        onProfileClick={handleProfileClick}
      />
      {showProfile ? <Profile /> : <Chat selectedChat={selectedChat} />}
    </div>
  );
};

export default ChatPage;
