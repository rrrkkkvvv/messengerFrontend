import baseApi from "../../../app/api/baseApi";
import { TAuthResponse } from "../../../features/auth/api/authTypes";
import { apiURLs, localStorageItems } from "../../../shared/values/strValues";
import {
  TEditProfileResponse,
  TGetUsersResponse,
  TProfile,
  TUserInfo,
} from "./userTypes";

const fragmentBaseUrl = apiURLs.paths.userAPI;

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<TGetUsersResponse, string>({
      query: (email) => ({
        url: `${fragmentBaseUrl}?email=${email}&token=${localStorage.getItem(
          localStorageItems.jwtToken
        )}`,
        method: "GET",
      }),
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

export const { useGetUsersQuery, usePrefetch, useEditUserMutation } = authApi;
export default authApi;
