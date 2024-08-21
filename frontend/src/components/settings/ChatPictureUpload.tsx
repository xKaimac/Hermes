import { Button, Avatar } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";

interface UploadData {
  file: File;
  chatId: string;
}

interface ChatPictureUploadParams {
  isAdmin: boolean;
  chatId: string;
  chatPicture: string;
}

const uploadChatPicture = async ({ file, chatId }: UploadData) => {
  const formData = new FormData();
  formData.append("profilePicture", file);
  formData.append("chatId", chatId);
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/chats/upload-chat-picture`,
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

const ChatPictureUpload = ({
  isAdmin,
  chatId,
  chatPicture,
}: ChatPictureUploadParams) => {
  const [currentPicture, setCurrentPicture] = useState(chatPicture);

  useEffect(() => {
    setCurrentPicture(chatPicture);
  }, [chatPicture]);

  const mutation = useMutation({
    mutationFn: uploadChatPicture,
    onSuccess: (data) => {
      setCurrentPicture(data.chatPicture);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      mutation.mutate({ file, chatId });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-5">
      <Avatar className="size-[20vh]" src={currentPicture} />
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        id="chat-picture-input"
      />
      {isAdmin && (
        <div className="pt-5">
          <label htmlFor="chat-picture-input">
            <Button
              component="span"
              className="bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-text-dark-primary"
              loading={mutation.isPending}
            >
              {mutation.isPending ? "Uploading..." : "Change Chat Picture"}
            </Button>
          </label>
        </div>
      )}
      {mutation.isError && (
        <p className="text-red-500 mt-2">
          Upload failed. Please try again. Error: {mutation.error?.message}
        </p>
      )}
    </div>
  );
};

export default ChatPictureUpload;
