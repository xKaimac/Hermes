import { Message } from "../../../../shared/types/Message"
import { User } from "../../../../shared/types/User"

interface MessageBubbleProps {
  message: Message
  user_info: User;
  sender_info: User
}

const MessageBubble = ({ user_info, sender_info, message }: MessageBubbleProps) => {
  const isUser = user_info.id === message.sender_id;
  const info = isUser ? user_info : sender_info;

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {isUser && (
        <button
        id="dropdownMenuIconButton"
        data-dropdown-toggle="dropdownDots"
        data-dropdown-placement="bottom-start"
        className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-text-light-primary bg-surface-light rounded-lg hover:bg-background-light focus:ring-4 focus:outline-none dark:text-text-dark-primary dark:bg-surface-dark dark:hover:bg-background-dark focus:ring-primary-light dark:focus:ring-primary-dark"
        type="button"
        >
        <svg className="w-4 h-4 text-text-light-secondary dark:text-text-dark-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
        </svg>
        </button>
      )}
      {!isUser && (
        <img className="w-8 h-8 rounded-full" src={info.profile_picture} alt="Profile image" />
      )}
      <div className={`flex flex-col gap-1 max-w-[50vw] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">{info.username}</span>
        </div>
        <div className={`flex flex-col leading-1.5 p-4 ${
          isUser 
            ? 'bg-primary text-text-dark-primary rounded-s-xl rounded-ee-xl' 
            : 'bg-surface-light dark:bg-surface-dark rounded-e-xl rounded-es-xl'
        }`}>
          <p className={`text-sm font-normal ${
            isUser ? 'text-text-dark-primary' : 'text-text-light-primary dark:text-text-dark-primary'
          }`}>
            {message.content}
          </p>
        </div>
        <span className="text-sm font-normal text-text-light-secondary dark:text-text-dark-secondary">Delivered</span>
      </div>
      {isUser && (
        <img className="w-8 h-8 rounded-full" src={info.profile_picture} alt="Profile image" />
      )}
      {!isUser && (
        <button
        id="dropdownMenuIconButton"
        data-dropdown-toggle="dropdownDots"
        data-dropdown-placement="bottom-start"
        className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-text-light-primary bg-surface-light rounded-lg hover:bg-background-light focus:ring-4 focus:outline-none dark:text-text-dark-primary dark:bg-surface-dark dark:hover:bg-background-dark focus:ring-primary-light dark:focus:ring-primary-dark"
        type="button"
        >
        <svg className="w-4 h-4 text-text-light-secondary dark:text-text-dark-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
        </svg>
        </button>
      )}
      <div id="dropdownDots" className="z-10 hidden bg-surface-light divide-y divide-background-light rounded-lg shadow w-40 dark:bg-surface-dark dark:divide-background-dark">
        <ul className="py-2 text-sm text-text-light-primary dark:text-text-dark-primary" aria-labelledby="dropdownMenuIconButton">
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-background-light dark:hover:bg-background-dark dark:hover:text-text-dark-primary">Reply</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-background-light dark:hover:bg-background-dark dark:hover:text-text-dark-primary">Forward</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-background-light dark:hover:bg-background-dark dark:hover:text-text-dark-primary">Copy</a>
          </li>
        </ul>
      </div>
    </div>  );
};

export default MessageBubble;
