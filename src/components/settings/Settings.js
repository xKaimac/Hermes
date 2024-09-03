import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, ScrollArea } from "@mantine/core";
import { useState, useEffect } from "react";
import ThemeToggle from "../../utils/theme-toggle.util";
import { useUser } from "../../utils/UserContext";
import AddChatMember from "./AddChatMember";
import ChatPictureUpload from "./ChatPictureUpload";
import UpdateChatName from "./UpdateChatName";
const Settings = ({ selectedChat, members }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const { userData } = useUser();
    const user_id = userData.user.id;
    useEffect(() => {
        if (selectedChat) {
            fetchRoleStatus();
        }
    }, [selectedChat]);
    const fetchRoleStatus = async () => {
        if (!selectedChat)
            return;
        try {
            setIsLoading(true);
            setError(null);
            const role = await getRoleStatus(selectedChat.id, user_id);
            setIsAdmin(role === "admin");
        }
        catch (err) {
            setError("Failed to fetch chat members");
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getRoleStatus = async (chat_id, user_id) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/get-role`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat_id, user_id }),
            credentials: "include",
        });
        if (!response.ok)
            throw new Error("Failed to fetch chats");
        const data = await response.json();
        return data.result;
    };
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    return (_jsx("div", { className: "flex flex-col w-1/2 bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl mt-5 mr-5 p-5 overflow-y-auto", children: selectedChat ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col h-screen bg-background-light dark:bg-background-dark", children: [_jsxs("div", { className: "flex-shrink-0 relative flex flex-col items-center justify-center py-4", children: [_jsx(ChatPictureUpload, { isAdmin: isAdmin, chat_id: selectedChat?.id, chat_picture: selectedChat?.chat_picture }), _jsx(UpdateChatName, { chat_id: selectedChat.id, chat_name: selectedChat?.name, isAdmin: isAdmin }), _jsx("div", { className: "absolute top-2 right-2", children: _jsx(ThemeToggle, {}) })] }), _jsxs("div", { className: "flex-grow flex flex-col overflow-hidden", children: [_jsxs("div", { className: "flex-shrink-0 flex flex-row items-center justify-between px-4 py-2", children: [_jsx("h2", { className: "text-xl font-semibold text-text-light-primary dark:text-text-dark-primary", children: "Members" }), isAdmin && _jsx(AddChatMember, { chat_id: selectedChat.id })] }), _jsx(ScrollArea, { className: "flex-grow", children: _jsxs("ul", { className: "divide-y divide-text-light-secondary/25 dark:divide-text-light-secondary/75 px-4", children: [isLoading && _jsx("p", { className: "p-4", children: "Loading..." }), !isLoading &&
                                                members.map((member) => (_jsxs("li", { className: "flex items-center py-4", children: [_jsx(Avatar, { src: member.profile_picture, alt: member.username, className: "h-10 w-10" }), _jsxs("div", { className: "ml-3 overflow-hidden", children: [_jsx("p", { className: "truncate text-sm font-medium text-text-light-primary dark:text-text-dark-primary", children: member.username }), _jsx("p", { className: "truncate text-xs text-text-light-secondary dark:text-text-dark-secondary", children: member.joined_at && (`Member since ${formatTimestamp(member.joined_at)}`) })] })] }, member.id)))] }) })] })] }), " "] })) : (_jsx("p", { className: "text-text-light-secondary dark:text-text-dark-secondary", children: "Select a chat to view and edit settings." })) }));
};
export default Settings;
