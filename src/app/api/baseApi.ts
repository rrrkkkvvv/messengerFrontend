import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { apiURLs } from "../../shared/values/strValues";
import { RootState } from "../store/store";

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: apiURLs.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).currentUser.jwtToken;

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
  refetchOnReconnect: true,
  tagTypes: ["Conversation", "Users", "Calls"],
});

export default baseApi;
