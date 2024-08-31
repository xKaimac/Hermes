import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ScrollArea, Avatar, Button } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import io from "socket.io-client";
import { useUser } from "../../utils/UserContext";
import AddFriend from "./AddFriend";
const fetchFriends = async (user_id) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/friends/get-friends`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
        credentials: "include",
    });
    if (!response.ok)
        throw new Error("Failed to fetch friends");
    return response.json();
};
const FriendsList = () => {
    const { userData } = useUser();
    const user_id = userData.user.id;
    const queryClient = useQueryClient();
    const { data: friends, isLoading, error, refetch, } = useQuery({
        queryKey: ["friends", user_id],
        queryFn: () => fetchFriends(user_id),
        enabled: !!user_id,
    });
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
        socket.on("connect", () => {
            socket.emit("authenticate", { user_id: userData.user.id });
        });
        socket.on("friendRequest", () => {
            queryClient.invalidateQueries({ queryKey: ["friends", user_id] });
        });
        socket.on("friendRequestAccepted", () => {
            queryClient.invalidateQueries({ queryKey: ["friends", user_id] });
        });
        return () => {
            socket.disconnect();
        };
    }, [user_id, queryClient, userData.user.id]);
    const handleFriendAction = async (actionType, friend_id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/friends/handle-friend-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: actionType,
                    user_id: userData.user.id,
                    friend_id: friend_id,
                }),
                credentials: "include",
            });
            if (!response.ok)
                throw new Error(`Failed to ${actionType} friend request`);
            refetch();
        }
        catch (error) {
            console.error(`Error ${actionType}ing friend request:`, error);
        }
    };
    const renderFriendList = (friendList, type) => (_jsx("ul", { className: "divide-y divide-text-light-secondary/25 dark:divide-text-light-secondary/75", children: friendList.map((friend) => (_jsxs("li", { className: "flex flex-row mt-2 mb-2 p-5", children: [_jsx(Avatar, { src: friend.profile_picture, radius: "xl", size: "lg" }), _jsxs("div", { className: "pl-3 text-left overflow-hidden mt-auto mb-auto flex-grow", children: [_jsx("a", { className: "truncate text-lg text-text-light-primary dark:text-text-dark-primary", children: friend.username }), _jsx("p", { className: "truncate text-sm text-text-light-secondary dark:text-text-dark-secondary", children: friend.status_text })] }), type === "outgoing" && (_jsx("span", { className: "text-yellow-500", children: "Request Pending" })), type === "incoming" && (_jsxs("div", { className: "flex flex-row", children: [_jsx(Button, { variant: "transparent", onClick: () => handleFriendAction("accepted", friend.id), children: _jsx(FaCheck, { color: "green" }) }), _jsx(Button, { variant: "transparent", onClick: () => handleFriendAction("reject", friend.id), children: _jsx(IoClose, { color: "red" }) }), _jsx(Button, { variant: "transparent", onClick: () => handleFriendAction("block", friend.id), children: _jsx(MdBlock, { color: "grey" }) })] }))] }, friend.id))) }));
    return (_jsx("div", { className: "h-full flex flex-col items-center justify-start", children: _jsxs("div", { className: "bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-lg w-11/12 max-w-2xl h-full transition-colors duration-200 flex flex-col", children: [_jsxs("div", { className: "flex flex-row text-center items-center mb-4", children: [_jsx(AddFriend, {}), _jsx("h1", { className: "text-2xl font-bold text-text-light-primary dark:text-text-dark-primary", children: "Friends" })] }), isLoading ? (_jsx("div", { children: "Loading..." })) : error ? (_jsx("div", { children: "Error: " })) : friends ? (_jsxs(ScrollArea, { className: "flex-grow", children: [friends.confirmedFriends.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl font-semibold mb-2 text-text-light-primary dark:text-text-dark-primary", children: "Confirmed Friends" }), renderFriendList(friends.confirmedFriends, "accepted")] })), friends.outgoingRequests.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl font-semibold mt-4 mb-2 text-text-light-secondary dark:text-text-dark-secondary", children: "Outgoing Requests" }), renderFriendList(friends.outgoingRequests, "outgoing")] })), friends.incomingRequests.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl font-semibold mt-4 mb-2 text-text-light-secondary dark:text-text-dark-secondary", children: "Incoming Requests" }), renderFriendList(friends.incomingRequests, "incoming")] })), friends.confirmedFriends.length === 0 &&
                            friends.outgoingRequests.length === 0 &&
                            friends.incomingRequests.length === 0 && (_jsx("p", { className: "text-center text-text-light-primary dark:text-text-dark-primary", children: "You don't have any friends or friend requests yet." }))] })) : null] }) }));
};
export default FriendsList;
