import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScrollArea, Avatar, Button } from "@mantine/core";
import AddFriend from "./AddFriend";
import { useUser } from "../../utils/UserContext";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import io from "socket.io-client";
import { Friend } from "../../types/Friend";

interface FriendsData {
  confirmedFriends: Friend[];
  outgoingRequests: Friend[];
  incomingRequests: Friend[];
}

const fetchFriends = async (userId: string): Promise<FriendsData> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/friends/get-friends`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch friends");
  }
  return response.json();
};

const FriendsList: React.FC = () => {
  const { userData } = useUser();
  const userId = userData.user.id;
  const queryClient = useQueryClient();

  const {
    data: friends,
    isLoading,
    error,
    refetch,
  } = useQuery<FriendsData, Error>({
    queryKey: ["friends", userId],
    queryFn: () => fetchFriends(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socket.emit("authenticate", { userId: userData.user.id });
    });

    socket.on("friendRequest", (data: any) => {
      console.log("Received friend request:", data);
      queryClient.invalidateQueries({ queryKey: ["friends", userId] });
    });

    socket.on("friendRequestAccepted", (data: any) => {
      console.log("Friend request accepted:", data);
      queryClient.invalidateQueries({ queryKey: ["friends", userId] });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, queryClient, userData.user.id]);

  const handleFriendAction = async (
    actionType: "accepted" | "reject" | "block",
    friendId: string
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
            userId: userData.user.id,
            friendId: friendId,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${actionType} friend request`);
      }

      refetch();
    } catch (error) {
      console.error(`Error ${actionType}ing friend request:`, error);
    }
  };

  const renderFriendList = (
    friendList: Friend[],
    type: "accepted" | "outgoing" | "incoming"
  ) => (
    <ul className="divide-y divide-text-light-secondary/25 dark:divide-text-light-secondary/75">
      {friendList.map((friend) => (
        <li key={friend.id} className="flex flex-row mt-2 mb-2 p-5">
          <Avatar src={friend.profilePicture} radius="xl" size="lg" />
          <div className="pl-3 text-left overflow-hidden mt-auto mb-auto flex-grow">
            <a className="truncate text-lg text-text-light-primary dark:text-text-dark-primary">
              {friend.username}
            </a>
            <p className="truncate text-sm text-text-light-secondary dark:text-text-dark-secondary">
              {friend.statusText}
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
