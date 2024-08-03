import ThemeToggle from "../../utils/theme-toggle.util";

const Settings = () => {
  return (
    <div
      className={`flex flex-col w-1/4 bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl mt-5 mr-5 p-5`}
    >
      <h1 className="text-3xl">Settings Menu</h1>
      <ThemeToggle />
    </div>
  );
};

export default Settings;
