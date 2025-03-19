interface AvatarProps {
  picture: string | null | undefined;
  isProfileAvatar: boolean;
  isOnline?: boolean;
}
const Avatar = ({ picture, isOnline, isProfileAvatar }: AvatarProps) => {
  return (
    <div>
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
