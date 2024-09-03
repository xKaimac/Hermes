import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover, TextInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useUser } from "../../utils/UserContext";
const addChatMember = async ({ chat_id, friendName, user_id, }) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/chats/add-member`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat_id, friendName, user_id }),
        credentials: "include",
    });
    if (!response.ok)
        throw new Error("Sorry, we can't find that user or they're not on your friends list");
};
const AddChatMember = ({ chat_id }) => {
    const [opened, setOpened] = useState(false);
    const [friendName, setFriendName] = useState("");
    const { userData } = useUser();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: addChatMember,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friends", userData.user.id],
            });
            setFriendName("");
            setOpened(false);
        },
    });
    const handleSendRequest = (event) => {
        event.preventDefault();
        if (!friendName.trim())
            return;
        mutation.mutate({ chat_id: chat_id, friendName, user_id: userData.user.id });
    };
    return (_jsxs(Popover, { opened: opened, onClose: () => setOpened(false), position: "bottom", withArrow: true, shadow: "md", radius: "lg", children: [_jsx(Popover.Target, { children: _jsx("button", { className: "flex flex-row mr-2", onClick: () => setOpened((open) => !open), children: _jsx(FaPlus, { size: "0.75rem" }) }) }), _jsx(Popover.Dropdown, { children: _jsxs("form", { onSubmit: handleSendRequest, className: "p-2", children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Add Friend" }), _jsx(TextInput, { placeholder: "Enter friend's username", value: friendName, onChange: (event) => setFriendName(event.currentTarget.value), className: "mb-2", disabled: mutation.isPending }), mutation.isError && (_jsx("p", { className: "text-red-500 mt-2 text-sm", children: mutation.error instanceof Error
                                ? mutation.error.message
                                : "An error occurred" }))] }) })] }));
};
export default AddChatMember;
