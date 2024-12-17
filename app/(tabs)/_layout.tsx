import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapScreen from "./map";
import Search from "./search";
import DonationsListScreen from "../donations";
import Profile from "./profile";
import { TabBar } from "@/components/TabBar";
import AddDonationScreen from "../donations/add";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const navigation = useNavigation();
  const Tab = createBottomTabNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerTitleAlign: "center",
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
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen
          name="map"
          component={MapScreen}
          options={{
            title: "מפה",
          }}
        />
        <Tab.Screen
          name="search"
          component={Search}
          options={{
            title: "חיפוש",
          }}
        />
        <Tab.Screen
          name="add donation"
          component={AddDonationScreen}
          options={{
            title: "הוספת תרומה",
          }}
        />
        <Tab.Screen
          name="donations"
          component={DonationsListScreen}
          options={{
            title: "תרומות",
          }}
        />
        <Tab.Screen
          name="profile"
          component={Profile}
          options={{
            title: "פרופיל אישי",
          }}
        />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}
