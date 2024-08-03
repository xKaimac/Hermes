import { useState } from "react";
import Settings from "../settings/Settings";

const Chat = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="flex w-full">
      <div
        className={`flex flex-col ${isSettingsOpen ? "w-3/4" : "w-full"} bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl mb-5 mt-5 mr-5 p-5 overflow-hidden transition-all duration-300`}
      >
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl">Chat Name</h1>
          <button onClick={toggleSettings} className="text-3xl">
            ...
          </button>
        </div>
        <div className="mt-auto pt-2"></div>
        <input className="mt-2 mb-2 p-2" type="text" placeholder="Search" />
      </div>
      {isSettingsOpen && <Settings />}
    </div>
  );
};

export default Chat;
