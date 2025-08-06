import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/projectSlice";
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;