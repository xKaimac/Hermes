import "./chat-menu/customScrollbar.css";
import { CgProfile } from "react-icons/cg";

const ChatMenu = () => {
  const chatItems = Array.from({ length: 40 }, (_, index) => ({
    id: index,
    name: `Chat with a very long name ${index + 1}`,
    preview: `This is a long message preview that will be truncated ${index + 1}`,
  }));

  return (
    <div className="flex flex-col w-1/4 bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl m-5 p-5 overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl">Chats</h1>
        <a className="text-3xl">+</a>
      </div>
      <input className="mt-2 mb-2 p-2" type="text" placeholder="Search" />
      <ul className="flex-grow overflow-y-auto">
        {chatItems.map((chat) => (
          <li key={chat.id} className="flex flex-row mt-2 mb-2">
            <CgProfile size="75" />
            <div className="pl-2 overflow-hidden mt-auto mb-auto">
              <a className="block truncate">{chat.name}</a>
              <p className="truncate text-sm text-gray-500">{chat.preview}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t mt-auto pt-2">
        <CgProfile size="75" />
      </div>
    </div>
  );
};

export default ChatMenu;
