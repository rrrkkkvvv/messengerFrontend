import { FC, useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import TypingUser from "./TypingUser";
import { FaArrowLeft } from "react-icons/fa";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { resetCurrentConversation } from "../../../entities/conversation/";
import { useAppDispatch } from "../../../app/store/store";
import { useNavigate } from "react-router-dom";
import { BiSolidPhoneCall } from "react-icons/bi";
import { callUserThunk } from "../../../entities/call/";
import { defaultMediaState } from "../../../shared/values/mediaStateConfig";
import BorderedButton from "../../../shared/ui/Button/BorderedButton";
interface IConversationHeaderProps {
  conversationName: string | null;
  conversationId: string | null;
  conversationAvatarURL: string | null;
  anotherUser: TUserInfo | null | undefined;
  isAnotherUserOnline: boolean;
  conversationCreatorId: string | null;
  conversationMembers: TUserInfo[] | null;
  handleShowSidebarMenu: () => void;
}
const ConversationHeader: FC<IConversationHeaderProps> = ({
  conversationId,
  conversationName,
  conversationAvatarURL,
  anotherUser,
  isAnotherUserOnline,
  conversationCreatorId,
  conversationMembers,
  handleShowSidebarMenu,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // const [leaveConversationConn] = useLeaveConversationConnectMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCloseConversation = () => {
    navigate("/");
  };

  const closeConversation = async () => {
    if (!conversationId) return;
    // await leaveConversationConn(conversationId).unwrap();
    dispatch(resetCurrentConversation());
  };
  const handleCallUser = async () => {
    if (conversationCreatorId || conversationName || !anotherUser) return;
    dispatch(callUserThunk({ ...anotherUser, ...defaultMediaState }));
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <h1 className="flex md:px-5  border border-gray-200  w-full z-10  items-center justify-between h-16 bg-gray-400">
      {isMobile && (
        <BorderedButton
          type="button"
          className=" mx-2 p-2 text-xl md:text-2xl rounded-full outline-none  transition-all focus:outline-gray-300 text-gray-50 hover:text-gray-50"
          onClick={handleCloseConversation}
        >
          <FaArrowLeft />
        </BorderedButton>
      )}
      <div className="flex flex-row  items-center gap-5">
        <Avatar
          isGroup={!!conversationName}
          picture={
            conversationName ? conversationAvatarURL : anotherUser?.avatarURL
          }
          isOnline={isAnotherUserOnline}
        />
        <div className="flex flex-col ">
          <div className="text-lg max-w-56 truncate">
            {conversationName ? conversationName : anotherUser?.name}
          </div>
          {conversationCreatorId && conversationMembers ? (
            <TypingUser
              groupTypingStatuses={true}
              userTypingIds={conversationMembers
                .filter((user) => user.isTyping)
                .map((user) => {
                  return user._id;
                })}
            />
          ) : (
            anotherUser?.isTyping && <TypingUser />
          )}
        </div>
      </div>
      <div className="">
        {!conversationCreatorId && !conversationName && (
          <button
            type="button"
            onClick={handleCallUser}
            className=" mx-2 p-2 rounded-full outline-none  text-2xl  transition-all  text-gray-50 hover:text-gray-100 "
          >
            <BiSolidPhoneCall />
          </button>
        )}

        <button
          type="button"
          onClick={handleShowSidebarMenu}
          className="  mx-2 p-2 rounded-full outline-none  text-2xl  transition-all  text-gray-50 hover:text-gray-100"
        >
          <HiDotsHorizontal />
        </button>
        {!isMobile && (
          <button
            type="button"
            onClick={closeConversation}
            className="  mx-2 p-2 rounded-full outline-none  text-3xl  transition-all  text-gray-50 hover:text-gray-100 "
          >
            <IoCloseOutline />
          </button>
        )}
      </div>
    </h1>
  );
};

export default ConversationHeader;
