import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Checkbox from "expo-checkbox";
import { colors } from "@/styles/colors";

type Props = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  title: string;
};

const CustomCheckbox = ({ isChecked, setIsChecked, title }: Props) => {
  return (
    <View style={styles.checkboxContainer}>
      <Checkbox
        style={{
          marginLeft: 8,
          direction: "rtl",
          borderRadius: 5,
          borderColor: colors.primary,
        }}
        value={isChecked}
        onValueChange={setIsChecked}
        color={isChecked ? colors.primary : undefined}
      />
      <Text style={styles.checkbox}>{title}</Text>
    </View>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
    direction: "rtl",
  },
  checkbox: {
    fontSize: 16,
    color: colors.primary,
  },
});
