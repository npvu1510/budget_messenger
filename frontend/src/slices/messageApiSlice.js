import apiSlice from './apiSlice';

const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (friendId) => ({
        url: '/api/messages',
        method: 'GET',
        params: { friendId },
      }),
      providesTags: [{ type: 'Message', id: 'LIST' }],
    }),
    send: builder.mutation({
      query: (message) => ({
        url: '/api/messages',
        method: 'POST',
        body: message,
      }),
      // invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
    // deleteMessage: builder.mutation({
    //   query: (messageId) => ({
    //     url: `/api/messages/${messageId}`,
    //     method: 'DELETE',
    //   }),
    //   transformResponse: (response) => response.data,
    // }),

    sendImage: builder.mutation({
      query: (data) => ({
        url: '/api/messages/send-image',
        method: 'POST',
        body: data,
      }),
      // transformResponse: (response) => response.data,
    }),

    updateMessageStatus: builder.mutation({
      query: (body) => ({
        url: '/api/messages/status',
        method: 'PATCH',
        body,
      }),
      // transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMutation,
  useSendImageMutation,
  useUpdateMessageStatusMutation,
} = messageApiSlice;
