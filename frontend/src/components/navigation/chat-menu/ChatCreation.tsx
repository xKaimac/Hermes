import {
  Popover,
  TextInput,
  ScrollArea,
  Button,
  Text,
  Avatar,
} from "@mantine/core";
import { useState } from "react";
import { FaArrowCircleRight, FaPlus, FaTimes } from "react-icons/fa";
import { useUser } from "../../../utils/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../../../shared/types/User";

// This is the format the backend returns the friends as
interface Friend {
  id: string;
  username: string;
  profilePicture: string;
}

interface Participant extends Friend {
  role: "admin" | "regular";
}

interface CreateChatParams {
  chatName: string;
  participants: Participant[];
}

// This is the format the database expects it to be in
interface FilteredParticipant {
  userId: string;
  role: "admin" | "regular";
}

const createChat = async ({
  chatName,
  participants,
}: CreateChatParams): Promise<any> => {
  const filteredParticipants: FilteredParticipant[] = participants.map(
    ({ id, role }) => ({
      userId: id,
      role,
    })
  );

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/chats/create-chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatName, filteredParticipants }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create chat");
  }

  return response.json();
};

const addFriend = async (friendName: string): Promise<User> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/friends/find-friend`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendName }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Friend not found");
  }

  const data = await response.json();

  return data.result.friend;
};

const ChatCreation = () => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [chatName, setChatName] = useState("");
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const [participants, setParticipants] = useState([
    {
      id: userData.user.id,
      username: userData.user.username,
      profilePicture: userData.user.profilePicture,
      role: "admin",
    },
  ]);

  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends", userData.user.id],
      });
      setChatName("");
      setParticipants([
        {
          id: userData.user.id,
          username: userData.user.username,
          profilePicture: userData.user.profilePicture,
          role: "admin",
        },
      ]);
      setIsCreatingChat(false);
    },
  });

  const addFriendMutation = useMutation({
    mutationFn: addFriend,
    onSuccess: (friend) => {

      setParticipants((prev: Array<Participant>) => [
        ...prev,
        { ...friend, role: "regular" },
      ]);
      setFriendName("");
    },
  });

  const handleCreateChat = (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatName.trim() || participants.length <= 1) return;
    createChatMutation.mutate({ chatName, participants });
  };

  const handleAddFriend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!friendName.trim()) return;
    addFriendMutation.mutate(friendName);
  };

  const removeFriend = (id: string) => {
    setParticipants((prev: Array<Participant>) =>
      prev.filter((p) => p.id !== id)
    );
  };

  return (
    <Popover
      opened={isCreatingChat}
      onClose={() => setIsCreatingChat(false)}
      position="bottom"
      withArrow
      shadow="md"
      radius="lg"
    >
      <Popover.Target>
        <Button
          className="w-1/4 text-text-light-primary dark:text-text-dark-primary"
          variant="transparent"
          rightSection={<FaPlus />}
          onClick={() => setIsCreatingChat(true)}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <form onSubmit={handleCreateChat}>
          <TextInput
            placeholder="Chat Name"
            value={chatName}
            onChange={(event) => setChatName(event.currentTarget.value)}
            className="mb-2"
            disabled={createChatMutation.isPending}
          />
          <TextInput
            placeholder="Add Friend To Chat"
            value={friendName}
            onChange={(event) => setFriendName(event.currentTarget.value)}
            disabled={addFriendMutation.isPending}
            className="pb-2"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAddFriend(event);
              }
            }}
            rightSection={(
              <Button
                size="sm"
                variant="transparent"
                className="text-text-light-secondary dark:text-text-dark-secondary"
                onClick={handleAddFriend}
                disabled={addFriendMutation.isPending}
                style={{ padding: "0 8px" }}
              >
                <FaArrowCircleRight size={24} />
              </Button>
            )}
            rightSectionWidth={40}
          />
          {addFriendMutation.isError && (
            <Text className="text-red" size="sm">
              {addFriendMutation.error instanceof Error
                ? addFriendMutation.error.message
                : "An error occurred"}
            </Text>
          )}
          <ScrollArea style={{ height: 150 }} className="mb-2">
            {participants.map(
              (participant: Participant) =>
                participant.id !== userData.user.id && (
                  <div
                    key={participant.id}
                    className="flex justify-between items-center mb-2 p-2 bg-surface-light dark:bg-surface-dark rounded"
                  >
                    <div className="flex items-center">
                      <Avatar
                        src={participant.profilePicture}
                        alt={participant.username}
                        size="sm"
                        radius="xl"
                      />
                      <Text
                        className="pl-2 text-text-light-secondary dark:text-text-dark-secondary"
                        size="sm"
                        ml={2}
                      >
                        {participant.username}
                      </Text>
                    </div>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => removeFriend(participant.id)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                )
            )}
          </ScrollArea>
          <Button
            type="submit"
            fullWidth
            disabled={createChatMutation.isPending}
            className="bg-primary-light dark:bg-primary-dark"
          >
            Create Chat
          </Button>
        </form>
        {createChatMutation.isError && (
          <Text className="text-red" size="sm">
            {createChatMutation.error instanceof Error
              ? createChatMutation.error.message
              : "An error occurred"}
          </Text>
        )}
      </Popover.Dropdown>
    </Popover>
  );
};

export default ChatCreation;
