import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { I18nManager } from "react-native";
import "react-native-reanimated";
import "react-native-gesture-handler";

import AuthProvider from "@/contexts/AuthContext";
import { useEffect } from "react";
import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

SplashScreen.preventAutoHideAsync();
I18nManager.allowRTL(true);

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <BottomSheetModalProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="drawer" options={{ headerShown: false }} />
          <Stack.Screen name="synagogues" options={{ title: "בתי כנסת" }} />
          <Stack.Screen name="donors" options={{ title: "תורמים" }} />
          <Stack.Screen name="donations" options={{ title: "תרומות" }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </BottomSheetModalProvider>
  );
}

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { StatusBar } from "expo-status-bar";
// import { GestureHandlerRootView } from "react-native-gesture-handler"; // דרישה לניהול Gesture
// import AuthProvider from "@/contexts/AuthContext"; // ספק ההרשאות שלך
// import DrawerNavigator from "./drawer";
// import Page from "./index";
// import AuthLayout from "./(auth)/_layout";
// import { TabBar } from "@/components/TabBar";
// import TabLayout from "./(tabs)/_layout";
// import Login from "./(auth)/login";
// import DonorListScreen from "./donors";

// const Stack = createStackNavigator();

// const RootLayout = () => {
//   return (
//     <AuthProvider>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" component={Page} />
//       <Stack.Screen name="register" component={Page} />
//       <Stack.Screen name="login" component={Login} />
//       <Stack.Screen name="main" component={DrawerNavigator} />
//       <Stack.Screen name="donors" component={DonorListScreen} />

//     </Stack.Navigator>
// //       </GestureHandlerRootView>
// //     </AuthProvider>
//   );
// };

// export default RootLayout;
