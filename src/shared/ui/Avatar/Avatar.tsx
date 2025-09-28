import { FaCheck } from "react-icons/fa6";

interface AvatarProps {
  picture: string | null | undefined;
  isProfileAvatar: boolean;
  isOnline?: boolean;
  isMobileCallAvatar?: boolean;
  isGroup?: boolean;
  hideOnline?: boolean;
  isMessageAvatar?: boolean;
  isUserSelectedForGroup?: boolean;
}
const Avatar = ({
  picture,
  isOnline,
  isGroup,
  isProfileAvatar,
  isMobileCallAvatar,
  isUserSelectedForGroup,
  hideOnline,
  isMessageAvatar,
}: AvatarProps) => {
  const avatarSize = () => {
    if (isMobileCallAvatar) {
      return "h-36 w-36 md:h-24 md:w-24";
    } else if (isProfileAvatar) {
      return "h-20 w-20 md:h-24 md:w-24";
    } else if (isMessageAvatar) {
      return "h-9 w-9";
    } else {
      return "h-9 w-9 md:h-11 md:w-11";
    }
  };
  return (
    <div className="relative">
      {!isGroup &&
        !isProfileAvatar &&
        !hideOnline &&
        !isMobileCallAvatar &&
        !isUserSelectedForGroup && (
          <div
            className={`
            absolute
            rounded-full
            
            h-3
            w-3
            z-10
  
        ${isOnline ? "bg-green-200" : "bg-gray-50"}
        `}
          ></div>
        )}
      {isUserSelectedForGroup && (
        <div
          className={`
            absolute
            rounded-full
            bottom-0
            right-0
            h-full
            w-full
            z-20
            bg-gray-400
            opacity-70
            flex
            items-center
            text-center
            justify-center
            text-white
            animate-fadeIn
        `}
        >
          <FaCheck />
        </div>
      )}
      <img
        className={`
     
          relative
          inline-block
          rounded-full
          overflow-hidden
            ${avatarSize()} 
          `}
        src={
          // if picture exists use it, else using placeholder
          picture
            ? picture
            : isGroup
            ? "/icons/groupChatPlaceholder.png"
            : "/icons/placeholder.jpg"
        }
        alt="avatar"
      />
    </div>
  );
};

export default Avatar;
