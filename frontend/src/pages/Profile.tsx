import { useUser } from "../utils/UserContext";
import { Avatar, Button, Textarea, TextInput } from "@mantine/core";
import ProfilePictureUpload from "../components/profile/ProfilePictureUpload";
import StatusText from "../components/profile/StatusText";

const Profile = () => {
  const { userData, isLoading, error } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
          <ProfilePictureUpload />
          <StatusText />
        </div>
      </div>
    </div>
  );
};

export default Profile;
