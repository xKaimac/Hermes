import { ChatMember } from '../../../../shared/types/ChatMember';

export interface CreateChatParams {
  chat_name: string;
  members: ChatMember[];
}
