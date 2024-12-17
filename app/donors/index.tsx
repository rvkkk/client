import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserDonors } from "@/utils/api/donors";
import DonorItem from "@/components/DonorItem";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { colors } from "@/styles/colors";
import { globalStyles } from "@/styles/globalStyles";
import { IDonor } from "@/constants/types";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import SearchBar from "@/components/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { typography } from "@/styles/typography";
import Link from "@/components/Link";

const DonorListScreen = () => {
  const [donors, setDonors] = useState<IDonor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<IDonor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortAnimation] = useState(new Animated.Value(0));
  const router = useRouter();
  const { top: safeTop } = useSafeAreaInsets();

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const data = await getUserDonors();
      setDonors(data);
      setFilteredDonors(data);
    } catch (err) {
      setError("שגיאה בקליטת נתוני תורמים");
    } finally {
      setLoading(false);
    }
  };

  const exportToCsv = useCallback(async () => {
    const BOM = "\uFEFF";

    const csvContent = [
      BOM,
      "שם התורם, כתובת, אימייל, מספר פלאפון, מין, גיל, מצב משפחתי, השתייכות, ממוצע תרומות",
      ...donors.map(
        (d) =>
          `${d.firstName + " " + d.lastName},${d.address.street + " " + d.address.building
         + " " + d.address.apartment && ("/" + d.address.apartment) + " " + d.address.city + " " + d.address.country},${d.email.toLowerCase()},${
            d.phoneNumber
          },${d.gender},${d.age && d.age},${d.familyStatus},${d.affiliation},${
            d.averageDonations
          },`
      ),
    ].join("\n");

    const fileName = `רשימת תורמים ${new Date().toLocaleDateString()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(filePath);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      Alert.alert("שגיאה בייצוא הקובץ");
    }
  }, [donors]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = donors.filter((donor) => {
      const address = donor.address;
      return (
        `${donor.firstName.toLowerCase()} ${donor.lastName.toLowerCase()}`.includes(
          query.toLowerCase()
        ) ||
        `${address?.street.toLowerCase()} ${address?.building
          .toString()
          .toLowerCase()} ${
          address?.apartment
        }, ${address?.city.toLowerCase()} ${address?.country.toLowerCase()}`.includes(
          query.toLowerCase()
        )
      );
    });
    setFilteredDonors(filtered);
  };

  const renderDonorItem = useCallback(
    ({ item }: { item: IDonor }) => (
      <Animated.View style={{ transform: [{ translateX: sortAnimation }] }}>
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() => router.push(`/donors/${item._id}`)}
        >
          <DonorItem donor={item} />
        </TouchableOpacity>
      </Animated.View>
    ),
    []
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.exportButton} onPress={exportToCsv}>
        <Text style={styles.exportButtonText}>ייצא ל-CSV</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <Loading size={"large"} />;
  if (error) return <ErrorMessage error={error} handleFetch={fetchDonors} />;

  if (donors.length == 0)
    return (
      <NativeViewGestureHandler>
        <View style={[globalStyles.container, { justifyContent: "center" }]}>
          <Text style={typography.errorText}>עדיין לא הוספת תורמים למערכת</Text>
          <Link href={"/donations/add"} text={"אנא הוסף תורם חדש"} />
        </View>
      </NativeViewGestureHandler>
    );

  if (filteredDonors.length == 0)
    return (
      <View style={[globalStyles.container, { justifyContent: "center" }]}>
        <Text style={typography.errorText}>לא קיימים נתוני תרומות מתאימים</Text>
      </View>
    );

  return (
    <FlatList
      style={globalStyles.scrollContainer}
      data={filteredDonors}
      renderItem={renderDonorItem}
      keyExtractor={(item) => item._id!}
      //onEndReached={() => setPage((prevPage) => prevPage + 1)}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      refreshing={loading}
      onRefresh={fetchDonors}
      ListHeaderComponent={
        <SearchBar
          placeHolder="חפש לפי שם או כתובת"
          handleSearch={handleSearch}
          handleSave={handleSearch}
          searchQuery={searchQuery}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  exportButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
});

export default DonorListScreen;
