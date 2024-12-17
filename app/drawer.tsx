import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "@/components/DrawerContent";
import { colors } from "@/styles/colors";
import DonorListScreen from "./donors";
import SynagoguesListScreen from "./synagogues";
import TabLayout from "./(tabs)/_layout";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          drawerPosition: "right",
          headerRight: () => (
            <Ionicons
              name="menu"
              size={26}
              color={colors.primary}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={{ marginRight: 20 }}
            />
          ),
          headerLeft: () => null,
          drawerType: "slide",
          headerTitleAlign: "center",
          title: "שנורר",
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: colors.primary,
          drawerActiveBackgroundColor: colors.lightBlue,
          drawerLabelStyle: { fontSize: 16, },
          drawerStyle: {marginVertical: 10}
        })}
      >
        <Drawer.Screen
          name="MainTabs"
          component={TabLayout}
          options={{
            title: "טאבים ראשיים",
            headerShown: false,
            drawerIcon: ({ size, color }) => (
              <FontAwesome5 name="map" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="donors"
          component={DonorListScreen}
          options={{
            title: "התורמים שלי",
            drawerIcon: ({ size, color }) => (
              <FontAwesome5 name="users" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="synagogues"
          component={SynagoguesListScreen}
          options={{
            title: "בתי הכנסת שלי",
            drawerIcon: ({ size, color }) => (
              <FontAwesome5 name="synagogue" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

export default DrawerNavigator;
