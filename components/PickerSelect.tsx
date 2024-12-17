import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { colors } from "@/styles/colors";

type Props = {
  title: string;
  value: string;
  items: { label: string; value: string }[];
  setSelectedValue: (value: string) => void;
  error?: string;
};

const PickerSelect = ({
  title,
  value,
  items,
  setSelectedValue,
  error,
}: Props) => {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.title}>{title}</Text>
      <RNPickerSelect
        onValueChange={setSelectedValue}
        items={items}
        value={value}
        placeholder={{ label: "בחר אפשרות", value: null }}
        style={{
          inputIOS: [styles.input, error && styles.errorBorder],
          inputAndroid: [styles.input, error && styles.errorBorder],
          iconContainer: styles.iconContainer,
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => (
          <Entypo name="chevron-down" size={24} color={error ? colors.error : colors.primary} />
        )}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default PickerSelect;

const styles = StyleSheet.create({
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "400",
    direction: "rtl",
  },
  input: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    //borderWidth: 1,
    //borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    textAlign: "right",
  },
  iconContainer: {
    top: 15,
    left: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    direction: "rtl",
  },
  errorBorder: {
    borderColor: colors.error,
    borderWidth: 2,
  },
});
