import { Avatar, ScrollArea, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";
import io from "socket.io-client";

import { ChatValues } from "../../../../../shared/types/ChatValues";
import { Message } from "../../../../../shared/types/Message";
import { useUser } from "../../../utils/UserContext";

import ChatCreation from "./ChatCreation";

interface ChatMenuProps {
  onChatSelect: (chat: ChatValues) => void;
  onProfileClick: () => void;
}

const ChatMenu = ({ onChatSelect, onProfileClick }: ChatMenuProps) => {
  const { userData, isLoading } = useUser();
  const [chats, setChats] = useState(new Array<ChatValues>());
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [error, setError] = useState(null);

  const getChats = async (user_id: string): Promise<ChatValues[]> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-chats?user_id=${user_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to fetch chats");
    
    const data = await response.json();

    return data.chats;
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (userData && userData.isAuthenticated) {
        try {
          const fetchedChats = await getChats(userData.user.id);

          setChats(fetchedChats);
        } catch (err) {
          setError("Failed to load chats. Please try again later.");
          console.error(err);
        } finally {
          setIsLoadingChats(false);
        }
      }
    };

    fetchChats();

    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

    socket.emit("authenticate", { user_id: userData.user.id });

    socket.on("newChat", (newChat: ChatValues) => {
      setChats((prevChats: Array<ChatValues>) => [...prevChats, newChat]);
    });

    socket.on("newMessage", (newMessage: Message) => {
      setChats((prevChats: Array<ChatValues>) => 
        prevChats.map((chat) => 
          chat.id === newMessage.chat_id
            ? { ...chat, mostRecentMessage: newMessage.content }
            : chat
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [userData]);

  if (isLoading || isLoadingChats) {
    return <div>Loading...</div>;
  }

  if (!userData || !userData.isAuthenticated) {
    return <div>Please log in to view chats</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col w-1/4 bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl m-5 p-5 overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl text-text-light-primary dark:text-text-dark-primary">
          Chats
        </h1>
        <ChatCreation />
      </div>
      <TextInput
        className="mt-2 mb-2 pt-1"
        radius="xl"
        type="text"
        placeholder="Search"
      />
      <ScrollArea>
        <ul>
          {chats.map((chat: ChatValues) => (
            <li
              key={chat.id}
              className="flex flex-row mt-2 mb-2 cursor-pointer"
              onClick={() => onChatSelect(chat)}
            >
              <Avatar radius="xl" size="lg" src={chat.chat_picture} />
              <div className="pl-2 mt-auto mb-auto">
                <a className="block truncate">{chat.name}</a>
                <p className="truncate text-sm text-gray-500">
                  {chat.mostRecentMessage}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className="border-t mt-auto pt-2 ">
        <div>
          <Avatar
            size="lg"
            src={userData.user.profile_picture}
            onClick={onProfileClick}
            className="hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMenu;
