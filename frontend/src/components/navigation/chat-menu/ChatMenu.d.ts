import { ChatValues } from "../../../../../shared/types/ChatValues";
interface ChatMenuProps {
    onChatSelect: (chat: ChatValues) => void;
    onProfileClick: () => void;
}
declare const ChatMenu: ({ onChatSelect, onProfileClick }: ChatMenuProps) => JSX.Element;
export default ChatMenu;
