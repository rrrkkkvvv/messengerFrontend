import baseApi from "../../../app/api/baseApi";
import { TProfile, TUserInfo } from "../../../shared/types/UserEntityTypes";
import { TApiSocket } from "../../../shared/types/websocketType";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs } from "../../../shared/values/strValues";
import { TDeleteUserResponse, TUpdateUserResponse } from "./userTypes";

const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.users;
let socket: TApiSocket = null;

const usersApi = baseApi.injectEndpoints({
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
            socket.on("userUpdated", (updatedUser) => {
              updateCachedData((draft) => {
                if (!draft.users) return;

                draft.users = draft.users.map((user) =>
                  user._id === updatedUser._id
                    ? { ...user, ...updatedUser }
                    : user
                );
              });
            });
            socket.on("userDeleted", (deletedUserId) => {
              updateCachedData((draft) => {
                if (!draft.users) return;

                draft.users = draft.users.filter(
                  (user) => user._id !== deletedUserId
                );
              });
            });

            socket.on("usersData", (data) => {
              updateCachedData((draft) => {
                draft.users = data.users;
                draft.usersOnline = data.usersOnline;
              });
            });
          } catch (err) {
            console.error("Failed to connect to WebSocket:", err);
          }

          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
      providesTags: ["Users", "Conversation"],
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
    disconnectFromSocket: builder.mutation<string, void>({
      async queryFn() {
        return new Promise((resolve) => {
          socket?.disconnect();
          resolve({ data: "User was disconnected" });
        });
      },
    }),
    updateUser: builder.mutation<TUpdateUserResponse, TProfile>({
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
} = usersApi;

export default usersApi;
