import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { colors } from "@/styles/colors";
import { useAuth } from "@/contexts/AuthContext";
import { router, usePathname } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { logout } from "@/utils/api/auth";

const DrawerContent = (props: any) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        //drawerActiveBackgroundColor={colors.primary}
        //drawerActiveTintColor={colors.white}
        //drawerInactiveTintColor={colors.black}
        style={{ direction: "rtl" }}
        contentContainerStyle={{ backgroundColor: colors.primary }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ padding: 20, marginTop: 100 }}>
            <Text style={styles.name}>
              {user?.firstName + " " + user?.lastName}
            </Text>
            <Text style={styles.donations}>
              כמות תרומות - {user?.totalDonations || 0}
            </Text>
          </View>
        </View>
        <View style={{ backgroundColor: "#fff" }}>
          <DrawerItemList {...props} />
        </View>
        {/* <View
          style={{
            backgroundColor: colors.white,
            paddingTop: 10,
            direction: "rtl",
          }}
        >
          <DrawerItem
            icon={({ size, color }) => (
              <FontAwesome5
                name="users"
                size={size}
                color={pathname == "/donors" ? "#fff" : "#000"}
              />
            )}
            label={"התורמים שלי"}
            labelStyle={[
              styles.label,
              { color: pathname == "/donors" ? "#fff" : "#000" },
            ]}
            style={{
              backgroundColor: pathname == "/donors" ? colors.primary : "#fff",
              borderRadius: 8,
              direction: "rtl",
              
            }}
            onPress={() => router.push("/donors")}
          />
          <DrawerItem
            icon={({ size, color }) => (
              <FontAwesome5
                name="synagogue"
                size={size}
                color={
                  pathname == "/synagogues" ? colors.tabIconSelected : "#000"
                }
              />
            )}
            label={"בתי הכנסת שלי"}
            labelStyle={[
              styles.label,
              { color: pathname == "/synagogues" ? "#fff" : "#000" },
            ]}
            style={{
              backgroundColor:
                pathname == "/synagogues" ? colors.primary : "#fff",
              borderRadius: 8,
            }}
            onPress={() => router.push("/synagogues")}
          />
          <DrawerItem
            icon={({ size, color }) => (
              <Ionicons
                name="log-in-outline"
                size={size}
                color={pathname == "/map" ? "#fff" : "#000"}
              />
            )}
            label={"התחברות"}
            labelStyle={[
              styles.label,
              { color: pathname == "/map" ? "#fff" : "#000" },
            ]}
            style={{
              backgroundColor: pathname == "/map" ? colors.primary : "#fff",
              borderRadius: 8,
            }}
            onPress={() => router.push("/(auth)/login")}
          />
        </View> */}
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <DrawerItem
          icon={({ size, color }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          label={"התנתקות"}
          style={{
            borderRadius: 20,
            marginBottom: bottom + 10,
            direction: "rtl",
          }}
          onPress={async () => {
            await logout();
            router.replace("/(auth)/login");
          }}
        />
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  name: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 22,
    color: colors.white,
  },
  donations: {
    alignSelf: "center",
    fontWeight: "500",
    fontSize: 18,
    color: colors.white,
  },
  label: {
    fontSize: 18,
    paddingRight: 10,
    direction: "rtl",
  },
});
