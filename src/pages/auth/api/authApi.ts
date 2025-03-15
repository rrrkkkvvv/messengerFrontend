import baseApi from "../../../app/api/baseApi";
import { TAuthResponse } from "./authTypes";
import { apiURLs } from "../../../shared/values/strValues";
import { TSignInUserData } from "../../../entities/user";
import { TUserData } from "../../../shared/types/UserEntityTypes";

const { googleAuthPath, logoutPath, refreshPath, signInPath, signUpPath } =
  apiURLs.paths.auth;

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<TAuthResponse, TUserData>({
      query: (userData: TUserData) => ({
        url: signUpPath,
        method: "POST",
        body: {
          email: userData.email,
          name: userData.name,
          password: userData.password,
        },
      }),
    }),
    signIn: builder.mutation<TAuthResponse, TSignInUserData>({
      query: (userData: TSignInUserData) => ({
        url: signInPath,
        method: "POST",
        body: {
          email: userData.email,
          password: userData.password,
        },
      }),
    }),
    signInByGoogle: builder.mutation<TAuthResponse, { googleToken: string }>({
      query: ({ googleToken }) => ({
        url: googleAuthPath,
        method: "POST",
        body: {
          googleToken,
        },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: logoutPath,
        method: "POST",
      }),
    }),
    refreshUserAuth: builder.mutation<TAuthResponse, void>({
      query: () => ({
        url: refreshPath,
        method: "POST",
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
  useLogoutMutation,
} = authApi;
export default authApi;
