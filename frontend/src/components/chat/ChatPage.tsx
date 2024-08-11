import { useState } from "react";
import ChatMenu from "../navigation/chat-menu/ChatMenu";
import Chat from "./Chat";

interface ChatData {
  chatId: number;
  name: string;
  chatPicture?: string;
  mostRecentMessage?: string;
}

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelect = (chat: ChatData) => {
    setSelectedChat(chat);
  };

  return (
    <div className="flex flex-row w-full">
      <ChatMenu onChatSelect={handleChatSelect} />
      <Chat selectedChat={selectedChat} />
    </div>
  );
};

export default ChatPage;
