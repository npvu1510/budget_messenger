import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('userInfo')
  ? { userInfo: JSON.parse(localStorage.getItem('userInfo')) }
  : { userInfo: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    removeUser: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export default userSlice;
