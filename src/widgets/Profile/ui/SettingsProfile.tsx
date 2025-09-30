import { FormEvent, useState } from "react";
import { MdDelete } from "react-icons/md";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { useDeleteUserMutation } from "../../../entities/contact/api/contactApi";
import { logout } from "../../../entities/contact";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/store/store";
import Input from "../../../shared/ui/Input/Input";
import toast from "react-hot-toast";
import SolidButton from "../../../shared/ui/Button/SolidButton";

type TSettingsProfileProps = {
  currentUser: TUserInfo | null;
};

const SettingsProfile = ({ currentUser }: TSettingsProfileProps) => {
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [confirmUserEmailText, setConfirmUserEmailText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserEmailChange = (e: FormEvent<HTMLInputElement>) => {
    setConfirmUserEmailText(e.currentTarget.value);
  };
  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    if (confirmUserEmailText !== currentUser.email) {
      toast.error("You should enter email correctly");
      return;
    }
    try {
      await deleteUser().unwrap();
      logout(navigate, dispatch);
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
    setConfirmUserEmailText("");
    setIsModalOpen(false);
  };

  return (
    <>
      <SolidButton
        onClick={() => setIsModalOpen(true)}
        className=" bg-gray-50 text-gray-400 font-bold flex flex-row justify-center items-center text-center"
      >
        <div>Delete account</div>
        <MdDelete className="text-gray-400 mt-1 text-2xl rounded-full outline-none" />
      </SolidButton>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 text-gray-50 bg-gray-400 bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-200 p-6 rounded-lg shadow-md w-96 animate-scaleIn">
            <h2 className="text-lg font-bold  mb-4">
              Are you sure you want to delete your account?
            </h2>
            <p className=" mb-6">This action cannot be undone.</p>
            <div className="pb-10">
              <h2>Confirm user email: {currentUser?.email}</h2>

              <Input
                type="email"
                onClick={() => {}}
                onChange={handleUserEmailChange}
                placeholder="Input your email..."
                value={confirmUserEmailText ? confirmUserEmailText : ""}
                className="w-full h-11   mt-3"
              />
            </div>
            <div className="flex justify-end gap-4">
              <SolidButton
                className="px-4 py-2 bg-gray-50 transition-all text-gray-300 rounded-lg "
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </SolidButton>
              <SolidButton
                className="px-4 py-2  hover:bg-gray-400 hover:text-gray-50  "
                onClick={() => {
                  handleDeleteAccount();
                }}
              >
                Delete
              </SolidButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsProfile;
