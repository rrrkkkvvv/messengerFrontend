import baseApi from "../../../app/api/baseApi";
import { TMessageInfo } from "../../../shared/types/messageTypes";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<
      { data: TMessageInfo },
      { formData: FormData }
    >({
      query: ({ formData }) => {
        return {
          url: `/conversations/sendMessage`,
          method: "POST",
          body: formData,
        };
      },
    }),

    editMessage: builder.mutation<
      { data: TMessageInfo },
      { formData: FormData }
    >({
      query: ({ formData }) => {
        return {
          url: `/conversations/updateMessage`,
          method: "PUT",
          body: formData,
        };
      },
    }),

    deleteMessage: builder.mutation<
      void,
      { conversationId: string; messageId: string }
    >({
      query: ({ conversationId, messageId }) => ({
        url: `/conversations/deleteMessage`,
        method: "DELETE",
        body: { conversationId, messageId },
      }),
    }),
  }),
});

export const {
  useDeleteMessageMutation,
  useEditMessageMutation,
  useSendMessageMutation,
} = messageApi;
