const AUTH_URL = import.meta.env.VITE_BACKEND_URL;

type Provider = "google" | "github" | "facebook" | "discord";

interface SignInProps {
  provider: Provider;
}

const LoginButton = (props: SignInProps) => {
  const { provider } = props;

  const handleSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.location.href = `${AUTH_URL}/auth/signin/${provider}`;
  };

  return (
    <button onClick={handleSignIn}>
      Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
};

export default LoginButton;
