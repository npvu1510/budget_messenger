import { createSlice } from '@reduxjs/toolkit';

const initialState = { friends: null, currentFriend: null };

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setCurrentFriend: (state, action) => {
      // console.log('action', action.payload);
      state.currentFriend = action.payload;
    },

    setActiveFriends: (state, action) => {
      state.activeFriends = action.payload;
    },

    changeLastMessage: (state, action) => {
      const { id } = action.payload;

      if (id) {
        const friendIdx = state.friends.findIndex(
          (friend) => friend._id === id
        );

        state.friendIdx = friendIdx;

        if (friendIdx !== -1)
          state.friends[friendIdx].lastMsg = action.payload.lastMsg;
      }
    },

    changeMessageStatus: (state, action) => {
      // console.log(action.payload);

      const { userId, status } = action.payload;

      if (!userId || !status) return;
      const friendIdx = state.friends.findIndex(
        (message) => message._id === userId
      );
      state.friends[friendIdx].lastMsg.status = status;
    },
  },
});

export default friendSlice;
