import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DonationsLayout() {
  const navigation = useNavigation();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerRight: () => (
            <Ionicons
              name="menu"
              size={24}
              color="black"
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={{ marginRight: 20 }}
            />
          ),
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="add"
          options={{
            //headerShown: false,
            title: "הוספת תרומה",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
