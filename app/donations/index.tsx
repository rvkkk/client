import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { IDonation } from "@/constants/types";
import { Link, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getUserDonations } from "@/utils/api/donations";
import DonationItem from "@/components/DonationItem";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "@/styles/globalStyles";
import SearchBar from "@/components/SearchBar";
import { typography } from "@/styles/typography";
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomBottomSheet from "@/components/BottomSheet"
import Button from "@/components/Button";
//import butt from 'react-native-paper';
import DateTimePicker from "@react-native-community/datetimepicker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomerLink from "@/components/Link";
// import Animated, { useAnimatedRef, useScrollViewOffset } from "react-native-reanimated";

type SortOption = "date" | "donorName" | "donorAddress" | "amount";
type GroupByOption = "none" | "donor" | "month" | "paymentMethod";
type FilterOption = "all" | "date" | "amount";

const DonationsListScreen = () => {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<IDonation[]>([]);
  const [displayedDonations, setDisplayedDonations] = useState<IDonation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [page, setPage] = useState(1);
  //const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: null | Date;
    end: null | Date;
  }>({ start: null, end: null });
  const [amountRange, setAmountRange] = useState({ min: 0, max: 0 });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end">(
    "start"
  );
  const [showCharts, setShowCharts] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupByOption>("none");
  const [sortAnimation] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [startDate, setStartDate] = useState<Date>(new Date());
  // const [endDate, setEndDate] = useState<Date>(new Date());
  //const [amountRange, setAmountRange] = useState<number[]>([0, 10000]);
  const [sortField, setSortField] = useState<keyof IDonation>("createdAt");

  const sortOptions = [
    { label: "תאריך", value: "date" },
    { label: "שם תורם", value: "donorName" },
    { label: "כתובת", value: "donorAddress" },
    { label: "סכום", value: "amount" },
  ];

  const ITEMS_PER_PAGE = 20;
  const router = useRouter();

  useEffect(() => {
    fetchDonations();
    sortBottomSheetRef.current?.present()
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      let data: IDonation[];

      // const cachedData = await AsyncStorage.getItem("cachedDonations");
      // if (cachedData) {
      //   data = JSON.parse(cachedData);
      // } else {
      data = await getUserDonations();
      //   await AsyncStorage.setItem("cachedDonations", JSON.stringify(data));
      // }
      setDonations(data);
      setFilteredDonations(data);
    } catch (err) {
      setError("שגיאה בקליטת נתוני תרומות");
    } finally {
      setLoading(false);
    }
  };

  const filterBottomSheetRef = useRef<BottomSheetModal>(null);
  const sortBottomSheetRef = useRef<BottomSheetModal>(null);

  // // Snap points for bottom sheets
  // const filterSnapPoints = useMemo(() => ["50%", "75%"], []);
  // const sortSnapPoints = useMemo(() => ["40%"], []);

  // Filtered and sorted donations
  // const processedDonations = useMemo(() => {
  //   return donations
  //     .filter((donation) => {
  //       const donationDate = new Date(donation.createdAt);
  //       const meetsDateCriteria =
  //         donationDate >= startDate && donationDate <= endDate;

  //       const meetsAmountCriteria =
  //         donation.amount >= amountRange.min &&
  //         donation.amount <= amountRange.max

  //       return meetsDateCriteria && meetsAmountCriteria;
  //     })
  //     .sort((a, b) => {
  //       const valueA = a[sortField];
  //       const valueB = b[sortField];

  //       if (valueA === undefined || valueB === undefined) return 0;

  //       if (typeof valueA === "string" || typeof valueA === "number") {
  //         return sortDirection === "asc"
  //           ? valueA > valueB
  //             ? 1
  //             : -1
  //           : valueA < valueB
  //           ? 1
  //           : -1;
  //       }

  //       // For dates
  //       if (valueA instanceof Date && valueB instanceof Date) {
  //         return sortDirection === "asc"
  //           ? valueA.getTime() - valueB.getTime()
  //           : valueB.getTime() - valueA.getTime();
  //       }

  //       return 0;
  //     });
  // }, [donations, startDate, endDate, amountRange, sortField, sortDirection]);

  //const bottomSheetRef = React.useRef<BottomSheet>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterDonations(query, dateRange, amountRange);
  };

  const filterDonations = (
    query: string,
    dates: { start: Date | null; end: Date | null },
    amounts: { min: number; max: number }
  ) => {
    const filtered = donations.filter((donation) => {
      const address = donation.donor?.address;
      const matchesQuery =
        `${address?.street.toLowerCase()} ${address?.building
          .toString()
          .toLowerCase()} ${
          donation.donorType == "תורם" && address?.apartment
        }, ${address?.city.toLowerCase()} ${address?.country.toLowerCase()}`.includes(
          query.toLowerCase()
        ) ||
        donation.donor?.fullName?.toLowerCase().includes(query.toLowerCase()) ||
        donation.amount.toString().includes(query);

      const matchesDate =
        (!dates.start || new Date(donation.createdAt!) >= dates.start) &&
        (!dates.end || new Date(donation.createdAt!) <= dates.end);

      const matchesAmount =
        (!amounts.min || donation.amount >= amounts.min) &&
        (!amounts.max || donation.amount <= amounts.max);

      return matchesQuery && matchesDate && matchesAmount;
    });

    setFilteredDonations(filtered);
    setPage(1);
  };

  const handleSort = (option: string) => {
    const typedOption = option as SortOption;
    setSortOption(typedOption);
    const sorted = [...filteredDonations].sort(
      (a: IDonation, b: IDonation): number => {
        switch (option) {
          case "date":
            return sortDirection === "asc"
              ? (new Date(a.createdAt!).getTime() || 0) -
                  (new Date(b.createdAt!).getTime() || 0)
              : (new Date(b.createdAt!).getTime() || 0) -
                  (new Date(a.createdAt!).getTime() || 0);
          case "donorName":
            return sortDirection === "asc"
              ? (a.donor?.fullName || "").localeCompare(b.donor?.fullName || "")
              : (b.donor?.fullName || "").localeCompare(
                  a.donor?.fullName || ""
                );
          case "donorAddress":
            const getFullAddress = (donation: IDonation): string => {
              const {
                street = "",
                building = "",
                apartment = "",
                city = "",
                country = "",
              } = donation.donor?.address || {};
              return `${street.toLowerCase()} ${building.toLowerCase()}${
                " " + apartment
              }, ${city.toLowerCase()} ${country.toLowerCase()}`.trim();
            };
            const addressA = getFullAddress(a);
            const addressB = getFullAddress(b);
            return sortDirection === "asc"
              ? addressA.localeCompare(addressB)
              : addressB.localeCompare(addressA);
          case "amount":
            return sortDirection === "asc"
              ? (a.amount || 0) - (b.amount || 0)
              : (b.amount || 0) - (a.amount || 0);
          default:
            return 0;
        }
      }
    );
    setFilteredDonations(sorted);
    animateSort();
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    animateSort();
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

  // פונקציה שמופעלת לפתיחה וסגירה של ה-bottom sheet
  // const handleSheetChanges = useCallback((index: number) => {
  //   setIsModalVisible(index > -1); // אם המודל פתוח
  // }, []);

  useEffect(() => {
    const typedOption = sortOption as SortOption;
    handleSort(typedOption);
  }, [donations, sortOption, sortDirection]); //dateRange, amountRange, groupBy

  useEffect(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedDonations(filteredDonations.slice(start, end));
  }, [filteredDonations, page]);

  const handleLoadMore = () => {
    if (page * ITEMS_PER_PAGE < filteredDonations.length) {
      setPage(page + 1);
    }
  };

  const handleAdvancedFilters = (
    dates: { start: Date | null; end: Date | null },
    amounts: { min: number; max: number }
  ) => {
    setDateRange(dates);
    setAmountRange(amounts);
    filterDonations(searchQuery, dates, amounts);
  };

  const handleGroupBy = (option: GroupByOption) => {
    setGroupBy(option);
    if (option === "none") {
      setFilteredDonations(donations);
    } else {
      const grouped = groupDonations(option);
      setFilteredDonations(grouped);
    }
    setPage(1);
  };

  const groupDonations = (option: GroupByOption): any[] => {
    const groups: { [key: string]: IDonation[] } = {};
    donations.forEach((donation) => {
      let key;
      switch (option) {
        case "donor":
          key = donation.donor?.fullName || "Unknown";
          break;
        case "month":
          key = new Date(donation.createdAt!).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          break;
        case "paymentMethod":
          key = donation.method || "Unknown";
          break;
        default:
          key = "all";
      }
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(donation);
    });

    return Object.entries(groups).map(([key, groupDonations]) => ({
      id: key,
      amount: groupDonations.reduce((sum, d) => sum + d.amount, 0),
      donor: { fullName: key },
      createdAt: groupDonations[0].createdAt,
      method: key,
      isGrouped: true,
      groupedDonations: groupDonations,
    }));
  };

  const renderDonationItem = useCallback(
    ({ item }: { item: IDonation }) => (
      <Animated.View style={{ transform: [{ translateX: sortAnimation }] }}>
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() => router.push(`/donations/${item._id}`)}
        >
          <DonationItem donation={item} donor={true} />
        </TouchableOpacity>
      </Animated.View>
    ),
    []
  );

  const exportToCsv = useCallback(async () => {
    const BOM = "\uFEFF";

    const csvContent = [
      BOM,
      "שם התורם, כתובת התורם, סוג התורם, סכום התרומה, אופן התשלום, תדירות התרומה, מספר חודשים, הערות, תאריך",
      ...filteredDonations.map(
        (d) =>
          `${d.donor?.fullName},${
            d.donor?.address.street +
              " " +
              d.donor?.address.building +
              " " +
              d.donor?.address.apartment &&
            "/" +
              d.donor?.address.apartment +
              " " +
              d.donor?.address.city +
              " " +
              d.donor?.address.country
          },${d.donorType},${d.amount},${d.method},
        ${d.frequency},${d.numOfMonths},${d.notes},
         ${new Date(d.createdAt!).toLocaleDateString()},`
      ),
    ].join("\n");

    const fileName = `רשימת תרומות ${new Date().toLocaleDateString()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(filePath);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError("שגיאה בייצוא הקובץ");
    }
  }, [filteredDonations]);

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={typography.header}>
        {showCharts ? "גרפים וסכמאות" : "רשימת תרומות"}
      </Text>
      <TouchableOpacity
        style={styles.headerIcon}
        onPress={() => setShowCharts(!showCharts)}
      >
        <Ionicons
          style={{ display: "flex" }}
          name={showCharts ? "list" : "bar-chart"}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderSortDirection = () => {
    <View>
      <TouchableOpacity
        style={styles.sortDirectionButton}
        onPress={toggleSortDirection}
      >
        <Text style={typography.subheader}>סדר המיון</Text>
        <Ionicons
          name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>;
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.exportButton} onPress={exportToCsv}>
        <Text style={styles.exportButtonText}>ייצא ל-CSV</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <Loading size={"large"} />;

  if (error) return <ErrorMessage error={error} handleFetch={fetchDonations} />;

  if (donations.length == 0)
    return (
      <NativeViewGestureHandler>
        <View style={[globalStyles.container, { justifyContent: "center" }]}>
          <Text style={typography.errorText}>עדיין לא הוספת תרומות למערכת</Text>
          <TouchableOpacity onPress={() => {router.push("/donations/add")}}>
          <Text style={typography.linkText}>אנא הוסף תרומה חדשה</Text>
        </TouchableOpacity>
        </View>
      </NativeViewGestureHandler>
    );

  if (filteredDonations.length == 0)
    return (
      <View style={[globalStyles.container, { justifyContent: "center" }]}>
        <Text style={typography.errorText}>לא קיימים נתוני תרומות מתאימים</Text>
      </View>
    );

  return (
    <GestureHandlerRootView style={globalStyles.scrollContainer}>
      <FlatList
        data={filteredDonations}
        renderItem={renderDonationItem}
        keyExtractor={(item) => item._id!}
        //onEndReached={() => setPage((prevPage) => prevPage + 1)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshing={loading}
        onRefresh={fetchDonations}
        ListHeaderComponent={
          <>
            {renderHeader()}
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => sortBottomSheetRef.current!.expand()}
            >
              <Text style={styles.filterButtonText}>דרכי סינון ומיון</Text>
            </TouchableOpacity>
            <SearchBar
              placeHolder="חפש לפי שם או כתובת"
              handleSearch={handleSearch}
              handleSave={handleSearch}
              searchQuery={searchQuery}
            />
          </>
        }
      />
      <CustomBottomSheet ref={sortBottomSheetRef}>
        <View style={styles.modalContent}>
          <Text style={typography.subheader}>סינון ומיון</Text>
          {/* Date Range Picker */}
          <View style={styles.datePickerContainer}>
            <Text>תאריך התחלה</Text>
            <DateTimePicker
              value={dateRange.start || new Date()}
              mode="date"
              onChange={(event, selectedDate) =>
                setDateRange({
                  ...dateRange,
                  start: selectedDate || new Date(),
                })
              }
            />

            <Text>תאריך סיום</Text>
            <DateTimePicker
              value={dateRange.end || new Date()}
              mode="date"
              onChange={(event, selectedDate) =>
                setDateRange({
                  ...dateRange,
                  start: selectedDate || new Date(),
                })
              }
            />
          </View>

          {/* Amount Range Slider */}
          <View style={styles.sliderContainer}>
            <Text>
              טווח סכומים: {amountRange.min} - {amountRange.max} ₪
            </Text>
            <MultiSlider
              values={[amountRange.min, amountRange.max]}
              sliderLength={300}
              onValuesChange={(values: number[]) =>
                setAmountRange({ min: values[0], max: values[1] })
              }
              min={0}
              max={10000}
              step={10}
            />
          </View>

          {/* <Button
              mode="contained"
              title=""
              handlePress={() => filterBottomSheetRef.current?.close()}
            >
              אישור
            </Button> */}
          <Button
            title="סינון"
            handlePress={() =>
              filterDonations(searchQuery, dateRange, amountRange)
            }
          />
          {/* <Button title="מיון" handlePress={() => handleSort} /> */}
          <Text style={styles.bottomSheetTitle}>מיון תרומות</Text>

          {/* Sort Field */}
          <View style={styles.sortContainer}>
            <Text>שדה מיון</Text>
            <View style={styles.buttonGroup}>
              <BottomSheetFlashList data={sortOptions}></BottomSheetFlashList>
              {/* <Button
      mode={sortField === "createdAt" ? "contained" : "outlined"}
      onPress={() => setSortField("createdAt")}
    >
      תאריך
    </Button>
    <Button
      mode={sortField === "amount" ? "contained" : "outlined"}
      onPress={() => setSortField("amount")}
    >
      סכום
    </Button> */}
            </View>
          </View>

          {/* Sort Direction */}
          <View style={styles.sortContainer}>
            <Text>כיוון מיון</Text>
            <View style={styles.buttonGroup}>
              <Button
                title="מהנמוך לגבוה"
                //mode={sortDirection === "asc" ? "contained" : "outlined"}
                handlePress={() => setSortDirection("asc")}
              />
              <Button
                //mode={sortDirection === "desc" ? "contained" : "outlined"}
                title="מהגבוה לנמוך"
                handlePress={() => setSortDirection("desc")}
              />
            </View>
          </View>
        </View>
      </CustomBottomSheet>
    </GestureHandlerRootView>
  );
};
// return (
//   <BottomSheetModalProvider>
//     <View style={styles.container}>
//       {/* Filtering and Sorting Controls */}
//       <View style={styles.controlContainer}>
//         <Button
//           mode="contained"
//           onPress={() => filterBottomSheetRef.current?.expand()}
//         >
//           סינון
//         </Button>
//         <Button
//           mode="contained"
//           onPress={() => sortBottomSheetRef.current?.expand()}
//         >
//           מיון
//         </Button>
//       </View>

//       {/* Donations List */}
//       {/* <FlatList
//         data={processedDonations}
//         renderItem={renderDonationItem}
//         keyExtractor={(item) => item._id}
//       /> */}
//        <FlatList
//         data={processedDonations}
//         renderItem={renderDonationItem}
//         keyExtractor={(item) => item._id!}
//         onEndReached={() => setPage((prevPage) => prevPage + 1)}
//         onEndReachedThreshold={0.1}
//         ListFooterComponent={renderFooter}
//         refreshing={loading}
//         onRefresh={fetchDonations}
//         ListHeaderComponent={
//           <>
//             {renderHeader()}
//             <TouchableOpacity
//               style={styles.filterButton}
//               onPress={() => filterBottomSheetRef.current?.expand()}
//             >
//               <Text style={styles.filterButtonText}>דרכי סינון ומיון</Text>
//             </TouchableOpacity>
//             <SearchBar
//               placeHolder="חפש לפי שם או כתובת"
//               handleSearch={handleSearch}
//               handleSave={handleSearch}
//               searchQuery={searchQuery}
//             />
//           </>
//         }
//       />

//       {/* Filter Bottom Sheet */}
//       <BottomSheet
//         ref={filterBottomSheetRef}
//         index={-1}
//         snapPoints={filterSnapPoints}
//         enablePanDownToClose
//       >
//         <BottomSheetView style={styles.bottomSheetContent}>
//           <Text style={styles.bottomSheetTitle}>סינון תרומות</Text>

//           {/* Date Range Picker */}
//           <View style={styles.datePickerContainer}>
//             <Text>תאריך התחלה</Text>
//             <DateTimePicker
//               value={startDate}
//               mode="date"
//               onChange={(event, selectedDate) =>
//                 setStartDate(selectedDate || new Date())
//               }
//             />

//             <Text>תאריך סיום</Text>
//             <DateTimePicker
//               value={endDate}
//               mode="date"
//               onChange={(event, selectedDate) =>
//                 setEndDate(selectedDate || new Date())
//               }
//             />
//           </View>

//           {/* Amount Range Slider */}
//           <View style={styles.sliderContainer}>
//             <Text>
//               טווח סכומים: {amountRange[0]} - {amountRange[1]} ₪
//             </Text>
//             <MultiSlider
//               values={amountRange}
//               sliderLength={300}
//               onValuesChange={setAmountRange}
//               min={0}
//               max={10000}
//               step={10}
//             />
//           </View>

//           <Button
//             mode="contained"
//             onPress={() => filterBottomSheetRef.current?.close()}
//           >
//             אישור
//           </Button>
//         </BottomSheetView>
//       </BottomSheet>

//       {/* Sort Bottom Sheet */}
//       <BottomSheet
//         ref={sortBottomSheetRef}
//         index={-1}
//         snapPoints={sortSnapPoints}
//         enablePanDownToClose
//       >
//         <BottomSheetView style={styles.bottomSheetContent}>
//           <Text style={styles.bottomSheetTitle}>מיון תרומות</Text>

//           {/* Sort Field */}
//           <View style={styles.sortContainer}>
//             <Text>שדה מיון</Text>
//             <View style={styles.buttonGroup}>
//               <Button
//                 mode={sortField === "createdAt" ? "contained" : "outlined"}
//                 onPress={() => setSortField("createdAt")}
//               >
//                 תאריך
//               </Button>
//               <Button
//                 mode={sortField === "amount" ? "contained" : "outlined"}
//                 onPress={() => setSortField("amount")}
//               >
//                 סכום
//               </Button>
//             </View>
//           </View>

//           {/* Sort Direction */}
//           <View style={styles.sortContainer}>
//             <Text>כיוון מיון</Text>
//             <View style={styles.buttonGroup}>
//               <Button
//                 mode={sortDirection === "asc" ? "contained" : "outlined"}
//                 onPress={() => setSortDirection("asc")}
//               >
//                 מהנמוך לגבוה
//               </Button>
//               <Button
//                 mode={sortDirection === "desc" ? "contained" : "outlined"}
//                 onPress={() => setSortDirection("desc")}
//               >
//                 מהגבוה לנמוך
//               </Button>
//             </View>
//           </View>

//           <Button
//             mode="contained"
//             onPress={() => sortBottomSheetRef.current?.close()}
//           >
//             אישור
//           </Button>
//         </BottomSheetView>
//       </BottomSheet>
//     </View>
//   </BottomSheetModalProvider>
// );
// };

export default DonationsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background,
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  donationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bottomSheetContent: {
    padding: 20,
    alignItems: "center",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  datePickerContainer: {
    width: "100%",
    marginBottom: 20,
  },
  sliderContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  sortContainer: {
    width: "100%",
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  // });

  // const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 16,
  //   backgroundColor: colors.background,
  // },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    alignItems: "flex-start",
  },
  modalContent: {
    width: 200,
    backgroundColor: "black",
  },

  donorItem: {
    marginBottom: 10,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: colors.primary,
  },
  sortButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  sortDirectionButton: {
    padding: 8,
    flexDirection: "row",
    gap: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.secondary,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  dateFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  amountFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    height: 40,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  groupContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  groupButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    marginBottom: 8,
  },
  activeGroupButton: {
    backgroundColor: colors.primary,
  },
  groupButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  chartsContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  selectedOption: {
    backgroundColor: colors.secondary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  // sortContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
});
