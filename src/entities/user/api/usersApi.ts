import baseApi from "../../../app/api/baseApi";
import { apiURLs, backendMessages } from "../../../shared/values/strValues";
import getTokenFromLS from "../utils/getTokenFromLS";
import {
  TEditProfileResponse,
  TOpenGetUsersConnectionResponse,
  TProfile,
  TUserInfo,
} from "./userTypes";

const fragmentBaseUrl = apiURLs.paths.userAPI;
let ws: WebSocket | null = null;
const websocketUrl = apiURLs.getUsersWebsocketConn;

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectToGetUsersChanel: builder.query<
      { users: TUserInfo[] | null; usersOnline: string | null[] | null },
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
          ws = new WebSocket(
            `${websocketUrl}?userEmail=${userEmail}&token=${getTokenFromLS()}`
          );

          try {
            await cacheDataLoaded;

            ws.onmessage = (event) => {
              const data: TOpenGetUsersConnectionResponse = JSON.parse(
                event.data
              );

              // Initialize
              if (
                data.message ===
                backendMessages.websocket.getUsersWS.successGetUsers
              ) {
                console.log(data);

                updateCachedData((draft) => {
                  draft.users = data.users;
                  draft.usersOnline = data.usersOnline;
                });
              } else if (
                // Unathorized(clear draft)
                data.message ===
                backendMessages.websocket.getUsersWS.Unathorized
              ) {
                updateCachedData((draft) => {
                  draft.users = null;
                });
                // Clear store atributes related with conversation and close web socket conn
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
  }),
});

export const {
  usePrefetch,
  useEditUserMutation,
  useConnectToGetUsersChanelQuery,
} = authApi;
export default authApi;
