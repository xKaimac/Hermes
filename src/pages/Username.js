import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, TextInput } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import BackgroundWithAnimation from "../components/layouts/BackgroundAnimation";
const Username = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ["userStatus"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/status`, {
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("Failed to fetch user status");
            return response.json();
        },
    });
    const updateUsername = useMutation({
        mutationFn: async (newUsername) => {
            console.log(newUsername);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/user/set-username`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: newUsername,
                    user_id: userData.user.id,
                }),
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("Network response was not ok");
            return response.json();
        },
        onSuccess: (data) => {
            if (data === true) {
                navigate({ to: "/" });
            }
            else {
                setError("Username is not available. Please try another.");
            }
        },
        onError: () => {
            setError("Something went wrong. Please try again.");
        },
    });
    const handleSubmit = (error) => {
        error.preventDefault();
        setError("");
        updateUsername.mutate(username);
    };
    if (userLoading) {
        return _jsx("h3", { children: "Loading..." });
    }
    if (!userData?.isAuthenticated) {
        navigate({ to: "/login" });
        return null;
    }
    return (_jsxs("div", { className: "flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200", children: [_jsx(BackgroundWithAnimation, {}), _jsx("div", { className: "absolute inset-0 z-10 flex flex-col items-center justify-center", children: _jsxs("div", { className: "text-center bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-lg w-4/5 md:w-1/2 transition-colors duration-200", children: [_jsx("h1", { className: "text-2xl font-bold mb-4 text-text-light-primary dark:text-text-dark-primary", children: "It looks like you're new here!" }), _jsx("p", { className: "text-lg mb-6 text-text-light-secondary dark:text-text-dark-secondary", children: "What should we know you by?" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(TextInput, { value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Enter new username", required: true }), error && _jsx("p", { className: "text-red-500 dark:text-red-400", children: error }), _jsx(Button, { type: "submit", loading: updateUsername.isPending, fullWidth: true, className: "bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-text-dark-primary", children: "Let's go!" })] })] }) })] }));
};
export default Username;
