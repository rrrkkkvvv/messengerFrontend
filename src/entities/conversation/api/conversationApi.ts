import baseApi from "../../../app/api/baseApi";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs } from "../../../shared/values/strValues";
import {
  TEditGroupInfo,
  TMessageInfo,
  TUpdateGroupResponse,
} from "./conversationTypes";
import { TApiSocket } from "../../../shared/types/websocketType";
const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.conversations;
const { createGroupConversation } = apiURLs.paths.conversation;

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

const conversationApi = baseApi.injectEndpoints({
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
              if (
                draft.messages?.find(
                  (message) =>
                    message._id === sendedMessage._id ||
                    (message.pendingId &&
                      sendedMessage.pendingId &&
                      message.pendingId === sendedMessage.pendingId)
                )
              ) {
                return;
              }
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
      { data: TMessageInfo },
      { formData: FormData }
    >({
      query: ({ formData }) => {
        return {
          url: `/conversations/sendMessage`,
          method: "POST",
          body: formData,
        };
      },
    }),

    editMessage: builder.mutation<
      { data: TMessageInfo },
      { formData: FormData }
    >({
      query: ({ formData }) => {
        return {
          url: `/conversations/updateMessage`,
          method: "PUT",
          body: formData,
        };
      },
    }),

    deleteMessage: builder.mutation<
      void,
      { conversationId: string; messageId: string }
    >({
      query: ({ conversationId, messageId }) => ({
        url: `/conversations/deleteMessage`,
        method: "DELETE",
        body: { conversationId, messageId },
      }),
    }),

    deleteConversation: builder.mutation<void, { conversationId: string }>({
      query: ({ conversationId }) => ({
        url: `/conversations/deleteConversation`,
        method: "DELETE",
        body: { conversationId },
      }),
    }),

    kickUserFromConversation: builder.mutation<
      void,
      { conversationId: string; kickedUserId: string }
    >({
      query: ({ conversationId, kickedUserId }) => ({
        url: `/conversations/kickUser`,
        method: "POST",
        body: { conversationId, kickedUserId },
      }),
    }),

    addUsersToConversation: builder.mutation<
      void,
      { conversationId: string; selectedUsers: string[] }
    >({
      query: ({ conversationId, selectedUsers }) => ({
        url: `/conversations/addUsers`,
        method: "POST",
        body: { conversationId, users: selectedUsers },
      }),
    }),

    leaveFromConversation: builder.mutation<void, { conversationId: string }>({
      query: ({ conversationId }) => ({
        url: `/conversations/leave`,
        method: "POST",
        body: { conversationId },
      }),
    }),

    updateGroupConversation: builder.mutation<
      TUpdateGroupResponse,
      TEditGroupInfo
    >({
      query: (updatedGroup) => {
        return {
          url: `/conversations/updateGroup`,
          method: "PUT",
          body: updatedGroup,
        };
      },
    }),
    createGroupConversation: builder.mutation<
      void,
      {
        userIds: string[];
        name: string;
        creatorId: string;
      }
    >({
      query: ({ userIds, name, creatorId }) => ({
        url: createGroupConversation,
        method: "POST",
        body: {
          userIds,
          name,
          creatorId,
        },
      }),
    }),
    //
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
  useCreateGroupConversationMutation,
} = conversationApi;
