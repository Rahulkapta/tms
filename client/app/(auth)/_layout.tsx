import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { persistor, store } from "@/store";
import { useFonts } from "expo-font";
import { PersistGate } from "redux-persist/integration/react";

const AuthStack = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default AuthStack;
