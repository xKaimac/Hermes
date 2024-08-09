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

  const updateStatusText = async ({ userStatus, userId }: UploadData) => {
    const formData = new FormData();
    formData.append("userStatus", userStatus);
    formData.append("userId", userId);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/update-status-text`,
      {
        method: "POST",
        body: formData,
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
      setUserStatus(data.result.status_text);
    },
  });

  const handleClick = () => {
    toggleTextArea();
    mutation.mutate({ userStatus, userId: userId });
  };

  const handleOnChange = (event: any) => {
    setUserStatus(event.target.value);
  };

  const EnterComponent = () => {
    return (
      <button onClick={handleClick}>
        <FaArrowCircleRight />
      </button>
    );
  };

  const toggleTextArea = () => {
    const textArea = document.getElementById("textArea");
    const statusText = document.getElementById("statusText");

    textArea!.style.display =
      textArea!.style.display === "block" ? "none" : "block";
    statusText!.style.display =
      statusText!.style.display === "none" ? "block" : "none";
  };

  return (
    <>
      <div
        id="statusText"
        className="flex flex-row w-3/4 lg:w-1/2 xl:w-1/3 pt-5 text-center"
      >
        <p>{userStatus}</p>
        <Button variant="transparent" onClick={toggleTextArea}>
          <MdEdit />
        </Button>
      </div>
      <div
        id="textArea"
        className="display-none w-3/4 lg:w-1/2 xl:w-1/3 pt-5 hidden"
      >
        <Textarea
          radius="xl"
          maxLength={255}
          autosize
          minRows={1}
          maxRows={8}
          value={userStatus}
          rightSection={<EnterComponent />}
          onChange={handleOnChange}
        />
      </div>
    </>
  );
};

export default StatusText;
