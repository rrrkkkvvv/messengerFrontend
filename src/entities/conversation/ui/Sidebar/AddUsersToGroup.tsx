import { useState } from "react";
import { useAppSelector } from "../../../../app/store/store";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";
import { selectContactsList } from "../../../user/model";
import toast from "react-hot-toast";
import { toastTexts } from "../../../../shared/values/strValues";
import Avatar from "../../../../shared/ui/Avatar/Avatar";
import { useAddUsersToConversationMutation } from "../../api/conversationApi";

interface IAddUsersToGroupProps {
  conversationId: string | null;
  members: TUserInfo[] | null;
}
const AddUsersToGroup: React.FC<IAddUsersToGroupProps> = ({
  conversationId,
  members,
}) => {
  const contactsList = useAppSelector(selectContactsList);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [addUsersToConversation] = useAddUsersToConversationMutation();
  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const handleAdd = async () => {
    if (!conversationId || !selectedUsers.length) return;
    try {
      await addUsersToConversation({
        conversationId,
        selectedUsers,
      }).unwrap();

      toast.success(toastTexts.success.successAddUsersToConversation);
    } catch (err) {
      toast.error(toastTexts.error.errorAddUsersToConversation);
    }
  };
  if (!contactsList || !members) return;
  const nonMembers = contactsList.filter(
    (contact) =>
      !members.some(
        (member) => member._id === contact._id || contact.type === "group"
      )
  );
  return (
    <>
      <div className="flex justify-center text-xl text-green-300 ">
        {selectedUsers.length ? (
          <button
            onClick={handleAdd}
            className="text-green-400   py-1 w-1/3 text-lg  rounded-full border border-gray-100 outline-none    transition   hover:border-green-200"
          >
            Save
          </button>
        ) : (
          <h1>Select any users</h1>
        )}
      </div>
      {nonMembers?.map((user) => {
        return (
          <div
            key={user._id}
            onClick={() => toggleUser(user._id)}
            className="flex justify-between items-center gap-10 rounded-lg duration-300 cursor-pointer hover:bg-gray-100 px-9 py-1 max-h-96   overflow-hidden   "
          >
            <Avatar
              isProfileAvatar={false}
              isGroup={false}
              picture={user.avatarURL}
              isUserSelectedForGroup={selectedUsers.includes(user._id)}
              hideOnline
            />
            <p className="max-w-32 truncate">{user.name}</p>
          </div>
        );
      })}
    </>
  );
};

export default AddUsersToGroup;
