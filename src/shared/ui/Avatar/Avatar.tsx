import { TUserInfo } from "../../../entities/user";

interface AvatarProps {
  user?: TUserInfo | null;
  className?: string;
}
const Avatar = ({ user, className }: AvatarProps) => {
  return (
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

        ${className}
        `}
      src={
        // if user exists checking his picture else using placeholder
        user
          ? user.picture
            ? user.picture
            : "/public/icons/placeholder.jpg"
          : "/public/icons/placeholder.jpg"
      }
      // src={"/public/icons/placeholder.jpg"}
      alt="avatar"
    />
  );
};

export default Avatar;
