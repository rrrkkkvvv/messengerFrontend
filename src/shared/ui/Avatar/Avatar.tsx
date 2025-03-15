interface AvatarProps {
  picture: string | null | undefined;
  isProfileAvatar: boolean;
  className?: string;
  isOnline?: boolean;
}
const Avatar = ({
  picture,
  className,
  isOnline,
  isProfileAvatar,
}: AvatarProps) => {
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
          inlinte-block
          rounded-full
          overflow-hidden
          h-9
          w-9
          md:h-11
          md:w-11
          border-2
        border-green-300
          ${className}
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
