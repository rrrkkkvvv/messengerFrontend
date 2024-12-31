import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import Avatar from "../../../shared/ui/Avatar/Avatar";

interface IUserProps {
  user: TUserInfo;
  onClick: () => void;
  isOnline: boolean;
}
const User = ({ user, onClick, isOnline }: IUserProps) => {
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
        picture={user.picture}
        isOnline={isOnline}
        isProfileAvatar={false}
      />
      <div className="">
        <div className="">{user.name}</div>
        {/* <div className="">Last message</div> */}
      </div>
    </div>
  );
};

export default User;
