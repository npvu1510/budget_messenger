import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newMessagesFrom: [],
  typing: false,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setNewMessage: (state, action) => {
      state.newMessagesFrom = action.payload;
    },
    addMessage: (state, action) => {
      if (!state.newMessagesFrom.includes(action.payload))
        state.newMessagesFrom.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.newMessagesFrom.find((userId, index) => {
        if (userId === action.payload) {
          state.newMessagesFrom.splice(index, 1);
          return true;
        }
        return false;
      });
    },
    setTyping(state, action) {
      state.typing = action.payload;
    },
  },
});

export default messageSlice;
