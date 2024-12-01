import { TUserInfo } from "../../user";
import { TMessageInfo } from "../api/conversationTypes";

interface IMessageListProps {
  conversationMessages: TMessageInfo[];
  currentUser: TUserInfo;
}

const MessageList = ({
  conversationMessages,
  currentUser,
}: IMessageListProps) => {
  return (
    <>
      {conversationMessages.map((message) => (
        <div
          key={message.message_id}
          className={`w-full p-2 flex mb-10 relative ${
            message.sender_name === currentUser.name
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`h-max text-base md:text-lg rounded-md text-left p-3 flex flex-col text-white ${
              message.sender_name === currentUser.name
                ? "bg-green-700 border-green-700"
                : "bg-green-900 border-green-900"
            }`}
          >
            <span className="text-sm">
              {message.sender_name === currentUser.name
                ? "You"
                : message.sender_name}
            </span>

            <div>
              <span>{message.message_text && message.message_text}</span>

              {message.message_image && (
                <img className="max-w-52" src={message.message_image} />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MessageList;
