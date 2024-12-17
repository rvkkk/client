import { globalStyles } from "@/styles/globalStyles";
import { typography } from "@/styles/typography";
import { Link, router, Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "אופסססס!" }} />
      <View style={[globalStyles.container, { justifyContent: "center" }]}>
        <Text style={[typography.subheader]}>דף זה אינו קיים</Text>
        <TouchableOpacity
          style={styles.link}
          onPress={() => router.replace("/drawer")}
        >
          <Text style={typography.linkText}>חזור לדף הראשי</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
