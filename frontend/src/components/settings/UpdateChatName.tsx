import { useState, useEffect } from "react";
import { Button, Textarea } from "@mantine/core";
import { FaArrowCircleRight } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { MdEdit } from "react-icons/md";

interface UploadData {
  chatName: string;
  chatId: string;
}

interface UpdateChatNameParams {
  chatId: string;
  chatName: string;
  isAdmin: boolean;
}

const UpdateChatName = ({
  chatId,
  chatName,
  isAdmin,
}: UpdateChatNameParams) => {
  const [currentChatName, setCurrentChatName] = useState(chatName);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCurrentChatName(chatName);
  }, [chatName]);

  const updateChatName = async ({ chatName, chatId }: UploadData) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/protected/chat/update-chat-name`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatName, chatId }),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Upload failed");
    }
    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateChatName,
    onSuccess: (data) => {
      setCurrentChatName(data.chatName);
    },
  });

  const handleClick = (e?: any) => {
    e?.preventDefault();
    setIsEditing(false);
    mutation.mutate({ chatName, chatId: chatId });
  };

  const handleOnChange = (event: any) => {
    setCurrentChatName(event.target.value);
  };

  const handleKeyPress = (event: any) => {
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
