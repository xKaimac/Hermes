import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Textarea, ScrollArea, Avatar } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { FaArrowCircleRight, FaTimes } from 'react-icons/fa';
import { useUser } from '../../utils/UserContext';
import MessageBubble from '../message/MessageBubble';
import Settings from '../settings/Settings';
import io from 'socket.io-client';
import { useCallback } from 'react';
const Chat = ({ selectedChat }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [messages, setMessages] = useState(new Array());
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [members, setMembers] = useState(new Array());
    const [setError] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const inputRef = useRef(null);
    const viewportRef = useRef(null);
    const lastMessageRef = useRef(null);
    const { userData } = useUser();
    const user = {
        id: userData.user.id,
        username: userData.user.username,
        profile_picture: userData.user.profile_picture
    };
    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            fetchChatMembers();
        }
        const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
        socket.emit('authenticate', { user_id: userData.user.id });
        socket.on("newMessage", (newMessage) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                newMessage,
            ]);
            setTimeout(() => {
                lastMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        });
        socket.on("messageLikeUpdate", (updatedMessage) => {
            setMessages((prevMessages) => prevMessages.map((msg) => msg.id === updatedMessage.id ? updatedMessage : msg));
        });
        return () => {
            socket.disconnect();
        };
    }, [selectedChat]);
    const scrollToBottom = useCallback(() => {
        if (viewportRef.current) {
            const scrollContainer = viewportRef.current;
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, []);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const fetchChatMembers = async () => {
        if (!selectedChat)
            return;
        setIsLoading(true);
        try {
            const chatMembers = await getChatMembers(selectedChat.id);
            setMembers(chatMembers);
        }
        catch (err) {
            setError("Failed to fetch chat members");
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getChatMembers = async (chat_id) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-members`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat_id }),
            credentials: "include",
        });
        if (!response.ok)
            throw new Error("Failed to fetch chats");
        const data = await response.json();
        return data.result;
    };
    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };
    const fetchMessages = async () => {
        if (!selectedChat)
            return;
        setIsLoading(true);
        try {
            const allMessages = await getMessages(selectedChat.id);
            setMessages(allMessages);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getMessages = async (chat_id) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-all-messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chat_id, current_user_id: userData.user.id }),
            credentials: 'include',
        });
        if (!response.ok)
            throw new Error('Failed to fetch messages');
        const data = await response.json();
        return data.result;
    };
    const sendMessage = async ({ chat_id, sender_id, content, reply_to_id }) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chat_id, sender_id, content, reply_to_id }),
            credentials: 'include',
        });
        if (!response.ok)
            throw new Error('Failed to send message');
        const data = await response.json();
        return data;
    };
    const getSenderInfo = (sender_id) => {
        for (const member of members) {
            if (member.id === sender_id) {
                return {
                    id: member.id,
                    username: member.username,
                    profile_picture: member.profile_picture
                };
            }
        }
        return {
            id: -1,
            username: "Hermes User",
        };
    };
    const mutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            setMessage("");
            setReplyTo(null);
        },
    });
    const handleOnChange = (event) => {
        setMessage(event.target.value);
    };
    const handleClick = (event) => {
        event?.preventDefault();
        if (message.trim().length <= 0) {
            setMessage("");
            return;
        }
        mutation.mutate({
            chat_id: selectedChat.id,
            sender_id: userData.user.id,
            content: message,
            reply_to_id: replyTo?.id
        });
        setMessage("");
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleClick();
        }
    };
    const handleReply = (message) => {
        setReplyTo(message);
        inputRef.current?.focus();
    };
    const cancelReply = () => {
        setReplyTo(null);
    };
    const getRepliedMessage = useCallback((replyToId) => {
        return messages.find((msg) => msg.id === replyToId);
    }, [messages]);
    const EnterComponent = () => {
        return (_jsx("button", { onClick: handleClick, className: "text-background-light dark:text-surface-dark flex h-10 w-10 items-center justify-center p-2", children: _jsx(FaArrowCircleRight, {}) }));
    };
    return (_jsxs("div", { className: "flex w-full", children: [_jsxs("div", { className: `flex flex-col ${isSettingsOpen ? 'w-3/4' : 'w-full'} bg-background-light dark:bg-background-dark mb-5 mr-5 mt-5 h-[calc(100vh-2.5rem)] overflow-hidden rounded-xl p-5 transition-all duration-300`, children: [_jsxs("div", { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { className: "flex flex-row", children: [selectedChat && (_jsx(Avatar, { src: selectedChat.chat_picture, radius: "xl", size: "md" })), _jsx("h1", { className: "text-text-light-primary dark:text-text-dark-primary pl-2 text-3xl", children: selectedChat ? selectedChat.name : 'Select a chat' })] }), _jsx("button", { onClick: toggleSettings, className: "text-text-light-primary dark:text-text-dark-primary text-3xl", children: "..." })] }), _jsx("div", { className: "flex-grow overflow-hidden", children: _jsxs(ScrollArea, { className: "h-full", viewportRef: viewportRef, children: [isLoading && _jsx("p", { className: "p-4", children: "Loading..." }), !isLoading &&
                                    messages.map((message, index) => (_jsx("div", { className: "mb-2", ref: index === messages.length - 1 ? lastMessageRef : null, children: _jsx(MessageBubble, { message: message, user_info: user, sender_info: getSenderInfo(message.sender_id), onReply: handleReply, getRepliedMessage: getRepliedMessage }) }, index)))] }) }), replyTo && (_jsxs("div", { className: "bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-t-md flex items-center text-xs w-full", children: [_jsx("div", { className: "flex-1 min-w-0 mr-2 w-full", children: _jsxs("span", { className: "font-semibold text-text-light-primary dark:text-text-dark-primary truncate inline-block w-full", children: ["Replying to ", getSenderInfo(replyTo.sender_id).username] }) }), _jsx("button", { onClick: cancelReply, className: "text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-light dark:hover:text-primary-dark transition-colors flex-shrink-0", children: _jsx(FaTimes, { size: 12 }) })] })), _jsx(Textarea, { ref: inputRef, autosize: true, className: "mt-2 mb-2 p-2", id: "messageBox", radius: "xl", maxRows: 25, rightSection: _jsx(EnterComponent, {}), placeholder: replyTo ? "Type your reply here" : "Type your message here", onChange: handleOnChange, onKeyPress: handleKeyPress, value: message })] }), isSettingsOpen && _jsx(Settings, { selectedChat: selectedChat, members: members })] }));
};
export default Chat;
