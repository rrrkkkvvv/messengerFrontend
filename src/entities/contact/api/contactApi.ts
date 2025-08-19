import toast from "react-hot-toast";
import baseApi from "../../../app/api/baseApi";
import { TApiSocket } from "../../../shared/types/websocketType";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs, toastTexts } from "../../../shared/values/strValues";
import {
  addUsersToCurrentConversation,
  changeConversationUserTypingStatus,
  kickUserFromCurrentConversation,
  updateCurrentConversationInfo,
  updateUserInfoInConversation,
} from "../../conversation/model/conversationSlice";
import {
  addGroupToContacts,
  createChatWithUser,
  changeLastMessage,
  changeUserTypingStatus,
  resetLastMessage,
  deleteConversation,
  updateGroupContact,
  deleteMemberFromGroup,
  addUsersToConversation,
} from "../model/contactSlice";
import {
  TDeleteUserResponse,
  TEditedProfile,
  TUpdateUserResponse,
} from "./contactTypes";
import {
  TContactsList,
  TGroupConversation,
} from "../../../shared/types/Contact";

const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.users;
let socket: TApiSocket = null;

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectToGetUsersChanel: builder.query<
      {
        contactsData: TContactsList | null;
        usersOnline: string[] | null | null;
      },
      { userEmail: string }
    >({
      queryFn: () => ({
        data: { contactsData: null, message: null, usersOnline: null },
      }),
      async onCacheEntryAdded(
        { userEmail },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        if (userEmail) {
          socket = useSocket(wsUrl);

          socket.emit("getUsersData");

          try {
            await cacheDataLoaded;
            socket.on("unauthorized", ({ message }) => {
              throw new Error("Unauthorized: " + message);
            });

            socket.on("connect", () => {
              // console.log("Connected to WebSocket");
            });

            socket.on("usersOnlineUpdate", (usersOnline) => {
              updateCachedData((draft) => {
                draft.usersOnline = usersOnline;
              });
            });

            socket.on("lastMessageUpdated", (data) => {
              dispatch(
                changeLastMessage({
                  status: data.status,
                  message: data.message,
                })
              );
            });
            socket.on("lastMessageReseted", (conversationId) => {
              dispatch(resetLastMessage(conversationId));
            });

            socket.on("userUpdated", (updatedUser) => {
              updateCachedData((draft) => {
                if (!draft.contactsData) return;
                draft.contactsData = draft.contactsData.map((user) =>
                  user._id === updatedUser._id
                    ? { ...user, ...updatedUser }
                    : user
                );
              });
              dispatch(updateUserInfoInConversation(updatedUser));
            });
            socket.on("groupConversationUpdated", (updatedGroupInfo) => {
              dispatch(updateCurrentConversationInfo(updatedGroupInfo));
              dispatch(updateGroupContact(updatedGroupInfo));
            });
            socket.on(
              "userTypingStatusUpdate",
              ({ conversationId, userId, typingStatus }) => {
                dispatch(
                  changeConversationUserTypingStatus(
                    conversationId,
                    userId,
                    typingStatus
                  )
                );
                dispatch(
                  changeUserTypingStatus(userId, conversationId, typingStatus)
                );
              }
            );
            socket.on(
              "newConversationWithUser",
              ({ userId, conversationId }) => {
                dispatch(createChatWithUser(userId, conversationId));
              }
            );

            socket.on(
              "newGroupWithUser",
              (newGroupConvesation: TGroupConversation) => {
                dispatch(addGroupToContacts(newGroupConvesation));
                toast.success(toastTexts.success.successGroupCreate);
              }
            );
            socket.on("userDeleted", (deletedUserId) => {
              updateCachedData((draft) => {
                if (!draft.contactsData) return;

                draft.contactsData = draft.contactsData.filter(
                  (contact) =>
                    contact.type === "single" && contact._id !== deletedUserId
                );
              });
            });
            socket.on("conversationDeleted", ({ conversationId, isGroup }) => {
              dispatch(deleteConversation(conversationId, isGroup));
            });
            socket.on(
              "kickedUserFromConversation",
              ({ conversationId, kickedUserId }) => {
                dispatch(deleteMemberFromGroup(conversationId, kickedUserId));
                dispatch(
                  kickUserFromCurrentConversation(conversationId, kickedUserId)
                );
              }
            );
            socket.on(
              "addedUserToConversation",
              ({ conversationId, users }) => {
                dispatch(addUsersToConversation(conversationId, users));
                dispatch(addUsersToCurrentConversation(conversationId, users));
              }
            );
            socket.on("usersData", (data) => {
              updateCachedData((draft) => {
                draft.contactsData = data.users;
                draft.usersOnline = data.usersOnline;
              });
            });
          } catch (err) {
            console.error("Failed to connect to WebSocket:", err);
          }

          await cacheEntryRemoved;
          // socket.disconnect();
        }
      },
      providesTags: ["Users", "Conversation"],
    }),
    createGroupConversation: builder.mutation<
      string,
      {
        userIds: string[];
        name: string;
        creatorId: string;
      }
    >({
      async queryFn({ name, userIds, creatorId }) {
        return new Promise((resolve) => {
          socket?.emit("createGroupConversation", { name, userIds, creatorId });
          resolve({ data: "Created" });
        });
      },
    }),

    deleteUser: builder.mutation<TDeleteUserResponse, void>({
      async queryFn() {
        return new Promise((resolve) => {
          socket?.emit("deleteUser");
          resolve({ data: { message: "User was deleted" } });
        });
      },
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<TUpdateUserResponse, TEditedProfile>({
      async queryFn(profile) {
        return new Promise((resolve) => {
          const data = {
            updatedProfile: profile,
          };

          socket?.emit("updateUser", data);
          resolve({ data: { message: "User was updated" } });
        });
      },
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  usePrefetch,
  useUpdateUserMutation,
  useConnectToGetUsersChanelQuery,
  useDeleteUserMutation,
  useCreateGroupConversationMutation,
} = contactApi;

export default contactApi;
