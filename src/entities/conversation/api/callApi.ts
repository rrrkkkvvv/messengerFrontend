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
const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.calls;
let socket: TApiSocket = null;

const callsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectToCallsSocket: builder.query<
      {
        iceCandidates: string[] | null;
      },
      void
    >({
      queryFn: () => ({
        data: {
          callFrom: null,
          iceCandidates: null,
        },
      }),
      async onCacheEntryAdded(
        args,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        if (socket) {
          socket.disconnect();
        }
        socket = useSocket(wsUrl);

        socket?.emit("joinCallsSocket");

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
      providesTags: ["Calls"],
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
  }),
});

export const { useConnectToCallsSocketQuery } = callsApi;
