import { useState } from 'react';
import { ActionIcon, Avatar } from "@mantine/core";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaReply } from "react-icons/fa";
import { Message } from "../../../../shared/types/Message";
import { User } from "../../../../shared/types/User";
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface MessageBubbleProps {
  message: Message;
  user_info: User;
  sender_info: User;
  onReply: (message: Message) => void;
  getRepliedMessage: (replyToId: number) => Message | undefined;
}

const MessageBubble = ({ message, user_info, sender_info, onReply, getRepliedMessage }: MessageBubbleProps) => {
  const isUser = user_info.id === message.sender_id;
  const info = isUser ? user_info : sender_info;
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();

  const replyToMessage = message.reply_to_id ? getRepliedMessage(message.reply_to_id) : undefined;

  const likeMutation = useMutation({
    mutationFn: (messageId: number) => 
      fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/like-message`,
       {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, user_id: user_info.id }),
        credentials: 'include',
      }).then(res => res.json()),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: ['messages'] });
      const previousMessages = queryClient.getQueryData<Message[]>(['messages']);

      queryClient.setQueryData<Message[]>(['messages'], (old) =>
        old?.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                likes: (msg.likes || 0) + 1,
                liked_by: [...(msg.liked_by || []), user_info.id],
                liked_by_current_user: true,
              }
            : msg
        )
      );

      return { previousMessages };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (messageId: number) => 
      fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/unlike-message`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, user_id: user_info.id }),
        credentials: 'include',
      }).then(res => res.json()),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: ['messages'] });
      const previousMessages = queryClient.getQueryData<Message[]>(['messages']);

      queryClient.setQueryData<Message[]>(['messages'], (old) =>
        old?.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                likes: Math.max(0, (msg.likes || 0) - 1),
                liked_by: (msg.liked_by || []).filter((id) => id !== user_info.id),
                liked_by_current_user: false,
              }
            : msg
        )
      );

      return { previousMessages };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const handleLikeClick = async () => {
    if (message.liked_by_current_user) {
      unlikeMutation.mutate(message.id!);
    } else {
      likeMutation.mutate(message.id!);
    }
  };

  const handleReply = () => {
    onReply(message);
  }

return (
  <div className={`flex items-start gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
    {!isUser && (
      <Avatar src={info.profile_picture} alt="Profile image" size="md" radius="xl" />
    )}
    <div className={`flex flex-col gap-1 max-w-[50vw] ${isUser ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <span className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">{info.username}</span>
      </div>
      <div 
        className={`group relative flex items-start gap-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex flex-col leading-1.5 p-4 ${
          isUser 
            ? 'bg-primary text-text-dark-primary rounded-s-xl rounded-ee-xl' 
            : 'bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary rounded-e-xl rounded-es-xl'
        } ${replyToMessage ? (isUser ? 'border-l-4 border-primary-light' : 'border-r-4 dark:border-[#242424]') : ''}`}>
          {replyToMessage && (
            <div className="mb-2 text-xs text-text-dark-secondary pb-1">
              <span className="font-semibold">Replying to {replyToMessage.sender_id === user_info.id ? 'yourself' : sender_info.username}</span>
            </div>
          )}
          <p className="text-md font-normal">
            {message.content}
          </p>
        </div>
        <div
          className={`absolute bottom-0 ${isUser ? 'left-0 ml-4' : 'right-0 mr-4'} transform translate-y-1/2 transition-opacity ${
            (message.likes && message.likes > 0) || isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center bg-pink-500 rounded-full px-2 py-1 cursor-pointer"
              onClick={handleLikeClick}
              >
            <ActionIcon
              size="xs" 
              variant="transparent"
            >
              {message.liked_by_current_user ? (
                <AiFillHeart size={14} />
              ) : (
                <AiOutlineHeart size={14} />
              )}
            </ActionIcon>
            {message.likes && message.likes > 0 && (
              <span className="text-text-dark-primary text-xs ml-1">{message.likes}</span>
            )}
          </div>
        </div>
        <div className={`self-end mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'mr-2' : 'ml-2'}`}>
          <ActionIcon
            variant="transparent"
            size="sm"
            onClick={handleReply}
            className="text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light hover:dark:bg-surface-dark rounded-full"
          >
            <FaReply size={16} />
          </ActionIcon>
        </div>
      </div>
    </div>
    {isUser && (
      <Avatar src={info.profile_picture} alt="Profile image" size="md" radius="xl" />
    )}
  </div>
);};

export default MessageBubble;
