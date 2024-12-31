import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { apiURLs } from "../../shared/values/strValues";
import { RootState } from "../store/store";

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: apiURLs.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).currentUser.jwtToken;
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  {
    maxRetries: 0,
  }
);
const baseApi = createApi({
  reducerPath: "api",
  baseQuery: staggeredBaseQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ["Conversation", "Users"],
});

export default baseApi;
