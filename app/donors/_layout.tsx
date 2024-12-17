import { Stack } from "expo-router";
import React from "react";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function DonorsLayout() {
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
        <Stack.Screen name="index" options={{
          //headerShown: false,
          title: "התורמים שלי",
        }}/>
            <Stack.Screen name="add" options={{
          //headerShown: false,
          title: "הוספת תרומה",
        }}/>
      </Stack>
    </GestureHandlerRootView>
  );
}
