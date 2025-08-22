import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import * as splashScreen from "expo-splash-screen";
import * as SecureStore from 'expo-secure-store';
splashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [isLogin, setIsLogin] = useState(false);
  
  
  useEffect(() => {
    const prepare = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      setIsLogin(!!token); // sets true if token exists, else false
      await splashScreen.hideAsync(); // hide after check
    };

    prepare();
  }, []);
  

  return (
    <>
    <Stack screenOptions={{animation: "fade_from_bottom", headerShown:false, contentStyle: {
      backgroundColor: "white", 
    },}}/>
      {isLogin ? (
        <Redirect href={"/(main)"} />
      ) : (
        <Redirect href={"/(auth)"} />
      )}
    </>
  );
};

export default RootLayout;
