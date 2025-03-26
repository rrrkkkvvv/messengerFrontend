import baseApi from "../../../app/api/baseApi";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs } from "../../../shared/values/strValues";
import { TMessageInfo } from "./conversationTypes";
import { deleteConversation } from "../model";
import { TApiSocket } from "../../../shared/types/websocketType";
import { removeLastMessageData } from "../../user/model/getUsersSlice";
const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.conversations;
let socket: TApiSocket = null;
const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectToChatChanel: builder.query<
      {
        messages: TMessageInfo[] | null;
        members: TUserInfo[] | null;
        conversationId: string | null;
      },
      { userId: string | null }
    >({
      queryFn: () => ({
        data: {
          members: null,
          messages: null,
          conversationId: null,
        },
      }),
      async onCacheEntryAdded(
        { userId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        if (userId !== null) {
          socket = useSocket(wsUrl);
          socket.emit("joinConversation", { userId });

          try {
            await cacheDataLoaded;
            socket.on("unauthorized", ({ message }) => {
              throw new Error("Unauthorized: " + message);
            });
            socket.on("connect", () => {
              // console.log("Connected to WebSocket");
            });
            socket.on("conversationData", (conversationData) => {
              updateCachedData((draft) => {
                draft.members = conversationData.members;
                draft.conversationId = conversationData._id;
                draft.messages = conversationData.messages;
              });
            });
            socket.on("newMessage", (sendedMessage) => {
              updateCachedData((draft) => {
                if (draft.messages) {
                  draft.messages.push(sendedMessage);
                } else {
                  draft.messages = [sendedMessage];
                }
              });
            });

            socket.on("messageUpdated", (updatedMessage) => {
              updateCachedData((draft) => {
                if (!draft.messages) return;

                draft.messages = draft.messages.map((message) =>
                  message._id === updatedMessage._id
                    ? { ...message, ...updatedMessage }
                    : message
                );
              });
            });
            socket.on("messageDeleted", (messageId) => {
              updateCachedData((draft) => {
                if (!draft.messages) return;

                draft.messages = draft.messages.filter(
                  (message) => message._id !== messageId
                );
              });
            });

            socket.on("conversationDeleted", (conversationId) => {
              updateCachedData((draft) => {
                draft.messages = null;
                draft.members = null;
                draft.conversationId = null;
              });
              dispatch(removeLastMessageData(conversationId));
              // Clear store atributes related with conversation and close web socket conn
              dispatch(deleteConversation());
            });
          } catch (err) {
            console.error("Failed to connect to WebSocket:", err);
          }

          // Remove websocket connection
          await cacheEntryRemoved;
        }
      },
      providesTags: ["Conversation"],
    }),
    startTyping: builder.mutation<
      string,
      {
        conversationId: string;
      }
    >({
      async queryFn({ conversationId }) {
        return new Promise((resolve) => {
          socket?.emit("userTyping", { conversationId });
          resolve({ data: "Typing" });
        });
      },
    }),
    stopTyping: builder.mutation<
      string,
      {
        conversationId: string;
      }
    >({
      async queryFn({ conversationId }) {
        return new Promise((resolve) => {
          socket?.emit("userStopTyping", { conversationId });
          resolve({ data: "Stop typing" });
        });
      },
    }),
    sendMessage: builder.mutation<
      string,
      {
        conversationId: string;
        message: {
          messageText?: string;
          messageImage?: string;
        };
      }
    >({
      async queryFn({ conversationId, message }) {
        return new Promise((resolve) => {
          socket?.emit("sendMessage", { conversationId, message });
          resolve({ data: "Message sent" });
        });
      },
    }),
    editMessage: builder.mutation<
      string,
      {
        conversationId: string;
        message: TMessageInfo;
      }
    >({
      async queryFn({ conversationId, message }) {
        return new Promise((resolve) => {
          socket?.emit("updateMessage", { conversationId, message });
          resolve({ data: "Message edited" });
        });
      },
    }),
    deleteMessage: builder.mutation<
      string,
      {
        conversationId: string;
        messageId: string;
      }
    >({
      async queryFn({ conversationId, messageId }) {
        return new Promise((resolve) => {
          socket?.emit("deleteMessage", { conversationId, messageId });

          resolve({ data: "Message deleted" });
        });
      },
    }),
    setSeenMessage: builder.mutation<
      string,
      {
        conversationId: string;
        userId: string;
        messageId: string;
      }
    >({
      async queryFn({ conversationId, userId, messageId }) {
        return new Promise((resolve) => {
          socket?.emit("setSeenMessage", { conversationId, userId, messageId });

          resolve({ data: "Message seen" });
        });
      },
    }),
    deleteConversation: builder.mutation<
      string,
      {
        conversationId: string;
      }
    >({
      async queryFn({ conversationId }) {
        return new Promise((resolve) => {
          socket?.emit("deleteConversation", { conversationId });
          resolve({ data: "Conversation deleted" });
        });
      },
      invalidatesTags: ["Conversation"],
    }),
    leaveConversationConnect: builder.mutation<string, string>({
      async queryFn(conversationId) {
        return new Promise((resolve) => {
          socket?.emit("leaveConversation", { conversationId });
          socket?.disconnect();
          resolve({ data: "Leaved out a conversation" });
        });
      },
    }),
    invalidateConversation: builder.mutation<string, void>({
      async queryFn() {
        return new Promise((resolve) => {
          resolve({ data: "Conversation invalidated" });
        });
      },
      invalidatesTags: ["Conversation"],
    }),
  }),
});

export const {
  useConnectToChatChanelQuery,
  useDeleteConversationMutation,
  useInvalidateConversationMutation,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useSetSeenMessageMutation,
  useLeaveConversationConnectMutation,
  useStartTypingMutation,
  useStopTypingMutation,
} = chatApi;
