import apiSlice from './apiSlice';

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyFriends: builder.query({
      query: () => `/api/users/get-friends`,
    }),
    getMyFriendsWithLastMsg: builder.query({
      query: () => `/api/users/get-friends-with-last-msg`,
    }),
  }),
});

export const { useGetMyFriendsQuery, useGetMyFriendsWithLastMsgQuery } =
  userApiSlice;
