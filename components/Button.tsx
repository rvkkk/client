import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { globalStyles } from "@/styles/globalStyles";

type props = {
  title: string;
  handlePress: () => void;
  containerStyles?: object;
  textStyles?: object;
  isLoading?: boolean;
};

const Button = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: props) => {
  return (
    <TouchableOpacity
      //onPress={handlePress}
      onPressIn={handlePress}
      activeOpacity={0.7}
      style={[globalStyles.button, containerStyles]}
      //disabled={isLoading}
    >
      <Text style={[globalStyles.buttonText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
