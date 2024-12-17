import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import React, { useEffect } from "react";
import { icon } from "@/constants/icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors } from "@/styles/colors";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
}: {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  routeName: string;
  label: string;
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 50 }
    );
  }, [opacity, isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacityValue = interpolate(opacity.value, [0, 1], [1, 0]);

    return {
      opacity: opacityValue,
    };
  });

  if(routeName === "add donation")
    return(
      <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.addButton, styles.shadow]}
    >
      <Ionicons name="add" size={28} color="white" />
    </TouchableOpacity>
  )

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabbarBtn}
    >
      <View>
        {icon[routeName]({
          color: isFocused ? colors.tabIconSelected : colors.tabIconDefault,
          focused: isFocused,
        })}
      </View>
      <Text
        style={[
          {
            color: isFocused ? colors.tabIconSelected : colors.tabIconDefault,
            fontSize: 12,
            fontWeight: isFocused ? "bold" : "regular",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabbarBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  focused: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 40
  },
  addButton: {
    bottom: 35,
    backgroundColor: colors.tabIconSelected,
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 15
    },
    shadowOpacity: 25,
    shadowRadius: 3.5,
    elevation: 5
  }
});
