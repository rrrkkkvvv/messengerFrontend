import baseApi from "../../../app/api/baseApi";
import {
  apiURLs,
  backendMessages,
  localStorageItems,
} from "../../../shared/values/strValues";
import { TUserInfo } from "../../user";
import { deleteConversation } from "../model/conversationSlice";
import { TMessageInfo, TOpenResponse } from "./conversationTypes";

// Websocket connection
let ws: WebSocket | null = null;
const websocketUrl = apiURLs.websocketConn;

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectToChat: builder.query<
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
          ws = new WebSocket(
            `${websocketUrl}[${member_ids.join(
              ","
            )}]&token=${localStorage.getItem(localStorageItems.jwtToken)}`
          );

          try {
            await cacheDataLoaded;

            ws.onmessage = (event) => {
              const data: TOpenResponse = JSON.parse(event.data);

              // Initialize
              if (
                data.message === backendMessages.websocket.conversationCreating
              ) {
                updateCachedData((draft) => {
                  draft.messages = data.messages;
                  draft.members = data.members;
                  draft.conversationId = data.conversationId;
                });
              } else if (
                // Accepting a message
                data.message === backendMessages.websocket.messagesUpdate
              ) {
                updateCachedData((draft) => {
                  draft.messages = data.messages;
                });
              } else if (
                // Deleting conversation(clear draft)
                data.message === backendMessages.websocket.conversationDeleted
              ) {
                updateCachedData((draft) => {
                  draft.messages = null;
                  draft.members = null;
                  draft.conversationId = null;
                });
                // Clear store atributes related with conversation and close web socket conn
                dispatch(deleteConversation());
                if (ws) {
                  ws.close();
                  ws = null;
                }
              }
            };

            ws.onerror = (error) => {
              console.error("WebSocket error:", error);
            };
          } catch (err) {
            console.error("Failed to connect to WebSocket:", err);
          }

          // Remove websocket connection
          await cacheEntryRemoved;
        }
      },
      providesTags: ["Conversation"],
    }),

    sendMessage: builder.mutation<
      string,
      {
        conversationId: number;
        message: { text: string; senderId: number };
      }
    >({
      async queryFn({ conversationId, message }) {
        return new Promise((resolve, reject) => {
          if (!ws || ws.readyState !== WebSocket.OPEN) {
            reject(new Error("Websocket does not exists"));
            return;
          }
          const data = {
            conversationId: conversationId,
            message: {
              message_text: message.text,
              sender_id: message.senderId,
            },
            token: localStorage.getItem(localStorageItems.jwtToken),
          };

          ws.send(JSON.stringify(data));
          resolve({ data: "Message sent" });
          ws.onerror = (error) => {
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
          if (!ws || ws.readyState !== WebSocket.OPEN) {
            reject(new Error("Websocket does not exists"));
            return;
          }

          const data = {
            conversationUpdate: "delete",
            conversationId: conversationId,

            token: localStorage.getItem(localStorageItems.jwtToken),
          };
          ws.send(JSON.stringify(data));
          resolve({ data: "Conversation deleted" });
          ws.onerror = (error) => {
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
  useConnectToChatQuery,
  useSendMessageMutation,
  useDeleteConversationMutation,
  useInvalidateConversationMutation,
} = chatApi;
