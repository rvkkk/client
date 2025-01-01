import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { globalStyles } from "@/styles/globalStyles";
import Loading from "@/components/Loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "@/components/SearchBar";
import { ISynagogue } from "@/constants/types";
import { getUserSenagogues } from "@/utils/api/synagogues";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import SynagogueItem from "@/components/SynagogueItem";
import ErrorMessage from "@/components/ErrorMessage";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { typography } from "@/styles/typography";
import Link from "@/components/Link";

const SynagoguesListScreen = () => {
  const { top: safeTop } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [synagogues, setSynagogues] = useState<ISynagogue[]>([]);
  const [filteredSynagogues, setFilteredSynagogues] = useState<ISynagogue[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [sortAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchSynagogues();
  }, []);

  const fetchSynagogues = async () => {
    try {
      setIsLoading(true);
      const data = await getUserSenagogues();
      console.log(data);
      setSynagogues(data);
      setFilteredSynagogues(data);
    } catch (err) {
      setError("שגיאה בקליטת נתוני בתי כנסת");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCsv = useCallback(async () => {
    const BOM = "\uFEFF";

    const csvContent = [
      BOM,
      "שם בית הכנסת, כתובת, השתייכות, ממוצע תרומות",
      ...synagogues.map(
        (s) =>
          `${s.fullName},${s.address},${s.affiliation},${s.averageDonations}`
      ),
    ].join("\n");

    const fileName = `רשימת בתי כנסת ${new Date().toLocaleDateString()}.csv`;
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
  }, [synagogues]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = synagogues.filter((synagogue) => {
      const address = synagogue.address;
      return (
        synagogue.fullName.toLowerCase().includes(query.toLowerCase()) ||
        `${address?.street.toLowerCase()} ${address?.building
          .toString()
          .toLowerCase()}, ${address?.city.toLowerCase()} ${address?.country.toLowerCase()}`.includes(
          query.toLowerCase()
        )
      );
    });
    setFilteredSynagogues(filtered);
  };

  const animateSort = () => {
    Animated.sequence([
      Animated.timing(sortAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sortAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sortAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderSynagogueItem = useCallback(
    ({ item }: { item: ISynagogue }) => (
      <Animated.View style={{ transform: [{ translateX: sortAnimation }] }}>
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() => router.push(`/synagogues/${item._id}`)}
        >
          <SynagogueItem synagogue={item} />
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

  if (isLoading) return <Loading size={"large"} />;
  if (error)
    return <ErrorMessage error={error} handleFetch={fetchSynagogues} />;

  if (synagogues.length == 0)
    return (
      <NativeViewGestureHandler>
        <View style={[globalStyles.container, { justifyContent: "center" }]}>
          <Text style={typography.errorText}>
            עדיין לא הוספת בתי כנסת למערכת
          </Text>
          <Link href={"/donations/add"} text={"אנא הוסף בית כנסת חדש"} />
        </View>
      </NativeViewGestureHandler>
    );

  if (filteredSynagogues.length == 0)
    return (
      <View style={[globalStyles.container, { justifyContent: "center" }]}>
        <Text style={typography.errorText}>
          לא קיימים נתוני בתי כנסת מתאימים
        </Text>
      </View>
    );

  return (
    <FlatList
      style={globalStyles.scrollContainer}
      data={filteredSynagogues}
      renderItem={renderSynagogueItem}
      keyExtractor={(item) => item._id!}
      //onEndReached={() => setPage((prevPage) => prevPage + 1)}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      refreshing={isLoading}
      onRefresh={fetchSynagogues}
      ListHeaderComponent={
        <SearchBar
          placeHolder="חפש לפי שם או כתובת"
          handleSearch={handleSearch}
          handleSave={setSearchQuery}
          searchQuery={searchQuery}
        />
      }
    />
  );
};

export default SynagoguesListScreen;

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
