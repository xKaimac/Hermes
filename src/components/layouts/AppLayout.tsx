import {AppLayoutProps} from '../../types/props/AppLayoutProps'
import ChatPage from '../chat/ChatPage';

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen">
      <ChatPage />
      {children}
    </div>
  );
};

export default AppLayout;
