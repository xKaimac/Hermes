import { Button, Avatar } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";

import { ProfilePictureUploadData } from "../../types/ProfilePictureUploadData";
import { useUser } from "../../utils/UserContext";


const uploadProfilePicture = async ({ file, user_id }: ProfilePictureUploadData) => {
  const formData = new FormData();

  formData.append("profile_picture", file);
  formData.append("user_id", user_id.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/protected/user/upload-profile-picture`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("Upload failed");

  return response.json();
};

const ProfilePictureUpload = () => {
  const { userData, updateUserData } = useUser();
  const user_id = userData.user.id;
  const currentPicture = userData.user.profile_picture;

  const mutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (data) => {
      updateUserData({ profile_picture: data.result.secure_url });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      mutation.mutate({ file, user_id });
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
        id="profile-picture-input"
      />
      <div className="pt-5">
        <label htmlFor="profile-picture-input">
          <Button
            component="span"
            className="bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-text-dark-primary"
            loading={mutation.isPending}
          >
            {mutation.isPending ? "Uploading..." : "Change Your Picture"}
          </Button>
        </label>
      </div>
      {mutation.isError && (
        <p className="text-red-500 mt-2">
          Upload failed. Please try again. Error: {mutation.error?.message}
        </p>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
