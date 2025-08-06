import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserDetails {
  __v: number;
  _id: string;
  createdAt: string;      // ISO date string
  designation: string;
  mobileNumber: string;
  name: {
    first: string;
    last: string;
  };
  photoUrl: string;
  updatedAt: string;      // ISO date string
  userId: string;
}
export interface User {
  accessToken: string;
  email: string;
  id: string;
  role: string;
  userDetails: UserDetails;
}

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
