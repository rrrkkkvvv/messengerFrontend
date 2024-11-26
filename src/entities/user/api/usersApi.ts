import baseApi from "../../../app/api/baseApi";
import { apiURLs, localStorageItems } from "../../../shared/values/strValues";
import { TGetUsersResponse } from "./userTypes";

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
  }),
});

export const { useGetUsersQuery, usePrefetch } = authApi;
export default authApi;
