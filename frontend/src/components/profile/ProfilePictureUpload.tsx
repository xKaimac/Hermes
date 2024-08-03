import { useState } from "react";
import { Button, Avatar } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../utils/UserContext";

interface UploadData {
  file: File;
  email: string;
}

const uploadProfilePicture = async ({ file, email }: UploadData) => {
  const formData = new FormData();
  formData.append("profilePicture", file);
  formData.append("email", email);

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/upload-profile-picture`,
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

const ProfilePictureUpload = () => {
  const { userData, updateUserData } = useUser();
  const [file, setFile] = useState(null);

  const userEmail = userData.user.email;
  const currentPicture = userData.user.profile_picture;

  const mutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (data) => {
      updateUserData({ profile_picture: data.result.secure_url });
    },
  });

  const handleFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      mutation.mutate({ file, email: userEmail });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-5">
      <Avatar size="xl" src={currentPicture} />
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        id="profile-picture-input"
      />
      {!file && (
        <div className="pt-5">
          <label htmlFor="profile-picture-input">
            <Button
              component="span"
              className="bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-text-dark-primary"
            >
              Select New Picture
            </Button>
          </label>
        </div>
      )}
      {file && (
        <Button
          onClick={handleUpload}
          loading={mutation.isPending}
          className="mt-3 bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-text-dark-primary"
        >
          Upload New Picture
        </Button>
      )}
      {mutation.isError && (
        <p className="text-red-500 mt-2">
          {" "}
          Upload failed. Please try again. Error: {mutation.error?.message}
        </p>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
