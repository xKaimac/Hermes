import { Button, Textarea } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { ChatNameUploadData } from "../../types/ChatNameUploadData";
import { UpdateChatNameProps } from "../../types/props/UpdateChatNameProps";

const UpdateChatName = ({
  chat_id,
  chat_name,
  isAdmin,
}: UpdateChatNameProps) => {
  const [currentChatName, setCurrentChatName] = useState(chat_name);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCurrentChatName(chat_name);
  }, [chat_name]);

  const updateChatName = async ({ chat_id }: ChatNameUploadData) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chats/update-chat-name`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat_name: currentChatName, chat_id }),
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Upload failed");
  };

  const mutation = useMutation({
    mutationFn: updateChatName,
  });

  const handleClick = (event?: React.MouseEvent) => {
    event?.preventDefault();
    setIsEditing(false);
    mutation.mutate({ chat_name, chat_id: chat_id });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentChatName(event.target.value);
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
        className="p-2 text-background-light dark:text-surface-dark w-10 h-10 flex items-center justify-center"
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
              {currentChatName}
            </p>
          </div>
          {isAdmin && (
            <Button
              variant="transparent"
              onClick={() => setIsEditing(true)}
              className="text-text-light-primary dark:text-text-light-secondary w-1/2"
            >
              <MdEdit size={"1vw"} />
            </Button>
          )}
        </>
      ) : (
        <div className="w-3/4 lg:w-1/2 xl:w-1/3 pt-5">
          <Textarea
            radius="xl"
            maxLength={255}
            autosize
            minRows={1}
            maxRows={8}
            value={currentChatName}
            rightSection={<EnterComponent />}
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      )}
    </>
  );
};

export default UpdateChatName;
