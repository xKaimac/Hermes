import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Avatar } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
const uploadChatPicture = async ({ file, chat_id }) => {
    const formData = new FormData();
    formData.append("chat_picture", file);
    formData.append("chat_id", chat_id.toString());
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/upload-chat-picture`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });
    if (!response.ok)
        throw new Error("Upload failed");
    const data = await response.json();
    return data.result.secure_url;
};
const ChatPictureUpload = ({ isAdmin, chat_id, chat_picture, }) => {
    const [currentChatPicture, setCurrentChatPicture] = useState(chat_picture);
    useEffect(() => {
        setCurrentChatPicture(chat_picture);
    }, [chat_picture]);
    const mutation = useMutation({
        mutationFn: uploadChatPicture,
        onSuccess: (chat_picture) => {
            setCurrentChatPicture(chat_picture);
        },
    });
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            mutation.mutate({ file, chat_id });
        }
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center pt-5", children: [_jsx(Avatar, { className: "size-[20vh]", src: currentChatPicture }), _jsx("input", { type: "file", onChange: handleFileChange, accept: "image/*", style: { display: "none" }, id: "chat-picture-input" }), isAdmin && (_jsx("div", { className: "pt-5", children: _jsx("label", { htmlFor: "chat-picture-input", children: _jsx(Button, { component: "span", className: "bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-text-dark-primary", loading: mutation.isPending, children: mutation.isPending ? "Uploading..." : "Change Chat Picture" }) }) })), mutation.isError && (_jsxs("p", { className: "text-red-500 mt-2", children: ["Upload failed. Please try again. Error: ", mutation.error?.message] }))] }));
};
export default ChatPictureUpload;
