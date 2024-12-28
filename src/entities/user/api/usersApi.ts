import baseApi from "../../../app/api/baseApi";
import { apiURLs, backendMessages } from "../../../shared/values/strValues";
import getTokenFromLS from "../utils/getTokenFromLS";
import { usersWs } from "../utils/usersWs";
import {
  TEditProfileResponse,
  TOpenGetUsersConnectionResponse,
  TProfile,
  TUserInfo,
} from "./userTypes";

const fragmentBaseUrl = apiURLs.paths.userAPI;

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
          usersWs.setWs(
            new WebSocket(
              `${websocketUrl}?userEmail=${userEmail}&token=${getTokenFromLS()}`
            )
          );
          try {
            await cacheDataLoaded;

            usersWs.onmessage = (event) => {
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

                usersWs.closeWs();
              }
            };

            usersWs.onerror = (error) => {
              console.error("WebSocket error:", error);
            };
          } catch (err) {
            console.error("Failed to connect to WebSocket:", err);
          }

          // Remove websocket connection
          await cacheEntryRemoved;

          usersWs.closeWs();
        }
      },
      providesTags: ["Users", "Conversation"],
    }),

    editUser: builder.mutation<TEditProfileResponse, TProfile>({
      query: (newUserProfile: TProfile) => ({
        url: fragmentBaseUrl,
        method: "POST",
        body: JSON.stringify({
          method: "editUser",

          params: {
            profile: newUserProfile,
          },
        }),
      }),
      invalidatesTags: ["Conversation"],
    }),
    logOffline: builder.mutation<
      string,
      {
        userEmail: string;
      }
    >({
      async queryFn({ userEmail }) {
        return new Promise((resolve, reject) => {
          const data = {
            userEmail: userEmail,

            token: getTokenFromLS(),
          };
          usersWs.send(JSON.stringify(data));
          resolve({ data: "Logged offline" });
          usersWs.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(new Error("Failed to log offline"));
          };
        });
      },
      invalidatesTags: ["Users"],
    }),
    invalidateGetUsers: builder.mutation<string, void>({
      async queryFn() {
        // usersWs.closeWs();
        return new Promise((resolve) => {
          resolve({ data: "Get users invalidated" });
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
  useInvalidateGetUsersMutation,
  useLogOfflineMutation,
} = authApi;
export default authApi;
