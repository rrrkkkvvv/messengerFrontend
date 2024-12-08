import { TUserInfo } from "../../../entities/user";

interface AvatarProps {
  picture: string | null | undefined;
  className?: string;
}
const Avatar = ({ picture, className }: AvatarProps) => {
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
        // if picture exists use it, else using placeholder
        picture ? picture : "/public/icons/placeholder.jpg"
      }
      alt="avatar"
    />
  );
};

export default Avatar;
