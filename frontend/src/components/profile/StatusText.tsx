import { Button, Textarea } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { StatusTextUploadData } from "../../types/StatusTextUploadData"
import { useUser } from "../../utils/UserContext";

const StatusText = () => {
  const { userData, updateUserData } = useUser();
  const user_id = userData.user.id;
  const [status_text, setUserStatus] = useState(userData.user.status_text);
  const [isEditing, setIsEditing] = useState(false);

  const updateStatusText = async ({ status_text, user_id }: StatusTextUploadData) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/user/update-status-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status_text, user_id }),
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Upload failed");

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateStatusText,
    onSuccess: (data) => {
      updateUserData({ status_text: data.result.status_text });
    },
  });

  const handleClick = (event?: React.MouseEvent) => {
    event?.preventDefault();
    setIsEditing(false);
    mutation.mutate({ status_text, user_id: user_id });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserStatus(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleClick();
    }
  };

  const EnterComponent = () => {
    return (
      <button
        onClick={handleClick}
        className="p-2 text-surface-light dark:text-surface-dark w-10 h-10 flex items-center justify-center"
      >
        <FaArrowCircleRight />
      </button>
    );
  };

  return (
    <>
      {!isEditing ? (
        <>
          <div className="flex flex-row w-3/4 lg:w-1/2 xl:w-1/3 pt-5 text-center items-center justify-center">
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              {status_text}
            </p>
          </div>
          <Button
            variant="transparent"
            onClick={() => setIsEditing(true)}
            className="text-text-light-primary dark:text-text-light-secondary w-1/2"
          >
            <MdEdit size={"1vw"} />
          </Button>
        </>
      ) : (
        <div className="w-3/4 lg:w-1/2 xl:w-1/3 pt-5">
          <Textarea
            radius="xl"
            maxLength={255}
            autosize
            minRows={1}
            maxRows={8}
            value={status_text}
            rightSection={<EnterComponent />}
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      )}
    </>
  );
};

export default StatusText;
