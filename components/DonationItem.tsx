import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";

export default function DonationItem({ donation, donor }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.flex}>
        <Text style={styles.text}>סכום התרומה</Text>
        <Text style={styles.text}>₪ {donation.amount}</Text>
      </View>
      {donor && (
        <View style={styles.flex}>
          <Text style={styles.text}>שם התורם</Text>
          <Text style={styles.text}>{donation?.donor?.fullName}</Text>
        </View>
      )}
      {donor && (
        <View style={styles.flex}>
          <Text style={styles.text}>כתובת</Text>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {donation?.donor?.address.street}{" "}
            {donation?.donor?.address.building}
            {donation?.donor?.address.apartment &&
              "/" + donation?.donor?.address.apartment}
            , {donation?.donor?.address.city} {donation?.donor?.address.country}
          </Text>
        </View>
      )}
      <View style={styles.flex}>
        <Text style={styles.text}>תאריך התרומה</Text>
        <Text style={styles.text}>
          {donation?.createdAt
            ? new Date(donation.createdAt).toLocaleTimeString("he-IL") +
              " ," +
              new Date(donation.createdAt).toLocaleDateString("he-IL")
            : "לא זמין"}
        </Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.text}>אופן התשלום</Text>
        <Text style={styles.text}>{donation.method}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    gap: 3,
  },
  flex: {
    padding: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    direction: "rtl",
  },
  text: {
    ...typography.subheader,
    color: colors.secondary,
    fontSize: 16,
    writingDirection: "ltr",
  },
});
