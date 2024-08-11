import { useState, useEffect } from "react";
import { useUser } from "../../../utils/UserContext";
import { Avatar, ScrollArea, TextInput } from "@mantine/core";
import ChatCreation from "./ChatCreation";

interface Chat {
  chatId: number;
  name: string;
  chatPicture?: string;
  mostRecentMessage?: string;
}

const ChatMenu = () => {
  const { userData, isLoading } = useUser();
  const [chats, setChats] = useState(new Array<Chat>());
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [error, setError] = useState(null);

  const getChats = async (userId: string): Promise<Chat[]> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-chats?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }
    const data = await response.json();
    return data.chats.chats;
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (userData && userData.isAuthenticated) {
        try {
          const fetchedChats = await getChats(userData.user.id);
          console.log(fetchedChats);
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
          {chats.map((chat: Chat) => (
            <li key={chat.chatId} className="flex flex-row mt-2 mb-2">
              <Avatar radius="xl" size="lg" src={chat.chatPicture} />
              <div className="pl-2 overflow-hidden mt-auto mb-auto">
                <a className="block truncate">{chat.name}</a>
                <p className="truncate text-sm text-gray-500">
                  {chat.mostRecentMessage}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className="border-t mt-auto pt-2">
        <a href="profile">
          <Avatar size="lg" src={userData.user.profile_picture} />
        </a>
      </div>
    </div>
  );
};

export default ChatMenu;
