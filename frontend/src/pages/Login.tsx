import LoginButton from "../components/login/login.button";
import providers from "../components/login/providers";
import ThemeToggle from "../utils/theme-toggle.util";
import HermesLogo from "../components/login/hermes.log";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <HermesLogo />
      <div className="items-center bg-surface-light dark:bg-surface-dark p-8 rounded-lg shadow-lg w-4/5 md:w-1/2 transition-colors duration-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-text-light-primary dark:text-text-dark-primary">
          Sign up or log in
        </h1>
        <p className="mb-6 text-center text-text-light-secondary dark:text-text-dark-secondary">
          Choose a provider to get started
        </p>
        <div className="grid grid-cols-3 gap-0 items-center">
          {providers.map((entry: string) => (
            <LoginButton key={entry} name={entry} />
          ))}
        </div>
      </div>
      <div className="pt-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
