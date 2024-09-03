import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Textarea } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
const UpdateChatName = ({ chat_id, chat_name, isAdmin, }) => {
    const [currentChatName, setCurrentChatName] = useState(chat_name);
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        setCurrentChatName(chat_name);
    }, [chat_name]);
    const updateChatName = async ({ chat_id }) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/update-chat-name`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat_name: currentChatName, chat_id }),
            credentials: "include",
        });
        if (!response.ok)
            throw new Error("Upload failed");
    };
    const mutation = useMutation({
        mutationFn: updateChatName,
    });
    const handleClick = (event) => {
        event?.preventDefault();
        setIsEditing(false);
        mutation.mutate({ chat_name, chat_id: chat_id });
    };
    const handleOnChange = (event) => {
        setCurrentChatName(event.target.value);
    };
    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleClick();
        }
    };
    const EnterComponent = () => {
        return (_jsx("button", { onClick: handleClick, className: "p-2 text-background-light dark:text-surface-dark w-10 h-10 flex items-center justify-center", children: _jsx(FaArrowCircleRight, {}) }));
    };
    return (_jsx(_Fragment, { children: !isEditing ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex flex-row w-3/4 lg:w-1/2 xl:w-1/3 pt-5 text-center items-center justify-center", children: _jsx("p", { className: "text-text-light-secondary dark:text-text-dark-secondary", children: currentChatName }) }), isAdmin && (_jsx(Button, { variant: "transparent", onClick: () => setIsEditing(true), className: "text-text-light-primary dark:text-text-light-secondary w-1/2", children: _jsx(MdEdit, { size: "1vw" }) }))] })) : (_jsx("div", { className: "w-3/4 lg:w-1/2 xl:w-1/3 pt-5", children: _jsx(Textarea, { radius: "xl", maxLength: 255, autosize: true, minRows: 1, maxRows: 8, value: currentChatName, rightSection: _jsx(EnterComponent, {}), onChange: handleOnChange, onKeyPress: handleKeyPress }) })) }));
};
export default UpdateChatName;
