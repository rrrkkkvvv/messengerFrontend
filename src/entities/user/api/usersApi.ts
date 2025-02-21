import baseApi from "../../../app/api/baseApi";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import getTokenFromLS from "../../../shared/utils/getTokenFromLS";
import { apiURLs, backendMessages } from "../../../shared/values/strValues";
import { useUsersWs } from "./useUsersWs";
import {
  TDeleteUserResponse,
  TOpenGetUsersConnectionResponse,
  TProfile,
  TUpdateUserResponse,
} from "./userTypes";

const websocketUrl = apiURLs.getUsersWebsocketConn;

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectToGetUsersChanel: builder.query<
      { users: TUserInfo[] | null; usersOnline: string[] | null | null },
      { userEmail: string }
    >({
      queryFn: () => ({
        data: { users: null, message: null, usersOnline: null },
      }),
      async onCacheEntryAdded(
        { userEmail },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        if (userEmail) {
          useUsersWs.setWs(
            new WebSocket(
              `${websocketUrl}?userEmail=${userEmail}&token=${getTokenFromLS()}`
            )
          );
          try {
            await cacheDataLoaded;

            useUsersWs.onmessage = (event) => {
              const data: TOpenGetUsersConnectionResponse = JSON.parse(
                event.data
              );

              // Initialize
              if (
                data.message ===
                backendMessages.websocket.getUsersWS.successGetUsers
              ) {
                updateCachedData((draft) => {
                  draft.users = data.users;
                  draft.usersOnline = data.usersOnline;
                });
              } else if (
                data.message ===
                backendMessages.websocket.getUsersWS.updateOnlineUsersList
              ) {
                updateCachedData((draft) => {
                  draft.usersOnline = data.usersOnline;
                });
              } else if (
                // Unathorized(clear draft)
                data.message ===
                backendMessages.websocket.getUsersWS.unathorized
              ) {
                updateCachedData((draft) => {
                  draft.users = null;
                });
                // Clear store atributes related with conversation and close web socket conn

                useUsersWs.closeWs();
              }
            };

            useUsersWs.onerror = (error) => {
              console.error("WebSocket error:", error);
            };
          } catch (err) {
            console.error("Failed to connect to WebSocket:", err);
          }

          // Remove websocket connection
          await cacheEntryRemoved;

          useUsersWs.closeWs();
        }
      },
      providesTags: ["Users", "Conversation"],
    }),

    deleteUser: builder.mutation<TDeleteUserResponse, number>({
      async queryFn(userId) {
        return new Promise((resolve, reject) => {
          const data = {
            method: "deleteUser",
            userId: userId,

            token: getTokenFromLS(),
          };

          useUsersWs.send(JSON.stringify(data));
          resolve({ data: { message: "User was deleted" } });
          useUsersWs.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(new Error("Failed to delete user"));
          };
        });
      },
      invalidatesTags: ["Users"],
    }),
    editUser: builder.mutation<TUpdateUserResponse, TProfile>({
      async queryFn(profile) {
        return new Promise((resolve, reject) => {
          const data = {
            method: "editUser",
            updatedProfile: profile,

            token: getTokenFromLS(),
          };

          useUsersWs.send(JSON.stringify(data));
          resolve({ data: { message: "User was updated" } });
          useUsersWs.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(new Error("Failed update user"));
          };
        });
      },
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  usePrefetch,
  useEditUserMutation,
  useConnectToGetUsersChanelQuery,

  useDeleteUserMutation,
} = authApi;
export default authApi;
