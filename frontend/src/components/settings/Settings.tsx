import { useState, useEffect } from "react";
import ThemeToggle from "../../utils/theme-toggle.util";
import { ChatValues } from "../../types/ChatValues";
import { Avatar, ScrollArea, TextInput } from "@mantine/core";
import { ChatMember } from "../../types/ChatMember";
import AddChatMember from "./AddChatMember";
import { useUser } from "../../utils/UserContext";
import ChatPictureUpload from "./ChatPictureUpload";

interface SettingsProps {
  selectedChat: ChatValues | null;
}

const Settings = ({ selectedChat }: SettingsProps) => {
  const [chatName, setChatName] = useState("");
  const [chatPicture, setChatPicture] = useState("");
  const [members, setMembers] = useState(new Array<ChatMember>());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { userData } = useUser();
  const userId = userData.user.id;

  useEffect(() => {
    if (selectedChat) {
      setChatName(selectedChat.name);
      setChatPicture(selectedChat.chatPicture || "");
      fetchChatMembers();
      fetchRoleStatus();
    }
  }, [selectedChat]);

  const fetchRoleStatus = async () => {
    if (!selectedChat) return;

    try {
      setIsLoading(true);
      setError(null);

      const role = await getRoleStatus(selectedChat.chatId, userId);
      setIsAdmin(role.result.role === "admin");
    } catch (err) {
      setError("Failed to fetch chat members");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatMembers = async () => {
    if (!selectedChat) return;

    setIsLoading(true);
    setError(null);

    try {
      const chatMembers = await getChatMembers(selectedChat.chatId);
      setMembers(chatMembers.result.members);
    } catch (err) {
      setError("Failed to fetch chat members");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getChatMembers = async (chatId: number) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }

    return response.json();
  };

  const getRoleStatus = async (chatId: number, userId: number) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-role`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, userId }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }

    return response.json();
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="flex flex-col w-1/2 bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl mt-5 mr-5 p-5 overflow-y-auto">
      {selectedChat ? (
        <>
          <div className="relative flex flex-col items-center justify-center py-4 bg-background-light dark:bg-background-dark">
            <ChatPictureUpload
              isAdmin={isAdmin}
              chatId={selectedChat?.chatId.toString() || ""}
              chatPicture={selectedChat?.chatPicture || ""}
            />
            <h3 className="text-2xl text-text-light-primary dark:text-text-dark-primary">
              {selectedChat?.name || "Chat Settings"}
            </h3>
            <div className="absolute top-2 right-2">
              <ThemeToggle />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex flex-row">
              <h2 className="text-xl font-semibold mb-2 text-text-light-primary dark:text-text-dark-primary">
                Members
              </h2>
              {isAdmin && <AddChatMember chatId={selectedChat.chatId} />}
            </div>
            <ScrollArea className="flex-grow">
              <ul className="divide-y divide-text-light-secondary/25 dark:divide-text-light-secondary/75">
                {isLoading && <p>loading...</p>}
                {!isLoading &&
                  members.map((member: ChatMember) => (
                    <li key={member.id} className="flex flex-row mt-2 mb-2 p-5">
                      <Avatar
                        src={member.profilePicture}
                        radius="xl"
                        size="lg"
                      />
                      <div className="pl-3 text-left overflow-hidden mt-auto mb-auto flex-grow">
                        <a className="truncate text-lg text-text-light-primary dark:text-text-dark-primary">
                          {member.username}
                        </a>
                        <p className="truncate text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          Member since {formatTimestamp(member.memberSince)}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </ScrollArea>
          </div>
        </>
      ) : (
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Select a chat to view and edit settings.
        </p>
      )}
    </div>
  );
};

export default Settings;
