import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { apiURLs } from "../../shared/values/strValues";

const staggeredBaseQuery = retry(fetchBaseQuery({ baseUrl: apiURLs.baseURL }), {
  maxRetries: 0,
});
const baseApi = createApi({
  reducerPath: "api",
  baseQuery: staggeredBaseQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ["Conversation"],
});

export default baseApi;
