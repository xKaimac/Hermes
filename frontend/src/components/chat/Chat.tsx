import { Textarea, ScrollArea, Avatar } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { FaArrowCircleRight } from 'react-icons/fa';

import { Message } from '../../../../shared/types/Message';
import { ChatProps } from '../../types/props/ChatProps';
import { useUser } from '../../utils/UserContext';
import Settings from '../settings/Settings';

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

    socket.emit('authenticate', { sender_id: userData.user.id });

    socket.on("newMessage", (newMessage: Message) => {

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
      const allMessages = await getMessages(selectedChat.id);

      setMessages(allMessages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessages = async (chat_id: number): Promise<Array<Message>> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-all-messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat_id }),
        credentials: 'include',
      }
    );

    if (!response.ok) throw new Error('Failed to fetch messages');

    const data = await response.json();

    return data.result.messages;
  };

  const sendMessage = async ({ chat_id, sender_id, content }: Message) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/send-message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat_id, sender_id, content }),
        credentials: 'include',
      }
    );

    if (!response.ok) throw new Error('Failed to send message');

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setMessage("");
    },
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleClick = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (message.trim().length <= 0) {
      setMessage("");
      
      return;
    }

    mutation.mutate({
      chat_id: selectedChat.id,
      sender_id: userData.user.id,
      content: message,
    });
    setMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleClick();
    }
  };

  const EnterComponent = () => {
    return (
      <button
        onClick={handleClick}
        className="text-surface-light dark:text-surface-dark flex h-10 w-10 items-center justify-center p-2"
      >
        <FaArrowCircleRight />
      </button>
    );
  };

  return (
    <div className="flex w-full">
      <div
        className={`flex flex-col ${isSettingsOpen ? 'w-3/4' : 'w-full'} bg-background-light dark:bg-background-dark mb-5 mr-5 mt-5 h-[calc(100vh-2.5rem)] overflow-hidden rounded-xl p-5 transition-all duration-300`}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row">
            {selectedChat && (
              <Avatar src={selectedChat.chat_picture} radius="xl" size="md" />
            )}
            <h1 className="text-text-light-primary dark:text-text-dark-primary pl-2 text-3xl">
              {selectedChat ? selectedChat.name : 'Select a chat'}
            </h1>
          </div>
          <button
            onClick={toggleSettings}
            className="text-text-light-primary dark:text-text-dark-primary text-3xl"
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
                  Time: {message.created_at && new Date(message.created_at).toString()}
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
