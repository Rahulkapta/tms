import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserDetails {
  __v: number;
  _id: string;
  createdAt: string;
  designation: string;
  mobileNumber: string;
  name: {
    first: string;
    last: string;
  };
  photoUrl: string;
  updatedAt: string;
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

interface RehydratePayload {
  auth?: AuthState;
}

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
  extraReducers: (builder) => {
    builder.addCase('persist/REHYDRATE' as any, (state, action) => {
      // Typecast action to include payload
      const rehydrateAction = action as PayloadAction<RehydratePayload | undefined>;
      if (rehydrateAction.payload?.auth) {
        state.user = rehydrateAction.payload.auth.user;
      }
    });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
