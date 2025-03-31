import { FaCheck } from "react-icons/fa6";

interface AvatarProps {
  picture: string | null | undefined;
  isProfileAvatar: boolean;
  isOnline?: boolean;
  isUserSelectedForGroup?: boolean;
}
const Avatar = ({
  picture,
  isOnline,
  isProfileAvatar,
  isUserSelectedForGroup,
}: AvatarProps) => {
  return (
    <div className="relative">
      {!isProfileAvatar && (
        <div
          className={`
            absolute
            rounded-full
            
            h-3
            w-3
            z-10
  
        ${isOnline ? "bg-green-400" : "bg-gray-100"}
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
            h-5
            w-5
            z-20
            bg-green-700
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
          border-2
        border-green-300  
          ${
            isProfileAvatar
              ? "h-20 w-20 md:h-24 md:w-24"
              : "h-9 w-9 md:h-11 md:w-11"
          } 
          `}
        src={
          // if picture exists use it, else using placeholder
          picture ? picture : "/icons/placeholder.jpg"
        }
        alt="avatar"
      />
    </div>
  );
};

export default Avatar;
