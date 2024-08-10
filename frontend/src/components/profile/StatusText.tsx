import { useState } from "react";
import { useUser } from "../../utils/UserContext";
import { Button, Textarea } from "@mantine/core";
import { FaArrowCircleRight } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { MdEdit } from "react-icons/md";

interface UploadData {
  userStatus: string;
  userId: string;
}

const StatusText = () => {
  const { userData, updateUserData } = useUser();
  const userId = userData.user.id;
  const [userStatus, setUserStatus] = useState(userData.user.status_text);
  const [isEditing, setIsEditing] = useState(false);

  const updateStatusText = async ({ userStatus, userId }: UploadData) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/update-status-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userStatus, userId }),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Upload failed");
    }
    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateStatusText,
    onSuccess: (data) => {
      updateUserData({ status_text: data.result.status_text });
    },
  });

  const handleClick = (e?: any) => {
    e?.preventDefault();
    setIsEditing(false);
    mutation.mutate({ userStatus, userId: userId });
  };

  const handleOnChange = (event: any) => {
    setUserStatus(event.target.value);
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
        className="p-2 text-surface-light dark:text-surface-dark"
      >
        <FaArrowCircleRight size={"2vw"} />
      </button>
    );
  };

  return (
    <>
      {!isEditing ? (
        <>
          <div className="flex flex-row w-3/4 lg:w-1/2 xl:w-1/3 pt-5 text-center items-center justify-center">
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              {userStatus}
            </p>
          </div>
          <Button
            variant="transparent"
            onClick={() => setIsEditing(true)}
            className="text-text-light-primary dark:text-text-light-secondary w-1/2"
          >
            <MdEdit size={"2vw"} />
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
            value={userStatus}
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
