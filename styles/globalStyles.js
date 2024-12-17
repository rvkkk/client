import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,//"#E3F2FD",
    padding: 20,
    writingDirection: "rtl",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,//"#E3F2FD",
    padding: 20,
    writingDirection: "rtl",
    //marginBottom: 100
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    marginBottom: 15,
    borderColor: colors.lightGray,
    borderWidth: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    writingDirection: "rtl",
    marginBottom: 20
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  // inputOuter: {
  //   writingDirection: "rtl",
  //   backgroundColor: colors.white,
  //   borderRadius: 5,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // inputInner: {
  //   writingDirection: "rtl",
  //   padding: 8,
  //   borderRadius: 4,
  //   //backgroundColor: colors.white,
  //   flex: 1,
  //   fontSize: 16,
  //   borderWidth: 0,
  //   color: colors.text
  // },
});
