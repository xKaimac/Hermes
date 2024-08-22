import ChatPage from '../chat/ChatPage';

type AppLayoutProps = {
  children: JSX.Element;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen">
      <ChatPage />
      {children}
    </div>
  );
};

export default AppLayout;
