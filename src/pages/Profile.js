import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FiLogOut } from 'react-icons/fi';
import FriendsList from '../components/profile/FriendsList';
import ProfilePictureUpload from '../components/profile/ProfilePictureUpload';
import StatusText from '../components/profile/StatusText';
import { useUser } from '../utils/UserContext';
const Profile = () => {
    const { userData, isLoading, error } = useUser();
    const logout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/user/logout`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok)
                throw new Error('Failed to logout');
            window.location.href = `/login`;
        }
        catch (error) {
            console.error('Logout error:', error);
        }
    };
    if (isLoading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (error) {
        return _jsxs("div", { children: ["Error: ", error.message] });
    }
    if (!userData || !userData.user) {
        return _jsx("div", { children: "User data not available. Please try logging in again." });
    }
    return (_jsxs("div", { className: "flex flex-col w-full h-[calc(100vh-2.5rem)] bg-background-light dark:bg-background-dark rounded-xl mb-5 mt-5 mr-5 p-5 overflow-hidden transition-all duration-300", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h1", { className: "text-3xl text-text-light-primary dark:text-text-dark-primary", children: userData.user.username }), _jsx("button", { onClick: logout, children: _jsx(FiLogOut, { size: "2rem" }) })] }), _jsxs("div", { className: "flex flex-col items-center justify-center pb-5", children: [_jsx(ProfilePictureUpload, {}), _jsx(StatusText, {})] }), _jsx("div", { className: "flex-grow overflow-hidden", children: _jsx(FriendsList, {}) })] }));
};
export default Profile;
