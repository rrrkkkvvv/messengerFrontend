import Avatar from "../../../shared/ui/Avatar/Avatar";
import { IoCloseOutline } from "react-icons/io5";
import { useDeleteConversationMutation } from "../api/";
import { toastTexts } from "../../../shared/values/strValues";
import toast from "react-hot-toast";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { useAppSelector } from "../../../app/store/store";
import { selectCurrentUser } from "../../user/model";

interface ISidebarMenuProps {
  anotherUser?: TUserInfo | null;
  isSidebarMenuVisible: boolean;
  closeSidebarMenu: () => void;
  conversationId: string | null;
  isAnotherUserOnline: boolean;
  members: TUserInfo[] | null;
  name: string | null;
  avatarURL: string | null;
  creatorId: string | null;
  usersOnlineEmails: string[] | null;
}
const SidebarMenu = ({
  conversationId,
  anotherUser,
  closeSidebarMenu,
  isSidebarMenuVisible,
  isAnotherUserOnline,
  avatarURL,
  creatorId,
  members,
  name,
  usersOnlineEmails,
}: ISidebarMenuProps) => {
  const [deleteConversation] = useDeleteConversationMutation();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleDeleteConversation = async () => {
    if (conversationId) {
      const toastId = toast.loading("Loading...");
      const deleteConversationData = { conversationId: conversationId };
      try {
        closeSidebarMenu();
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
      className={`absolute right-5 top-5 rounded-xl   w-2/3 md:w-2/4 p-5  transition-all duration-300 bg-gray-300 border border-gray-100 z-30 flex justify-center items-center 
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

      <div className="flex gap-2 justify-center items-center flex-col  ">
        <h1>
          <Avatar
            isGroup={!!creatorId}
            picture={avatarURL ? avatarURL : anotherUser?.avatarURL}
            isOnline={isAnotherUserOnline}
            isProfileAvatar={false}
          />
        </h1>
        <h1 className="text-lg sm:text-lg md:text-base lg:text-lg xl:text-xl">
          {name ? name : anotherUser?.name}
        </h1>
        <div className=" max-h-96 overflow-auto ">
          {creatorId &&
            members?.map((member) => (
              <div
                key={member._id}
                className="flex gap-10 rounded-lg items-center duration-300 cursor-pointer hover:bg-gray-100 px-9 py-1 max-h-96 overflow-auto "
              >
                <Avatar
                  isProfileAvatar={false}
                  isGroup={false}
                  picture={member.avatarURL}
                  isOnline={usersOnlineEmails?.includes(member.email)}
                />
                <p>{member.name}</p>
              </div>
            ))}
        </div>
        {!creatorId && (
          <h1 className="text-lg sm:text-lg md:text-base lg:text-lg xl:text-xl">
            {anotherUser?.email}
          </h1>
        )}
        <h1>
          <button
            onClick={
              currentUser?._id === creatorId
                ? handleDeleteConversation
                : () => {
                    // TODO:
                    console.log("leaveConversation");
                  }
            }
            className="text-green-400 mx-2 p-2 rounded-full border border-gray-100 outline-none    transition   hover:border-green-200"
          >
            {currentUser?._id === creatorId ? (
              <>Remove chat</>
            ) : (
              <>Leave chat</>
            )}
          </button>
        </h1>
      </div>
    </div>
  );
};
export default SidebarMenu;
