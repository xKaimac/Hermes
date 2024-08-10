import { useState } from "react";
import { FaPlus, FaUserFriends } from "react-icons/fa";
import { Popover, TextInput } from "@mantine/core";
import { useUser } from "../../utils/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddFriendParams {
  friendName: string;
  userId: string;
}

const addFriend = async ({
  friendName,
  userId,
}: AddFriendParams): Promise<any> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/add-friend`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendName, userId }),
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Sorry, we can't find that user");
  }
  return response.json();
};

const AddFriend = () => {
  const [opened, setOpened] = useState(false);
  const [friendName, setFriendName] = useState("");
  const { userData } = useUser();
  const queryClient = useQueryClient();

  const mutation = useMutation<any, Error, AddFriendParams>({
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
    mutation.mutate({ friendName, userId: userData.user.id });
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
