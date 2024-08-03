import { useUser } from "../utils/UserContext";
import { Avatar, Button, Textarea, TextInput } from "@mantine/core";
import ProfilePictureUpload from "../components/profile/ProfilePictureUpload";

const Profile = () => {
  const { userData, isLoading, error } = useUser();

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Handle case where userData is undefined or user is not authenticated
  if (!userData || !userData.isAuthenticated) {
    return <div>Please log in to view chats</div>;
  }

  return (
    <div className="flex w-full">
      <div
        className={`flex flex-col w-full bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl mb-5 mt-5 mr-5 p-5 overflow-hidden transition-all duration-300`}
      >
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl">Profile</h1>
        </div>
        <div className="flex flex-col items-center justify-center pt-5">
          <ProfilePictureUpload
            currentPicture={userData.user.profile_picture}
            userEmail={userData.user.email}
          />
          <div className="w-1/2 pt-5">
            <Textarea
              radius="xl"
              maxLength={255}
              autosize
              minRows={1}
              maxRows={8}
              defaultValue={userData.user.status_text}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
