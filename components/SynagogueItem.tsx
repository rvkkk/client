import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";
import { ISynagogue } from "@/constants/types";

const SynagogueItem = ({ synagogue }: { synagogue: ISynagogue }) => {
  console.log(synagogue);
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{synagogue.fullName}</Text>
        <Text style={styles.address}>
          {synagogue.address.street} {synagogue.address.building}
          {",\n" + synagogue.address.city} {synagogue.address.country}
        </Text>
      </View>
      <View style={styles.donationContainer}>
        <Text style={styles.donationLabel}>ממוצע תרומות</Text>
        <Text style={styles.donationAmount}>₪{synagogue.averageDonations}</Text>
      </View>
    </View>
  );
};

export default SynagogueItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    direction: "rtl"
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    ...typography.subheader,
    marginBottom: 4,
  },
  address: {
    ...typography.caption,
  },
  donationContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  donationAmount: {
    ...typography.subheader,
    color: colors.success,
  },
  donationLabel: {
    ...typography.caption,
  },
});
