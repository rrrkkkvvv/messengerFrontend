import baseApi from "../../../app/api/baseApi";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs } from "../../../shared/values/strValues";
import {
  TEditGroupInfo,
  TEditingMessage,
  TMessageInfo,
  TSendingMessage,
  TUpdateGroupResponse,
} from "./conversationTypes";
import { TApiSocket } from "../../../shared/types/websocketType";
const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.conversations;
let socket: TApiSocket = null;
type TConnectToChatArgs =
  | {
      isGroup: false;
      userId: string | undefined;
    }
  | {
      isGroup: true;
      conversationId: string | undefined;
    };

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectToChatChanel: builder.query<
      {
        messages: TMessageInfo[] | null;
        members: TUserInfo[] | null;
        conversationId: string | null;
        avatarURL: string | null;
        creatorId: string | null;
        name: string | null;
      },
      TConnectToChatArgs
    >({
      queryFn: () => ({
        data: {
          members: null,
          messages: null,
          conversationId: null,
          avatarURL: null,
          creatorId: null,
          name: null,
        },
      }),
      async onCacheEntryAdded(
        args,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const { isGroup } = args;
        if (socket) {
          socket.disconnect();
        }
        socket = useSocket(wsUrl);
        if ((isGroup && !args.conversationId) || (!isGroup && !args.userId))
          return;
        socket.emit(
          "joinConversation",
          isGroup
            ? { isGroup, conversationId: args.conversationId }
            : { isGroup, userId: args.userId }
        );
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
              if (conversationData.isGroup) {
                draft.name = conversationData.name;
                draft.creatorId = conversationData.creatorId;
                draft.avatarURL = conversationData.avatarURL;
              }
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
        } catch (err) {
          console.error("Failed to connect to WebSocket:", err);
        }

        // Remove websocket connection
        await cacheEntryRemoved;
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
        message: TSendingMessage;
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
        message: TEditingMessage;
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
    kickUserFromConversation: builder.mutation<
      string,
      {
        conversationId: string;
        kickedUserId: string;
      }
    >({
      async queryFn({ conversationId, kickedUserId }) {
        return new Promise((resolve) => {
          socket?.emit("kickUserFromConversation", {
            conversationId,
            kickedUserId,
          });
          resolve({ data: "User was kicked" });
        });
      },
      invalidatesTags: ["Conversation"],
    }),
    addUsersToConversation: builder.mutation<
      string,
      {
        conversationId: string;
        selectedUsers: string[];
      }
    >({
      async queryFn({ conversationId, selectedUsers }) {
        return new Promise((resolve) => {
          socket?.emit("addUsersToConversation", {
            conversationId,
            users: selectedUsers,
          });
          resolve({ data: "Users were added" });
        });
      },
      invalidatesTags: ["Conversation"],
    }),
    leaveFromConversation: builder.mutation<
      string,
      {
        conversationId: string;
      }
    >({
      async queryFn({ conversationId }) {
        return new Promise((resolve) => {
          socket?.emit("leaveFromConversation", {
            conversationId,
          });
          resolve({ data: "Leaved from conversation" });
        });
      },
      invalidatesTags: ["Conversation"],
    }),
    updateGroupConversation: builder.mutation<
      TUpdateGroupResponse,
      TEditGroupInfo
    >({
      async queryFn(groupInfo) {
        return new Promise((resolve) => {
          const data = {
            updatedGroupInfo: groupInfo,
          };

          socket?.emit("updateGroupConversation", data);
          resolve({ data: { message: "Group was updated" } });
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
  useUpdateGroupConversationMutation,
  useConnectToChatChanelQuery,
  useDeleteConversationMutation,
  useInvalidateConversationMutation,
  useLeaveFromConversationMutation,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useSetSeenMessageMutation,
  useLeaveConversationConnectMutation,
  useStartTypingMutation,
  useStopTypingMutation,
  useKickUserFromConversationMutation,
  useAddUsersToConversationMutation,
} = chatApi;
