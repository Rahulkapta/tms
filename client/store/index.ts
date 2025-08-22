import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createSecureStore from 'redux-persist-expo-securestore';
import projectReducer from "./slices/projectSlice";
import authReducer from './slices/authSlice';

// Create secure storage
const storage = createSecureStore();

// Persist config for auth reducer
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'] // specify what to persist from auth state
};

// Create persisted auth reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Configure store
export const store = configureStore({
  reducer: {
    project: projectReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
