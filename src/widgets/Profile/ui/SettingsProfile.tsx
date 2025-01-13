import { MdDelete } from "react-icons/md";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { useDeleteUserMutation } from "../../../entities/user/api/usersApi";
import { logout } from "../../../entities/user";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/store/store";
type TSettingsProfileProps = {
  currentUser: TUserInfo | null;
};
const SettingsProfile = ({ currentUser }: TSettingsProfileProps) => {
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleDeleteAccount = async () => {
    if (confirm("Are you sure want to delete your account?")) {
      if (!currentUser) return;
      try {
        await deleteUser({ userId: currentUser.id }).unwrap();
        logout(navigate, dispatch);
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  };
  return (
    <>
      <Avatar
        isProfileAvatar={true}
        picture={currentUser?.picture}
        className="
     
            h-24
            w-24
            md:h-20
            md:w-20
            "
      />

      <span className=" text-3xl md:text-2xl">{currentUser?.name}</span>
      <div
        className="flex items-center h-12 px-2 text-center text-2xl gap-2  outline-none transition-all rounded-2xl cursor-pointer hover:outline-green-500"
        onClick={handleDeleteAccount}
      >
        <div>Delete account</div>

        <MdDelete className="text-green-400 mt-1 text-2xl rounded-full outline-none" />
      </div>
    </>
  );
};

export default SettingsProfile;
