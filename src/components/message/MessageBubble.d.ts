import { Message } from "../../../shared/types/Message";
import { User } from "../../../shared/types/User";
interface MessageBubbleProps {
    message: Message;
    user_info: User;
    sender_info: User;
    onReply: (message: Message) => void;
    getRepliedMessage: (replyToId: number) => Message | undefined;
}
declare const MessageBubble: ({ message, user_info, sender_info, onReply, getRepliedMessage }: MessageBubbleProps) => JSX.Element;
export default MessageBubble;
