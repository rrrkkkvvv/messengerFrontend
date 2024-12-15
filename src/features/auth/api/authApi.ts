import baseApi from "../../../app/api/baseApi";
import { TAuthResponse, TRefreshUserAuthResponse } from "./authTypes";
import { apiURLs } from "../../../shared/values/strValues";
import { TSignInUserData, TUserData } from "../../../entities/user";

const fragmentBaseUrl = apiURLs.paths.userAPI;

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<TAuthResponse, TUserData>({
      query: (userData: TUserData) => ({
        url: fragmentBaseUrl,
        method: "POST",
        body: JSON.stringify({
          method: "signUp",
          params: {
            email: userData.email,
            name: userData.name,
            password: userData.password,
          },
        }),
      }),
    }),
    signIn: builder.mutation<TAuthResponse, TSignInUserData>({
      query: (userData: TSignInUserData) => ({
        url: fragmentBaseUrl,
        method: "POST",
        body: JSON.stringify({
          method: "signIn",

          params: {
            method: "credentials",

            email: userData.email,
            password: userData.password,
          },
        }),
      }),
    }),
    signInByGoogle: builder.mutation<TAuthResponse, string>({
      query: (userToken: string) => ({
        url: fragmentBaseUrl,
        method: "POST",
        body: JSON.stringify({
          method: "signIn",

          params: {
            method: "google",
            gToken: userToken,
          },
        }),
      }),
    }),
    refreshUserAuth: builder.mutation<TRefreshUserAuthResponse, void>({
      query: () => ({
        url: fragmentBaseUrl,
        method: "POST",
        body: JSON.stringify({
          method: "refreshUserAuth",
        }),
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignInByGoogleMutation,
  usePrefetch,
  useRefreshUserAuthMutation,
} = authApi;
export default authApi;
