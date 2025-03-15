import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import { FaFileImage } from "react-icons/fa6";
import { formatLastMessageDate } from "../../../shared/utils/formatLastMessageDate";

interface IUserProps {
  user: TUserInfo;
  currentUserId: string | null;
  onClick: () => void;
  isOnline: boolean;
}
const User = ({ user, onClick, isOnline, currentUserId }: IUserProps) => {
  return (
    <div
      onClick={onClick}
      className="
                    w-full
                    relative
                    flex
                    items-center
                    space-x-3
                    hover:bg-green-200
                    hover:text-black
                    rounded-lg
                    transition
                    cursor-pointer
                    border-b-2
                    border-green-200
                    p-2"
    >
      <Avatar
        picture={user.avatarURL}
        isOnline={isOnline}
        isProfileAvatar={false}
      />
      <div>
        <div>{user.name}</div>
        <div className="flex gap-2">
          {user.lastMessage?.senderId === currentUserId && <>You:</>}

          {!user.lastMessage?.messageImage && user.lastMessage?.messageText ? (
            <div>{user.lastMessage.messageText}</div>
          ) : user.lastMessage?.messageImage &&
            !user.lastMessage?.messageText ? (
            <div className="flex justify-center items-center gap-2">
              <FaFileImage /> image
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="absolute right-5 bottom-2">
        {user.lastMessage?.sentAt && (
          <>{formatLastMessageDate(user.lastMessage?.sentAt)}</>
        )}
      </div>
    </div>
  );
};

export default User;
