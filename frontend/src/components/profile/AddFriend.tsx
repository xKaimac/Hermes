import { Popover, TextInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus, FaUserFriends } from "react-icons/fa";

import { useUser } from "../../utils/UserContext";

interface AddFriendParams {
  friendName: string;
  user_id: string;
}

const addFriend = async ({
  friendName,
  user_id,
}: AddFriendParams): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/friends/add-friend`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendName, user_id }),
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("Sorry, we can't find that user");
};

const AddFriend = () => {
  const [opened, setOpened] = useState(false);
  const [friendName, setFriendName] = useState("");
  const { userData } = useUser();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends", userData.user.id],
      });
      setFriendName("");
      setOpened(false);
    },
  });

  const handleSendRequest = (event: React.FormEvent) => {
    event.preventDefault();
    if (!friendName.trim()) return;
    mutation.mutate({ friendName, user_id: userData.user.id });
  };

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      withArrow
      shadow="md"
      radius="lg"
    >
      <Popover.Target>
        <button
          className="flex flex-row mr-2"
          onClick={() => setOpened((open: boolean) => !open)}
        >
          <FaUserFriends size={"1.25rem"} />
          <FaPlus size={"0.75rem"} />
        </button>
      </Popover.Target>
      <Popover.Dropdown>
        <form onSubmit={handleSendRequest} className="p-2">
          <h2 className="text-lg font-semibold mb-2">Add Friend</h2>
          <TextInput
            placeholder="Enter friend's username"
            value={friendName}
            onChange={(event) => setFriendName(event.currentTarget.value)}
            className="mb-2"
            disabled={mutation.isPending}
          />
          {mutation.isError && (
            <p className="text-red-500 mt-2 text-sm">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "An error occurred"}
            </p>
          )}
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};

export default AddFriend;
