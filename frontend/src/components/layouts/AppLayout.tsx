import ChatMenu from "../navigation/chat-menu/ChatMenu";

type AppLayoutProps = {
  children: JSX.Element;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen">
      <ChatMenu />
      {children}
    </div>
  );
};

export default AppLayout;
