import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import { FaCircle, FaFileImage } from "react-icons/fa6";
import { formatLastMessageDate } from "../../../shared/utils/formatLastMessageDate";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";

interface IUserProps {
  user: TUserInfo;
  currentUserId: string | null;
  onClick: () => void;
  isOnline: boolean;
  isUserSelectedForGroup: boolean;
}
const User = ({
  user,
  onClick,
  isOnline,
  currentUserId,
  isUserSelectedForGroup,
}: IUserProps) => {
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
        isUserSelectedForGroup={isUserSelectedForGroup}
      />
      <div>
        <div>{user.name}</div>
        <div className="flex gap-5">
          <div className="flex gap-2 relative">
            {user.isTyping ? (
              <div className="text-green-150 select-none  flex items-center  ">
                <span className="text-lg">is typing</span>
                <div className="flex gap-0.5  pt-4">
                  <FaCircle className="h-1 w-1 duration-100 animate-bounce" />
                  <FaCircle className="h-1 w-1 duration-200 animate-bounce" />
                  <FaCircle className="h-1  w-1 duration-300 animate-bounce" />
                </div>
              </div>
            ) : (
              <>
                {user.lastMessage?.senderId === currentUserId && <>You:</>}
                {
                  // {/* IF NO IMAGE BUT TEXT */}
                  !user.lastMessage?.messageImage &&
                  user.lastMessage?.messageText ? (
                    <div className="max-w-40 truncate">
                      {user.lastMessage.messageText}
                    </div>
                  ) : // IF NO TEXT BUT IMAGE
                  user.lastMessage?.messageImage &&
                    !user.lastMessage?.messageText ? (
                    <div className="flex justify-center items-center gap-2">
                      <FaFileImage />
                    </div>
                  ) : // IF  TEXT AND IMAGE
                  user.lastMessage?.messageImage &&
                    user.lastMessage?.messageText ? (
                    <>
                      <div className="max-w-20 truncate">
                        {user.lastMessage?.messageText}
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <FaFileImage />
                      </div>
                    </>
                  ) : (
                    // NO TEXT AND NO IMAGE
                    <></>
                  )
                }
              </>
            )}
          </div>

          {!user.isTyping &&
            user.lastMessage?.senderId === currentUserId &&
            (user.lastMessage?.seenStatus ? (
              <IoCheckmarkDoneOutline className="text-xl" />
            ) : (
              <IoCheckmarkOutline className="text-xl" />
            ))}
        </div>
      </div>

      <div className="absolute right-5 top-2">
        {user.lastMessage?.sentAt && (
          <>{formatLastMessageDate(user.lastMessage?.sentAt)}</>
        )}
      </div>
    </div>
  );
};

export default User;
