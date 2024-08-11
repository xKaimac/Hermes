import { useState, useEffect } from "react";
import Settings from "../settings/Settings";
import { Textarea, ScrollArea } from "@mantine/core";
import { ChatValues } from "../../types/ChatValues";

interface ChatProps {
  selectedChat: ChatValues | null;
}

const Chat = ({ selectedChat }: ChatProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChat) {
      // TODO: make an api call to get all the messages
      setMessages([`Welcome to ${selectedChat.name}`]);
    }
  }, [selectedChat]);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="flex w-full">
      <div
        className={`flex flex-col ${isSettingsOpen ? "w-3/4" : "w-full"} bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl mb-5 mt-5 mr-5 p-5 overflow-hidden transition-all duration-300`}
      >
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl text-text-light-primary dark:text-text-dark-primary">
            {selectedChat ? selectedChat.name : "Select a chat"}
          </h1>
          <button
            onClick={toggleSettings}
            className="text-3xl text-text-light-primary dark:text-text-dark-primary"
          >
            ...
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            {messages.map((message: string, index: number) => (
              <div key={index} className="mb-2">
                {message}
              </div>
            ))}
          </ScrollArea>
        </div>
        <Textarea
          autosize
          className="mt-2 mb-2 p-2"
          radius="xl"
          maxRows={25}
          placeholder="Type your message here"
        />
      </div>
      {isSettingsOpen && <Settings />}
    </div>
  );
};

export default Chat;
