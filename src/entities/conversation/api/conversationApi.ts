import baseApi from "../../../app/api/baseApi";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import getTokenFromLS from "../../../shared/utils/getTokenFromLS";
import { apiURLs, backendMessages } from "../../../shared/values/strValues";
import { deleteConversation } from "../model/";
import {
  TMessageInfo,
  TOpenConversationConnectionResponse,
} from "./conversationTypes";
import { useConversationWs } from "./useConversationWs";

// Websocket connection
const websocketUrl = apiURLs.conversationWebsocketConn;

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectToChatChanel: builder.query<
      {
        messages: TMessageInfo[] | null;
        members: TUserInfo[] | null;
        conversationId: number | null;
      },
      { member_ids: number[] | null }
    >({
      queryFn: () => ({
        data: {
          members: null,
          messages: null,
          conversationId: null,
        },
      }),
      async onCacheEntryAdded(
        { member_ids },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        if (member_ids) {
          useConversationWs.setWs(
            new WebSocket(
              `${websocketUrl}?member_ids=[${member_ids.join(
                ","
              )}]&token=${getTokenFromLS()}`
            )
          );

          try {
            await cacheDataLoaded;

            useConversationWs.onmessage = (event) => {
              const data: TOpenConversationConnectionResponse = JSON.parse(
                event.data
              );

              // Initialize
              if (
                data.message ===
                backendMessages.websocket.conversationWS.conversationCreating
              ) {
                updateCachedData((draft) => {
                  draft.messages = data.messages;
                  draft.members = data.members;
                  draft.conversationId = data.conversationId;
                });
              } else if (
                // Accepting message
                data.message ===
                backendMessages.websocket.conversationWS.sendedMessage
              ) {
                updateCachedData((draft) => {
                  // draft.messages = data.messages;
                  if (draft.messages) {
                    draft.messages.push(data.sended_message);
                  } else if (!draft.messages && Array.isArray(draft.messages)) {
                    draft.messages = [data.sended_message];
                  }
                });
              } else if (
                // Editing message
                data.message ===
                backendMessages.websocket.conversationWS.editedMessage
              ) {
                updateCachedData((draft) => {
                  // draft.messages = data.messages;
                  const messageToEdit = draft.messages?.find(
                    (message) =>
                      message.message_id === data.edited_message.message_id
                  );
                  if (messageToEdit) {
                    Object.assign(messageToEdit, data.edited_message);
                  }
                });
              } else if (
                // Deleting message
                data.message ===
                backendMessages.websocket.conversationWS.deletedMessage
              ) {
                updateCachedData((draft) => {
                  // draft.messages = data.messages;
                  draft.messages =
                    draft.messages?.filter(
                      (message) =>
                        message.message_id !== data.deleted_message_id
                    ) || [];
                });
              } else if (
                // Deleting conversation(clear draft)
                data.message ===
                backendMessages.websocket.conversationWS.conversationDeleted
              ) {
                updateCachedData((draft) => {
                  draft.messages = null;
                  draft.members = null;
                  draft.conversationId = null;
                });
                // Clear store atributes related with conversation and close web socket conn
                dispatch(deleteConversation());
                if (useConversationWs) {
                  useConversationWs.closeWs();
                }
              }
            };

            useConversationWs.onerror = (error) => {
              console.error("WebSocket error:", error);
            };
          } catch (err) {
            console.error("Failed to connect to WebSocket:", err);
          }

          // Remove websocket connection
          await cacheEntryRemoved;
          useConversationWs.closeWs();
        }
      },
      providesTags: ["Conversation"],
    }),

    sendMessage: builder.mutation<
      string,
      {
        conversationId: number;
        message: {
          text: string | null;
          image: string | null;
          senderId: number;
        };
      }
    >({
      async queryFn({ conversationId, message }) {
        return new Promise((resolve, reject) => {
          const data = {
            conversationId: conversationId,
            message: {
              message_text: message.text,
              message_image: message.image,
              sender_id: message.senderId,
            },
            token: getTokenFromLS(),
          };

          useConversationWs.send(JSON.stringify(data));
          resolve({ data: "Message sent" });
          useConversationWs.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(new Error("Failed to send message"));
          };
        });
      },
    }),
    editMessage: builder.mutation<
      string,
      {
        conversationId: number;
        message: {
          text: string | null;
          image: string | null;
          senderId: number;
          id: number;
          seen: boolean;
        };
      }
    >({
      async queryFn({ conversationId, message }) {
        return new Promise((resolve, reject) => {
          const data = {
            conversationId: conversationId,
            message: {
              message_id: message.id,
              message_text: message.text,
              message_image: message.image,
              sender_id: message.senderId,
              seen: message.seen,
            },
            token: getTokenFromLS(),
          };

          useConversationWs.send(JSON.stringify(data));
          resolve({ data: "Message edited" });
          useConversationWs.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(new Error("Failed to edit message"));
          };
        });
      },
    }),
    deleteMessage: builder.mutation<
      string,
      {
        conversationId: number;
        messageId: number;
      }
    >({
      async queryFn({ conversationId, messageId }) {
        return new Promise((resolve, reject) => {
          const data = {
            conversationId: conversationId,
            messageId: messageId,
            method: "delete",

            token: getTokenFromLS(),
          };

          useConversationWs.send(JSON.stringify(data));
          resolve({ data: "Message deleted" });
          useConversationWs.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(new Error("Failed to send message"));
          };
        });
      },
    }),
    setSeenMessage: builder.mutation<
      string,
      {
        conversationId: number;
        messageId: number;
      }
    >({
      async queryFn({ conversationId, messageId }) {
        return new Promise((resolve, reject) => {
          const data = {
            conversationId: conversationId,
            messageId: messageId,
            method: "set_seen",
            token: getTokenFromLS(),
          };

          useConversationWs.send(JSON.stringify(data));
          resolve({ data: "Message seen" });
          useConversationWs.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(new Error("Failed to send message"));
          };
        });
      },
    }),
    deleteConversation: builder.mutation<
      string,
      {
        conversationId: number;
      }
    >({
      async queryFn({ conversationId }) {
        return new Promise((resolve, reject) => {
          const data = {
            conversationUpdate: "delete",
            conversationId: conversationId,

            token: getTokenFromLS(),
          };
          useConversationWs.send(JSON.stringify(data));
          resolve({ data: "Conversation deleted" });
          useConversationWs.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(new Error("Failed to send message"));
          };
        });
      },
      invalidatesTags: ["Conversation"],
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
} = chatApi;
