import { ChatMember } from '../../../shared/types/ChatMember';
import { ChatValues } from '../../../shared/types/ChatValues';

export interface SettingsProps {
  selectedChat: ChatValues | null;
  members: Array<ChatMember>;
}
