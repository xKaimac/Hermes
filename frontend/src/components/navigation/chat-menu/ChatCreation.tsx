import {
  Popover,
  TextInput,
  ScrollArea,
  Button,
  Text,
  Avatar,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowCircleRight, FaPlus, FaTimes } from "react-icons/fa";

import { ChatMember } from "../../../../../shared/types/ChatMember";
import { User } from "../../../../../shared/types/User";
import { CreateChatParams} from "../../../types/props/ChatCreationProps";
import { useUser } from "../../../utils/UserContext";

const createChat = async ({
  chat_name,
  members,
}: CreateChatParams): Promise<void> => {

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/chats/create-chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_name, members }),
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("Failed to create chat");
};

const addMember = async (friendName: string): Promise<User> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/friends/find-friend`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendName }),
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("User not found");

  const data = await response.json();

  return data.result.friend;
};

const ChatCreation = () => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [chat_name, setChatName] = useState("");
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const user: ChatMember = {
    id: userData.user.id,
    username: userData.user.username,
    profile_picture: userData.user.profilePicture,
    role: "admin",
  }
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

      setParticipants((prev: Array<ChatMember>) => [
        ...prev,
        { ...friend, role: "regular" },
      ]);
      setMemberName("");
    },
  });

  const handleCreateChat = (event: React.FormEvent) => {
    event.preventDefault();
    if (!chat_name.trim() || members.length <= 1) return;
    createChatMutation.mutate({ chat_name, members });
  };

  const handleAddMember = (event: React.FormEvent) => {
    event.preventDefault();
    if (!memberName.trim()) return;
    addMemberMutation.mutate(memberName);
  };

  const removeMember = (id: number) => {
    setParticipants((prev: Array<ChatMember>) =>
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
            value={chat_name}
            onChange={(event) => setChatName(event.currentTarget.value)}
            className="mb-2"
            disabled={createChatMutation.isPending}
          />
          <TextInput
            placeholder="Add User To Chat"
            value={memberName}
            onChange={(event) => setMemberName(event.currentTarget.value)}
            disabled={addMemberMutation.isPending}
            className="pb-2"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAddMember(event);
              }
            }}
            rightSection={(
              <Button
                size="sm"
                variant="transparent"
                className="text-text-light-secondary dark:text-text-dark-secondary"
                onClick={handleAddMember}
                disabled={addMemberMutation.isPending}
                style={{ padding: "0 8px" }}
              >
                <FaArrowCircleRight size={24} />
              </Button>
            )}
            rightSectionWidth={40}
          />
          {addMemberMutation.isError && (
            <Text className="text-red" size="sm">
              {addMemberMutation.error instanceof Error
                ? addMemberMutation.error.message
                : "An error occurred"}
            </Text>
          )}
          <ScrollArea style={{ height: 150 }} className="mb-2">
            {members.map(
              (member: ChatMember) =>
                member.id !== userData.user.id && (
                  <div
                    key={member.id}
                    className="flex justify-between items-center mb-2 p-2 bg-surface-light dark:bg-surface-dark rounded"
                  >
                    <div className="flex items-center">
                      <Avatar
                        src={member.profile_picture}
                        alt={member.username}
                        size="sm"
                        radius="xl"
                      />
                      <Text
                        className="pl-2 text-text-light-secondary dark:text-text-dark-secondary"
                        size="sm"
                        ml={2}
                      >
                        {member.username}
                      </Text>
                    </div>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => removeMember(member.id)}
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
