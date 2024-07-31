import { IconType } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Button } from "@mantine/core";

type Provider = {
  name: string;
};

const AUTH_URL = import.meta.env.VITE_BACKEND_URL;

const LoginButton = ({ name }: Provider) => {
  const getIcon = (): IconType => {
    switch (name) {
      case "google":
        return FcGoogle;
      case "github":
        return FaGithub;
      case "discord":
        return FaDiscord;
      default:
        throw new Error(`Unsupported provider: ${name}`);
    }
  };

  const Icon = getIcon();

  return (
    <Button variant="subtle" color="rgba(0, 0, 0, 1)" leftSection={<Icon />}>
      <a href={`${AUTH_URL}/auth/${name}`}>Sign in with {name}</a>
    </Button>
  );
};

export default LoginButton;
