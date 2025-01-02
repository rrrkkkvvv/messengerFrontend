import Avatar from "../../../shared/ui/Avatar/Avatar";
import { IoCloseOutline } from "react-icons/io5";
import { useDeleteConversationMutation } from "../api/";
import { toastTexts } from "../../../shared/values/strValues";
import toast from "react-hot-toast";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";

interface ISidebarMenuProps {
  anotherUser?: TUserInfo | null;
  isSidebarMenuVisible: boolean;
  closeSidebarMenu: () => void;
  conversationId: number | null;
  isAnotherUserOnline: boolean;
}
const SidebarMenu = ({
  conversationId,
  anotherUser,
  closeSidebarMenu,
  isSidebarMenuVisible,
  isAnotherUserOnline,
}: ISidebarMenuProps) => {
  const [deleteConversation] = useDeleteConversationMutation();

  const handleDeleteConversation = async () => {
    if (conversationId) {
      const toastId = toast.loading("Loading...");
      const deleteConversationData = { conversationId: conversationId };
      try {
        await deleteConversation(deleteConversationData).unwrap();

        toast.success(toastTexts.success.successConversationDelete);
      } catch (error) {
        toast.success(toastTexts.success.successConversationDelete);
        console.error("Failed to send message:", error);
      }
      toast.dismiss(toastId);
    }
  };

  return (
    <div
      className={`absolute right-5 top-5 rounded-xl h-2/6 w-1/2 md:w-1/3 transition-all duration-300 bg-gray-300 border border-gray-100 z-30 flex justify-center items-center 
        ${
          isSidebarMenuVisible
            ? "opacity-100 scale-100 translate-0 "
            : "opacity-0 scale-50  -translate-y-1/2 translate-x-1/2"
        } 
        ${isSidebarMenuVisible ? "visible" : "invisible delay-300"}`}
    >
      <button
        onClick={closeSidebarMenu}
        className="absolute right-5 top-5 text-4xl  rounded-full border    transition   text-green-400  hover:border-green-200"
      >
        <IoCloseOutline />
      </button>

      <div className="flex gap-4 justify-center items-center flex-col">
        <h1>
          <Avatar
            picture={anotherUser?.picture}
            isOnline={isAnotherUserOnline}
            isProfileAvatar={false}
          />
        </h1>
        <h1>{anotherUser?.name}</h1>
        <h1>{anotherUser?.email}</h1>
        <h1>
          <button
            onClick={handleDeleteConversation}
            className="text-green-400 mx-2 p-2 rounded-full border border-gray-100 outline-none    transition   hover:border-green-200"
          >
            Remove chat
          </button>
        </h1>
      </div>
    </div>
  );
};
export default SidebarMenu;
