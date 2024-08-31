import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ActionIcon, Avatar } from "@mantine/core";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaReply } from "react-icons/fa";
import { useMutation, useQueryClient } from '@tanstack/react-query';
const MessageBubble = ({ message, user_info, sender_info, onReply, getRepliedMessage }) => {
    const isUser = user_info.id === message.sender_id;
    const info = isUser ? user_info : sender_info;
    const [isHovered, setIsHovered] = useState(false);
    const queryClient = useQueryClient();
    const replyToMessage = message.reply_to_id ? getRepliedMessage(message.reply_to_id) : undefined;
    const likeMutation = useMutation({
        mutationFn: (messageId) => fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/like-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message_id: messageId, user_id: user_info.id }),
            credentials: 'include',
        }).then(res => res.json()),
        onMutate: async (messageId) => {
            await queryClient.cancelQueries({ queryKey: ['messages'] });
            const previousMessages = queryClient.getQueryData(['messages']);
            queryClient.setQueryData(['messages'], (old) => old?.map((msg) => msg.id === messageId
                ? {
                    ...msg,
                    likes: (msg.likes || 0) + 1,
                    liked_by: [...(msg.liked_by || []), user_info.id],
                    liked_by_current_user: true,
                }
                : msg));
            return { previousMessages };
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
    const unlikeMutation = useMutation({
        mutationFn: (messageId) => fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/unlike-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message_id: messageId, user_id: user_info.id }),
            credentials: 'include',
        }).then(res => res.json()),
        onMutate: async (messageId) => {
            await queryClient.cancelQueries({ queryKey: ['messages'] });
            const previousMessages = queryClient.getQueryData(['messages']);
            queryClient.setQueryData(['messages'], (old) => old?.map((msg) => msg.id === messageId
                ? {
                    ...msg,
                    likes: Math.max(0, (msg.likes || 0) - 1),
                    liked_by: (msg.liked_by || []).filter((id) => id !== user_info.id),
                    liked_by_current_user: false,
                }
                : msg));
            return { previousMessages };
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
    const handleLikeClick = async () => {
        if (message.liked_by_current_user) {
            unlikeMutation.mutate(message.id);
        }
        else {
            likeMutation.mutate(message.id);
        }
    };
    const handleReply = () => {
        onReply(message);
    };
    return (_jsxs("div", { className: `flex items-start gap-1 ${isUser ? 'justify-end' : 'justify-start'}`, children: [!isUser && (_jsx(Avatar, { src: info.profile_picture, alt: "Profile image", size: "md", radius: "xl" })), _jsxs("div", { className: `flex flex-col gap-1 max-w-[50vw] ${isUser ? 'items-end' : 'items-start'}`, children: [_jsx("div", { className: "flex items-center space-x-2 rtl:space-x-reverse", children: _jsx("span", { className: "text-sm font-semibold text-text-light-primary dark:text-text-dark-primary", children: info.username }) }), _jsxs("div", { className: `group relative flex items-start gap-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsxs("div", { className: `flex flex-col leading-1.5 p-4 ${isUser
                                    ? 'bg-primary text-text-dark-primary rounded-s-xl rounded-ee-xl'
                                    : 'bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary rounded-e-xl rounded-es-xl'} ${replyToMessage ? (isUser ? 'border-l-4 border-primary-light' : 'border-r-4 dark:border-[#242424]') : ''}`, children: [replyToMessage && (_jsx("div", { className: "mb-2 text-xs text-text-dark-secondary pb-1", children: _jsxs("span", { className: "font-semibold", children: ["Replying to ", replyToMessage.sender_id === user_info.id ? 'yourself' : sender_info.username] }) })), _jsx("p", { className: "text-md font-normal", children: message.content })] }), _jsx("div", { className: `absolute bottom-0 ${isUser ? 'left-0 ml-4' : 'right-0 mr-4'} transform translate-y-1/2 transition-opacity ${(message.likes && message.likes > 0) || isHovered ? 'opacity-100' : 'opacity-0'}`, children: _jsxs("div", { className: "flex items-center bg-pink-500 rounded-full px-2 py-1 cursor-pointer", onClick: handleLikeClick, children: [_jsx(ActionIcon, { size: "xs", variant: "transparent", children: message.liked_by_current_user ? (_jsx(AiFillHeart, { size: 14 })) : (_jsx(AiOutlineHeart, { size: 14 })) }), message.likes && message.likes > 0 && (_jsx("span", { className: "text-text-dark-primary text-xs ml-1", children: message.likes }))] }) }), _jsx("div", { className: `self-end mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'mr-2' : 'ml-2'}`, children: _jsx(ActionIcon, { variant: "transparent", size: "sm", onClick: handleReply, className: "text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light hover:dark:bg-surface-dark rounded-full", children: _jsx(FaReply, { size: 16 }) }) })] })] }), isUser && (_jsx(Avatar, { src: info.profile_picture, alt: "Profile image", size: "md", radius: "xl" }))] }));
};
export default MessageBubble;
