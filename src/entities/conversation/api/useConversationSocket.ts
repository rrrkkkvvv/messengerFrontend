import { useEffect, useRef } from "react";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs } from "../../../shared/values/strValues";
import { useAppDispatch } from "../../../app/store/store";
import { deleteMessage, newMessage, updateMessage } from "../";
import { Socket } from "socket.io-client";
const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.conversations;
export type TUseConversationSocketProps = {
  _id: string | undefined;
};

const useConversationSocket = ({ _id }: TUseConversationSocketProps) => {
  const conversationSocket = useRef<Socket>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    conversationSocket.current = useSocket(wsUrl);
    conversationSocket.current.emit("joinConversation", _id);

    conversationSocket.current.on("newMessage", (sendedMessage) => {
      dispatch(newMessage(sendedMessage));
    });

    conversationSocket.current.on("messageUpdated", (updatedMessage) => {
      dispatch(updateMessage(updatedMessage));
    });
    conversationSocket.current.on(
      "messageDeleted",
      ({ messageId, conversationId }) => {
        dispatch(deleteMessage({ messageId, conversationId }));
      }
    );
  }, [_id]);
  const setSeenMessage = ({
    conversationId,
    messageId,
    userId,
  }: {
    conversationId: string;
    userId: string;
    messageId: string;
  }) => {
    if (!conversationSocket.current) return;

    conversationSocket.current.emit("setSeenMessage", {
      conversationId,
      userId,
      messageId,
    });
  };
  const startTyping = (conversationId: string) => {
    if (!conversationSocket.current) return;
    conversationSocket.current.emit("userTyping", { conversationId });
  };
  const stopTyping = (conversationId: string) => {
    if (!conversationSocket.current) return;

    conversationSocket.current.emit("userStopTyping", { conversationId });
  };
  return { setSeenMessage, startTyping, stopTyping };
};

export default useConversationSocket;
