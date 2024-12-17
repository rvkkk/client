import { StyleSheet, View, Keyboard } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { colors } from "@/styles/colors";

type Props = {
  placeHolder: string;
  searchQuery: string;
  handleSearch: (query: string) => void;
  handleSave: (query: string) => void;
  style?: object;
};
const SearchBar = ({
  placeHolder,
  searchQuery,
  handleSearch,
  handleSave,
  style,
}: Props) => {
  return (
    <View>
      <View style={[styles.searchContainer, style]}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeHolder}
          placeholderTextColor={colors.lightGray}
          value={searchQuery}
          onChangeText={handleSave}
          onEndEditing={() => {
            Keyboard.dismiss();
            handleSearch(searchQuery);
          }}
          autoCapitalize="none"
          textAlign="right"
          returnKeyType="search"
        />
        <Ionicons
          name="search"
          size={24}
          color="#1976D2"
          style={styles.searchIcon}
          onPress={() => {
            Keyboard.dismiss();
            handleSearch(searchQuery);
          }}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    marginBottom: 20,
    direction: "rtl",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: colors.text,
  },
});
