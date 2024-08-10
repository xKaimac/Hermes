import { useUser } from "../../utils/UserContext";
import { Avatar, ScrollArea, TextInput } from "@mantine/core";
import ChatCreation from "./chat-menu/ChatCreation";

const ChatMenu = () => {
  const { userData, isLoading } = useUser();

  const chatItems = Array.from({ length: 40 }, (_, index) => ({
    id: index,
    name: `Chat with a very long name ${index + 1}`,
    preview: `This is a long message preview that will be truncated ${index + 1}`,
  }));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userData || !userData.isAuthenticated) {
    return <div>Please log in to view chats</div>;
  }

  return (
    <>
      <div className="flex flex-col w-1/4 bg-background-light dark:bg-background-dark h-[calc(100vh-2.5rem)] rounded-xl m-5 p-5 overflow-hidden">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl text-text-light-primary dark:text-text-dark-primary">
            Chats
          </h1>
          <ChatCreation />
        </div>
        <TextInput
          className="mt-2 mb-2 pt-1"
          radius="xl"
          type="text"
          placeholder="Search"
        />
        <ScrollArea>
          <ul>
            {chatItems.map((chat) => (
              <li key={chat.id} className="flex flex-row mt-2 mb-2">
                <Avatar radius="xl" size="lg" />
                <div className="pl-2 overflow-hidden mt-auto mb-auto">
                  <a className="block truncate">{chat.name}</a>
                  <p className="truncate text-sm text-gray-500">
                    {chat.preview}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="border-t mt-auto pt-2">
          <a href="profile">
            <Avatar size="lg" src={userData.user.profile_picture} />
          </a>
        </div>
      </div>
    </>
  );
};

export default ChatMenu;
