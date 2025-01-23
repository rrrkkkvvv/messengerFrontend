import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { useDeleteUserMutation } from "../../../entities/user/api/usersApi";
import { logout } from "../../../entities/user";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/store/store";
import Input from "../../../shared/ui/Input/Input";
import toast from "react-hot-toast";

type TSettingsProfileProps = {
  currentUser: TUserInfo | null;
};

const SettingsProfile = ({ currentUser }: TSettingsProfileProps) => {
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [confirmUserEmailText, setConfirmUserEmailText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    setConfirmUserEmailText(e.currentTarget.value);
  };
  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    if (confirmUserEmailText !== currentUser.email) {
      toast.error("You should enter correct email");
      return;
    }
    try {
      await deleteUser({ userId: currentUser.id }).unwrap();
      logout(navigate, dispatch);
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
    setConfirmUserEmailText("");
    setIsModalOpen(false);
  };

  return (
    <>
      <Avatar
        isProfileAvatar={true}
        picture={currentUser?.picture}
        className="h-24 w-24 md:h-20 md:w-20"
      />

      <span className="text-3xl md:text-2xl">{currentUser?.name}</span>

      <div
        className="flex items-center h-12 px-2 text-center text-2xl gap-2 outline-none transition-all rounded-2xl cursor-pointer hover:outline-green-500"
        onClick={() => setIsModalOpen(true)}
      >
        <div>Delete account</div>
        <MdDelete className="text-green-400 mt-1 text-2xl rounded-full outline-none" />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 text-white bg-gray-300 bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-200 p-6 rounded-lg shadow-md w-96 animate-scaleIn">
            <h2 className="text-lg font-bold  mb-4">
              Are you sure you want to delete your account?
            </h2>
            <p className=" mb-6">This action cannot be undone.</p>
            <div className="pb-10">
              <h2 className="">Confirm user email</h2>

              <Input
                type="email"
                onClick={() => {}}
                onChange={handleUserEmailChange}
                placeholder="Input your email..."
                value={confirmUserEmailText ? confirmUserEmailText : ""}
                className="w-full h-11  rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-50 transition-all text-gray-300 rounded-lg hover:bg-gray-100 hover:text-white"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2  transition-all bg-green-200 text-white rounded-lg hover:bg-green-150"
                onClick={() => {
                  handleDeleteAccount();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsProfile;
