import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";
import { IDonor } from "@/constants/types";

export default function DonorItem({ donor }: { donor: IDonor }) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {donor.firstName} {donor.lastName}
        </Text>
        <Text style={styles.address} >
          {donor.address.street} {donor.address.building}
          {donor.address.apartment && "/" + donor.address.apartment}
          {",\n" + donor.address.city} {donor.address.country}
        </Text>
      </View>
      <View style={styles.donationContainer}>
        <Text style={styles.donationLabel}>ממוצע תרומות</Text>
        <Text style={styles.donationAmount}>₪{donor.averageDonations}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    direction: "rtl",
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
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  donationAmount: {
    ...typography.subheader,
    color: colors.success,
  },
  donationLabel: {
    ...typography.caption,
  },
});
