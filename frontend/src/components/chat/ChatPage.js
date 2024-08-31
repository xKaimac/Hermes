import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Profile from '../../pages/Profile';
import ChatMenu from '../navigation/chat-menu/ChatMenu';
import Chat from './Chat';
import { useEffect } from 'react';
import { useUser } from '../../utils/UserContext';
import io from 'socket.io-client';
const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const { userData } = useUser();
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
        socket.emit('authenticate', { user_id: userData.user.id });
        socket.on("chatPictureUpdate", (update) => {
            // Update selectedChat if it's the one that had its picture updated
            setSelectedChat((prevSelectedChat) => prevSelectedChat?.id === update.id
                ? { ...prevSelectedChat, chat_picture: update.chat_picture }
                : prevSelectedChat);
        });
        socket.on("chatNameUpdate", (update) => {
            setSelectedChat((prevSelectedChat) => prevSelectedChat?.id === update.id
                ? { ...prevSelectedChat, name: update.name }
                : prevSelectedChat);
        });
        return () => {
            socket.disconnect();
        };
    }, [selectedChat]);
    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setShowProfile(false);
    };
    const handleProfileClick = () => {
        setShowProfile(true);
        setSelectedChat(null);
    };
    return (_jsxs("div", { className: "flex w-full flex-row", children: [_jsx(ChatMenu, { onChatSelect: handleChatSelect, onProfileClick: handleProfileClick }), showProfile ? _jsx(Profile, {}) : _jsx(Chat, { selectedChat: selectedChat })] }));
};
export default ChatPage;
