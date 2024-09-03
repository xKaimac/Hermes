import { FiLogOut } from 'react-icons/fi';

import FriendsList from '../components/profile/FriendsList';
import ProfilePictureUpload from '../components/profile/ProfilePictureUpload';
import StatusText from '../components/profile/StatusText';
import { useUser } from '../utils/UserContext';

const Profile = () => {
  const { userData, isLoading, error } = useUser();

  const logout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/protected/user/logout`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to logout');
      
      window.location.href = `/login`;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userData || !userData.user) {
    return <div>User data not available. Please try logging in again.</div>;
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-2.5rem)] bg-background-light dark:bg-background-dark rounded-xl mb-5 mt-5 mr-5 p-5 overflow-hidden transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl text-text-light-primary dark:text-text-dark-primary">
          {userData.user.username}
        </h1>
        <button onClick={logout}>
          <FiLogOut size="2rem" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center pb-5">
        <ProfilePictureUpload />
        <StatusText />
      </div>
      <div className="flex-grow overflow-hidden">
        <FriendsList />
      </div>
    </div>
  );
};

export default Profile;
