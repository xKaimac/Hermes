import { IconType } from 'react-icons';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord, FaGithub } from 'react-icons/fa';

type Provider = {
  name: string;
};

const LoginButton = ({ name }: Provider) => {
  const getAuthURL = (): string => {
    const AUTH_URL = import.meta.env.VITE_BACKEND_URL;

    return `${AUTH_URL}/auth/${name}`;
  };

  const getIcon = (): { icon: IconType; color: string } => {
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

  return (
    <a className="flex justify-center" href={getAuthURL()}>
      <Icon color={color} size="50%" />
    </a>
  );
};

export default LoginButton;
