import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, ScrollArea, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useUser } from "../../../utils/UserContext";
import ChatCreation from "./ChatCreation";
const ChatMenu = ({ onChatSelect, onProfileClick }) => {
    const { userData, isLoading } = useUser();
    const [chats, setChats] = useState(new Array());
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [error, setError] = useState(null);
    const getChats = async (user_id) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-chats?user_id=${user_id}`, {
            method: "GET",
            credentials: "include",
        });
        if (!response.ok)
            throw new Error("Failed to fetch chats");
        const data = await response.json();
        return data.chats;
    };
    useEffect(() => {
        const fetchChats = async () => {
            if (userData && userData.isAuthenticated) {
                try {
                    const fetchedChats = await getChats(userData.user.id);
                    setChats(fetchedChats);
                }
                catch (err) {
                    setError("Failed to load chats. Please try again later.");
                    console.error(err);
                }
                finally {
                    setIsLoadingChats(false);
                }
            }
        };
        fetchChats();
        const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
        socket.emit("authenticate", { user_id: userData.user.id });
        socket.on("newChat", (newChat) => {
            setChats((prevChats) => [...prevChats, newChat]);
        });
        socket.on("newMessage", (newMessage) => {
            setChats((prevChats) => prevChats.map((chat) => chat.id === newMessage.chat_id
                ? { ...chat, mostRecentMessage: newMessage.content }
                : chat));
        });
        socket.on("chatPictureUpdate", (update) => {
            setChats((prevChats) => prevChats.map((chat) => chat.id === update.id
                ? { ...chat, chat_picture: update.chat_picture }
                : chat));
        });
        socket.on("chatNameUpdate", (update) => {
            setChats((prevChats) => prevChats.map((chat) => chat.id === update.id
                ? { ...chat, name: update.name }
                : chat));
        });
        return () => {
            socket.disconnect();
        };
    }, [userData]);
    if (isLoading || isLoadingChats) {
        return _jsx("div", { children: "Loading..." });
    }
    if (!userData || !userData.isAuthenticated) {
        return _jsx("div", { children: "Please log in to view chats" });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs("div", { className: "flex flex-col w-1/4 bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl m-5 p-5 overflow-hidden", children: [_jsxs("div", { className: "flex flex-row justify-between items-center", children: [_jsx("h1", { className: "text-3xl text-text-light-primary dark:text-text-dark-primary", children: "Chats" }), _jsx(ChatCreation, {})] }), _jsx(TextInput, { className: "mt-2 mb-2 pt-1", radius: "xl", type: "text", placeholder: "Search" }), _jsx(ScrollArea, { children: _jsx("ul", { children: chats.map((chat) => (_jsxs("li", { className: "flex flex-row mt-2 mb-2 cursor-pointer", onClick: () => onChatSelect(chat), children: [_jsx(Avatar, { radius: "xl", size: "lg", src: chat.chat_picture }), _jsxs("div", { className: "pl-2 mt-auto mb-auto", children: [_jsx("a", { className: "block truncate", children: chat.name }), _jsx("p", { className: "truncate text-sm text-gray-500", children: chat.mostRecentMessage })] })] }, chat.id))) }) }), _jsx("div", { className: "border-t mt-auto pt-2 ", children: _jsx("div", { children: _jsx(Avatar, { size: "lg", src: userData.user.profile_picture, onClick: onProfileClick, className: "hover:cursor-pointer" }) }) })] }));
};
export default ChatMenu;
