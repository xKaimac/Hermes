import { ScrollArea, Avatar, Button } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import io from "socket.io-client";

import { User } from "../../../../shared/types/User";
import { FriendsListData } from "../../../../shared/types/FriendsListData";
import { useUser } from "../../utils/UserContext";

import AddFriend from "./AddFriend";

const fetchFriends = async (user_id: string): Promise<FriendsListData> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/friends/get-friends`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("Failed to fetch friends");

  return response.json();
};

const FriendsList = () => {
  const { userData } = useUser();
  const user_id = userData.user.id;
  const queryClient = useQueryClient();

  const {
    data: friends,
    isLoading,
    error,
    refetch,
  } = useQuery<FriendsListData, Error>({
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

  const handleFriendAction = async (
    actionType: "accepted" | "reject" | "block",
    friend_id: number
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/protected/friends/handle-friend-request`,
        {
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
        }
      );

      if (!response.ok) throw new Error(`Failed to ${actionType} friend request`);

      refetch();
    } catch (error) {
      console.error(`Error ${actionType}ing friend request:`, error);
    }
  };

  const renderFriendList = (
    friendList: User[],
    type: "accepted" | "outgoing" | "incoming"
  ) => (
    <ul className="divide-y divide-text-light-secondary/25 dark:divide-text-light-secondary/75">
      {friendList.map((friend) => (
        <li key={friend.id} className="flex flex-row mt-2 mb-2 p-5">
          <Avatar src={friend.profile_picture} radius="xl" size="lg" />
          <div className="pl-3 text-left overflow-hidden mt-auto mb-auto flex-grow">
            <a className="truncate text-lg text-text-light-primary dark:text-text-dark-primary">
              {friend.username}
            </a>
            <p className="truncate text-sm text-text-light-secondary dark:text-text-dark-secondary">
              {friend.status_text}
            </p>
          </div>
          {type === "outgoing" && (
            <span className="text-yellow-500">Request Pending</span>
          )}
          {type === "incoming" && (
            <div className="flex flex-row">
              <Button
                variant="transparent"
                onClick={() => handleFriendAction("accepted", friend.id)}
              >
                <FaCheck color="green" />
              </Button>
              <Button
                variant="transparent"
                onClick={() => handleFriendAction("reject", friend.id)}
              >
                <IoClose color="red" />
              </Button>
              <Button
                variant="transparent"
                onClick={() => handleFriendAction("block", friend.id)}
              >
                <MdBlock color="grey" />
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="h-full flex flex-col items-center justify-start">
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-lg w-11/12 max-w-2xl h-full transition-colors duration-200 flex flex-col">
        <div className="flex flex-row text-center items-center mb-4">
          <AddFriend />
          <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
            Friends
          </h1>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {}</div>
        ) : friends ? (
          <ScrollArea className="flex-grow">
            {friends.confirmedFriends.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-2 text-text-light-primary dark:text-text-dark-primary">
                  Confirmed Friends
                </h2>
                {renderFriendList(friends.confirmedFriends, "accepted")}
              </>
            )}
            {friends.outgoingRequests.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-4 mb-2 text-text-light-secondary dark:text-text-dark-secondary">
                  Outgoing Requests
                </h2>
                {renderFriendList(friends.outgoingRequests, "outgoing")}
              </>
            )}
            {friends.incomingRequests.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-4 mb-2 text-text-light-secondary dark:text-text-dark-secondary">
                  Incoming Requests
                </h2>
                {renderFriendList(friends.incomingRequests, "incoming")}
              </>
            )}
            {friends.confirmedFriends.length === 0 &&
              friends.outgoingRequests.length === 0 &&
              friends.incomingRequests.length === 0 && (
                <p className="text-center text-text-light-primary dark:text-text-dark-primary">
                  You don't have any friends or friend requests yet.
                </p>
              )}
          </ScrollArea>
        ) : null}
      </div>
    </div>
  );
};

export default FriendsList;
