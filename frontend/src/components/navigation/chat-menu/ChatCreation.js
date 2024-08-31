import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover, TextInput, ScrollArea, Button, Text, Avatar, } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowCircleRight, FaPlus, FaTimes } from "react-icons/fa";
import { useUser } from "../../../utils/UserContext";
const createChat = async ({ chat_name, members, }) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/create-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_name, members }),
        credentials: "include",
    });
    if (!response.ok)
        throw new Error("Failed to create chat");
};
const addMember = async ({ user_id, friendName }) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/friends/find-friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, friendName }),
        credentials: "include",
    });
    if (!response.ok)
        throw new Error("User not found");
    const data = await response.json();
    console.log(data);
    return data.result;
};
const ChatCreation = () => {
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [memberName, setMemberName] = useState("");
    const [chat_name, setChatName] = useState("");
    const { userData } = useUser();
    const queryClient = useQueryClient();
    const user = {
        id: userData.user.id,
        username: userData.user.username,
        profile_picture: userData.user.profilePicture,
        role: "admin",
    };
    const [members, setParticipants] = useState([user]);
    const createChatMutation = useMutation({
        mutationFn: createChat,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friends", userData.user.id],
            });
            setChatName("");
            setParticipants([user]);
            setIsCreatingChat(false);
        },
    });
    const addMemberMutation = useMutation({
        mutationFn: addMember,
        onSuccess: (friend) => {
            console.log(friend);
            setParticipants((prev) => [
                ...prev,
                { ...friend, role: "regular" },
            ]);
            setMemberName("");
        },
    });
    const handleCreateChat = (event) => {
        event.preventDefault();
        if (!chat_name.trim() || members.length <= 1)
            return;
        createChatMutation.mutate({ chat_name, members });
    };
    const handleAddMember = (event) => {
        event.preventDefault();
        if (!memberName.trim())
            return;
        addMemberMutation.mutate({ user_id: user.id, friendName: memberName });
    };
    const removeMember = (id) => {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
    };
    return (_jsxs(Popover, { opened: isCreatingChat, onClose: () => setIsCreatingChat(false), position: "bottom", withArrow: true, shadow: "md", radius: "lg", children: [_jsx(Popover.Target, { children: _jsx(Button, { className: "w-1/4 text-text-light-primary dark:text-text-dark-primary", variant: "transparent", rightSection: _jsx(FaPlus, {}), onClick: () => setIsCreatingChat(true) }) }), _jsxs(Popover.Dropdown, { children: [_jsxs("form", { onSubmit: handleCreateChat, children: [_jsx(TextInput, { placeholder: "Chat Name", value: chat_name, onChange: (event) => setChatName(event.currentTarget.value), className: "mb-2", disabled: createChatMutation.isPending }), _jsx(TextInput, { placeholder: "Add User To Chat", value: memberName, onChange: (event) => setMemberName(event.currentTarget.value), disabled: addMemberMutation.isPending, className: "pb-2", onKeyDown: (event) => {
                                    if (event.key === "Enter") {
                                        handleAddMember(event);
                                    }
                                }, rightSection: (_jsx(Button, { size: "sm", variant: "transparent", className: "text-text-light-secondary dark:text-text-dark-secondary", onClick: handleAddMember, disabled: addMemberMutation.isPending, style: { padding: "0 8px" }, children: _jsx(FaArrowCircleRight, { size: 24 }) })), rightSectionWidth: 40 }), addMemberMutation.isError && (_jsx(Text, { className: "text-red", size: "sm", children: addMemberMutation.error instanceof Error
                                    ? addMemberMutation.error.message
                                    : "An error occurred" })), _jsx(ScrollArea, { style: { height: 150 }, className: "mb-2", children: members.map((member) => member.id !== userData.user.id && (_jsxs("div", { className: "flex justify-between items-center mb-2 p-2 bg-surface-light dark:bg-surface-dark rounded", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Avatar, { src: member.profile_picture, alt: member.username, size: "sm", radius: "xl" }), _jsx(Text, { className: "pl-2 text-text-light-secondary dark:text-text-dark-secondary", size: "sm", ml: 2, children: member.username })] }), _jsx(Button, { size: "xs", variant: "subtle", color: "red", onClick: () => removeMember(member.id), children: _jsx(FaTimes, {}) })] }, member.id))) }), _jsx(Button, { type: "submit", fullWidth: true, disabled: createChatMutation.isPending, className: "bg-primary-light dark:bg-primary-dark", children: "Create Chat" })] }), createChatMutation.isError && (_jsx(Text, { className: "text-red", size: "sm", children: createChatMutation.error instanceof Error
                            ? createChatMutation.error.message
                            : "An error occurred" }))] })] }));
};
export default ChatCreation;
