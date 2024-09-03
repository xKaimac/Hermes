import { jsx as _jsx } from "react/jsx-runtime";
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
const LoginButton = ({ name }) => {
    const getAuthURL = () => {
        const AUTH_URL = import.meta.env.VITE_BACKEND_URL;
        return `${AUTH_URL}/auth/${name}`;
    };
    const getIcon = () => {
        switch (name) {
            case 'google':
                return { icon: FcGoogle, color: 'default}' };
            case 'github':
                return { icon: FaGithub, color: 'black' };
            case 'discord':
                return { icon: FaDiscord, color: 'rgba(88, 101, 242, 1)' };
            default:
                throw new Error(`Unsupported provider: ${name}`);
        }
    };
    const Icon = getIcon().icon;
    const color = getIcon().color;
    return (_jsx("a", { className: "flex justify-center", href: getAuthURL(), children: _jsx(Icon, { color: color, size: "50%" }) }));
};
export default LoginButton;
