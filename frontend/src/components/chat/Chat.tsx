import { useState, useEffect } from "react";
import Settings from "../settings/Settings";
import { Textarea, ScrollArea, Avatar } from "@mantine/core";
import { ChatProps } from "../../types/ChatProps";
import { FaArrowCircleRight } from "react-icons/fa";
import { useUser } from "../../utils/UserContext";
import { useMutation } from "@tanstack/react-query";
import io from "socket.io-client";

interface Message {
  sender_id: string;
  content: string;
  created_at: number;
}

interface MessageData {
  chatId: number;
  userId: number;
  content: string;
}

const Chat = ({ selectedChat }: ChatProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { userData } = useUser();

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }

    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

    socket.emit("authenticate", { userId: userData.user.id });

    socket.on("newMessage", (newMessage: Message) => {
      console.log("ws");
      setMessages((prevMessages: Array<Message>) => [
        ...prevMessages,
        newMessage,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChat]);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    setIsLoading(true);

    try {
      const allMessages = await getMessages(selectedChat.chatId);
      setMessages(allMessages.result.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessages = async (chatId: number) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-all-messages`,
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
      throw new Error("Failed to fetch messages");
    }

    return response.json();
  };

  const sendMessage = async ({ chatId, userId, content }: MessageData) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/send-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, userId, content }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setMessage("");
    },
  });

  const handleOnChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleClick = (e?: any) => {
    e?.preventDefault();
    if (message.trim().length <= 0) {
      setMessage("");
      return;
    }
    mutation.mutate({
      chatId: selectedChat.chatId,
      userId: userData.user.id,
      content: message,
    });
    setMessage("");
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleClick();
    }
  };

  const EnterComponent = () => {
    return (
      <button
        onClick={handleClick}
        className="p-2 text-surface-light dark:text-surface-dark w-10 h-10 flex items-center justify-center"
      >
        <FaArrowCircleRight />
      </button>
    );
  };

  return (
    <div className="flex w-full">
      <div
        className={`flex flex-col ${isSettingsOpen ? "w-3/4" : "w-full"} bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl mb-5 mt-5 mr-5 p-5 overflow-hidden transition-all duration-300`}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row">
            {selectedChat && (
              <Avatar src={selectedChat.chatPicture} radius="xl" size="md" />
            )}
            <h1 className="pl-2 text-3xl text-text-light-primary dark:text-text-dark-primary">
              {selectedChat ? selectedChat.name : "Select a chat"}
            </h1>
          </div>
          <button
            onClick={toggleSettings}
            className="text-3xl text-text-light-primary dark:text-text-dark-primary"
          >
            ...
          </button>
        </div>

        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            {isLoading && <p className="p-4">Loading...</p>}
            {!isLoading &&
              messages.map((message: Message, index: number) => (
                <div key={index} className="mb-2">
                  Sent by: {message.sender_id}
                  Content: {message.content}
                  Time: {new Date(message.created_at).toString()}
                </div>
              ))}
          </ScrollArea>
        </div>
        <Textarea
          autosize
          className="mt-2 mb-2 p-2"
          id="messageBox"
          radius="xl"
          maxRows={25}
          rightSection={<EnterComponent />}
          placeholder="Type your message here"
          onChange={handleOnChange}
          onKeyPress={handleKeyPress}
          value={message}
        />
      </div>
      {isSettingsOpen && <Settings selectedChat={selectedChat} />}
    </div>
  );
};

export default Chat;
