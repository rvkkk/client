// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   View,
//   FlatList,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import DonorItem from "@/components/DonorItem";
// import { useRouter } from "expo-router";
// import { colors } from "@/styles/colors";
// import { typography } from "@/styles/typography";
// import { globalStyles } from "@/styles/globalStyles";
// import { getUserDonations } from "@/utils/api/donations";
// import { Donation, Donor } from "@/constants/types";
// import DonationItem from "@/components/DonationItem";

// const DonationsListScreen = () => {
//   const [donations, setDonations] = useState<Donation[]>([]);
//   const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     fetchDonations();
//   }, []);

//   const fetchDonations = async () => {
//     try {
//       setLoading(true);
//       const data = await getUserDonations();
//       setDonations(data);
//       setFilteredDonations(data);
//     } catch (err) {
//       setError("שגיאה בקליטת נתוני תרומות");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleSearch = (query: string) => {
//   //   setSearchQuery(query);
//   //   const filtered = donations.filter(
//   //     (donation) =>
//   //       donation.donor?.address.country.includes(query.toLowerCase()) ||
//   //     donation.donor.toLowerCase().includes(query.toLowerCase())
//   //   );
//   //   setFilteredDonors(filtered);
//   // };

//   const renderDonationItem = ( {item} : any) => (
//     <TouchableOpacity
//       style={styles.donorItem}
//       onPress={() => router.push(`/donations/${item.id}`)}
//     >
//       <DonationItem donation={item} />
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return <ActivityIndicator style={{height: "auto", justifyContent: "center"}} size="large" color={colors.primary} />;
//   }

//   if (error) {
//     return <Text style={styles.errorText}>{error}</Text>;
//   }
//   return (
//     <View style={globalStyles.container}>
//       {/* <View style={styles.searchContainer}>
//         <Ionicons
//           name="search"
//           size={24}
//           color="#1976D2"
//           style={styles.searchIcon}
//         />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="חיפוש תורמים..."
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
//       </View> */}//מיונים
//       <FlatList
//         data={filteredDonations}
//         renderItem={renderDonationItem}
//         keyExtractor={(item) => item.id!}
//         refreshing={loading}
//         onRefresh={fetchDonations}
//       />
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => router.push('/donations/add')}
//       >
//         <Ionicons name="add" size={24} color={colors.white} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     margin: 10,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     padding: 10,
//   },
//   donorItem: {
//     backgroundColor: colors.lightGray,
//     padding: 10,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 10,
//     elevation: 2,

//   },
//   donorName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1976D2",
//   },
//   donorAddress: {
//     fontSize: 14,
//     color: "#616161",
//     marginTop: 5,
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     backgroundColor: "#1976D2",
//     padding: 15,
//     borderRadius: 30,
//     elevation: 5,
//   },
//   errorText: {
//     ...typography.body,
//     color: colors.error,
//     textAlign: "center",
//     margin: 20,
//   },
// });

// export default DonationsListScreen;

 

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   filterButton: {
//     padding: 10,
//     backgroundColor: "#007bff",
//     borderRadius: 8,
//   },
//   filterButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
//   listContainer: {
//     marginTop: 20,
//   },
//   modalContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
// });



import React, { useState, useEffect, useCallback } from "react";
import BottomSheet from "@gorhom/bottom-sheet"; // נייבא את ה-bottom sheet
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Animated,
  Platform,
  Share,
  ScrollView,
  Modal,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart, PieChart } from "react-native-chart-kit";
//import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import DonationItem from "@/components/DonationItem";
import { getUserDonations } from "@/utils/api/donations";
import { IDonation } from "@/constants/types";
import { colors } from "@/styles/colors";
import { BlurView } from "expo-blur";

// import AdvancedFilters from './AdvancedFilters';
// import GroupBySelector from './GroupBySelector';

type SortOption = "date" | "donorName" | "donorAddress" | "amount";
type GroupByOption = "none" | "donor" | "month" | "paymentMethod";
type FilterOption = "all" | "date" | "amount";

interface PickerProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const ITEMS_PER_PAGE = 20;

const CustomPicker: React.FC<PickerProps> = ({
  options,
  selectedValue,
  onValueChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const renderOption = ({
    item,
  }: {
    item: { label: string; value: string };
  }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === selectedValue && styles.selectedOption,
      ]}
      onPress={() => {
        onValueChange(item.value);
        setModalVisible(false);
      }}
    >
      <Text
        style={[
          styles.optionText,
          item.value === selectedValue && styles.selectedOptionText,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerButtonText}>
          {selectedOption?.label || "בחר אפשרות מיון"}
        </Text>
        <Ionicons name="chevron-down" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={100} style={styles.blurContainer}>
          <View style={styles.modalView}>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
            />
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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

  const sortOptions = [
    { label: "תאריך", value: "date" },
    { label: "שם תורם", value: "donorName" },
    { label: "כתובת", value: "donorAddress" },
    { label: "סכום", value: "amount" },
  ];

  const router = useRouter();

  useEffect(() => {
    fetchDonations();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // יצירת reference ל-BottomSheet
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // פונקציה שמופעלת לפתיחה וסגירה של ה-bottom sheet
  const handleSheetChanges = useCallback((index: number) => {
    setIsModalVisible(index > -1); // אם המודל פתוח
  }, []);

  // const handleFilter = () => {
  //   console.log("סינון נבחר");
  //   // כאן תוכלי להוסיף את הלוגיקה של הסינון
  //   bottomSheetRef.current?.close(); // סוגרת את המודל אחרי הבחירה
  // };

  // const handleSort = () => {
  //   console.log("מיון נבחר");
  //   // כאן תוכלי להוסיף את הלוגיקה של המיון
  //   bottomSheetRef.current?.close(); // סוגרת את המודל אחרי הבחירה
  // };

  useEffect(() => {
    const typedOption = sortOption as SortOption;
    handleSort(typedOption);
  }, [donations, sortOption, sortDirection, dateRange, amountRange, groupBy]);

  useEffect(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedDonations(filteredDonations.slice(start, end));
  }, [filteredDonations, page]);

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
      console.log(data);
      setFilteredDonations(data);
    } catch (err) {
      setError("שגיאה בקליטת נתוני תרומות");
    } finally {
      setLoading(false);
    }
  };

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
              return `${street.toLowerCase()} ${building.toLowerCase()} ${
                donation.donorType === "תורם" ? apartment : ""
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
    // if (groupOption !== 'none') {
    //   const grouped = groupDonations(sorted);
    //   setFilteredDonations(grouped);
    // } else {
    //   setFilteredDonations(sorted);
    // }
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

  // const groupDonations = (donations: Donation[]): Donation[] => {
  //   if (groupOption === 'none') return donations;

  //   const groupedMap = donations.reduce((acc, donation) => {
  //     let key: string;
  //     switch (groupOption) {
  //       case 'donor':
  //         key = donation.donor?.fullName || 'Unknown';
  //         break;
  //       case 'month':
  //         key = new Date(donation.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
  //         break;
  //       case 'paymentMethod':
  //         key = donation.paymentMethod || 'Unknown';
  //         break;
  //       default:
  //         key = 'Unknown';
  //     }

  //     if (!acc.has(key)) {
  //       acc.set(key, { ...donation, groupTotal: donation.amount });
  //     } else {
  //       const existing = acc.get(key)!;
  //       existing.groupTotal += donation.amount;
  //       acc.set(key, existing);
  //     }

  //     return acc;
  //   }, new Map<string, Donation & { groupTotal: number }>());

  //   return Array.from(groupedMap.values());
  // };

  const exportToCSV = async () => {
    const header = "Date,Donor,Amount,Payment Method\n";
    const csvContent = filteredDonations.reduce((acc, donation) => {
      return (
        acc +
        `${donation.createdAt},${donation.donor?.fullName},${donation.amount},${donation.method}\n`
      );
    }, header);

    const filePath = `${FileSystem.documentDirectory}donations.csv`;
    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      alert("Sharing is not available on your platform");
    }
  };

  // const renderDonationItem = useCallback(({ item }: { item: Donation }) => (
  //   <TouchableOpacity
  //     style={styles.donorItem}
  //     onPress={() => router.push(`/donations/${item.id}`)}
  //   >
  //     <DonationItem donation={item} />
  //   </TouchableOpacity>
  // ), []);

  const renderDonationItem = useCallback(
    ({ item }: { item: IDonation }) => (
      <Animated.View style={{ transform: [{ translateX: sortAnimation }] }}>
        <TouchableOpacity
          style={styles.donorItem}
          onPress={() => router.push(`/donations/${item._id}`)}
        >
          <DonationItem donation={item} donor={true} groupOption={groupBy} />
        </TouchableOpacity>
      </Animated.View>
    ),
    []
  );

  // const renderCharts = () => {
  //   const paymentMethodData = filteredDonations.reduce((acc, donation) => {
  //     const method = donation.paymentMethod || 'Unknown';
  //     acc[method] = (acc[method] || 0) + donation.amount;
  //     return acc;
  //   }, {} as { [key: string]: number });

  //   const chartData = Object.entries(paymentMethodData).map(([name, amount], index) => ({
  //     name,
  //     amount,
  //     color: `hsl(${index * 137.5 % 360}, 70%, 50%)`,
  //     legendFontColor: "#7F7F7F",
  //     legendFontSize: 15
  //   }));

  //   return (
  //     <View style={styles.chartContainer}>
  //       <Text style={styles.chartTitle}>תרומות לפי שיטת תשלום</Text>
  //       <PieChart
  //         data={chartData}
  //         width={300}
  //         height={200}
  //         chartConfig={{
  //           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  //         }}
  //         accessor="amount"
  //         backgroundColor="transparent"
  //         paddingLeft="15"
  //       />
  //     </View>
  //   );
  // };

  const renderSortButton = (option: SortOption, label: string) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortOption === option && styles.activeSortButton,
      ]}
      onPress={() => handleSort(option)}
    >
      <Animated.Text
        style={[
          styles.sortButtonText,
          { transform: [{ translateX: sortAnimation }] },
        ]}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );

  const renderFilterOptions = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterOption === "all" && styles.activeFilterButton,
        ]}
        onPress={() => setFilterOption("all")}
      >
        <Text style={styles.filterButtonText}>הכל</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterOption === "date" && styles.activeFilterButton,
        ]}
        onPress={() => setFilterOption("date")}
      >
        <Text style={styles.filterButtonText}>תאריך</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterOption === "amount" && styles.activeFilterButton,
        ]}
        onPress={() => setFilterOption("amount")}
      >
        <Text style={styles.filterButtonText}>סכום</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDateFilter = () => (
    <View style={styles.dateFilterContainer}>
      <TouchableOpacity
        onPress={() => {
          setShowDatePicker(true);
          setDatePickerMode("start");
        }}
      >
        <Text>מ: {dateRange.start?.toLocaleDateString()}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShowDatePicker(true);
          setDatePickerMode("end");
        }}
      >
        <Text>עד: {dateRange.end?.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {/* {showDatePicker && (
        <DateTimePicker
          value={
            datePickerMode === "start" && dateRange.start
              ? dateRange.start
              : datePickerMode === "end" && dateRange.end
              ? dateRange.end
              : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              if (datePickerMode === "start") {
                setDateRange({ ...dateRange, start: selectedDate });
              } else {
                setDateRange({ ...dateRange, end: selectedDate });
              }
            }
          }}
        />
      )} */}
    </View>
  );

  const renderAmountFilter = () => (
    <View style={styles.amountFilterContainer}>
      <TextInput
        style={styles.amountInput}
        placeholder="סכום מינימלי"
        value={amountRange.min.toString()}
        onChangeText={(e) =>
          setAmountRange({ ...amountRange, min: Number.parseInt(e) })
        }
        keyboardType="numeric"
      />
      <TextInput
        style={styles.amountInput}
        placeholder="סכום מקסימלי"
        value={amountRange.max.toString()}
        onChangeText={(e) =>
          setAmountRange({ ...amountRange, max: Number.parseInt(e) })
        }
        keyboardType="numeric"
      />
    </View>
  );

  const renderGroupOptions = () => (
    <View style={styles.groupContainer}>
      <TouchableOpacity
        style={[
          styles.groupButton,
          groupBy === "none" && styles.activeGroupButton,
        ]}
        onPress={() => setGroupBy("none")}
      >
        <Text style={styles.groupButtonText}>ללא קיבוץ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.groupButton,
          groupBy === "donor" && styles.activeGroupButton,
        ]}
        onPress={() => setGroupBy("donor")}
      >
        <Text style={styles.groupButtonText}>לפי תורם</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.groupButton,
          groupBy === "month" && styles.activeGroupButton,
        ]}
        onPress={() => setGroupBy("month")}
      >
        <Text style={styles.groupButtonText}>לפי חודש</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.groupButton,
          groupBy === "paymentMethod" && styles.activeGroupButton,
        ]}
        onPress={() => setGroupBy("paymentMethod")}
      >
        <Text style={styles.groupButtonText}>לפי שיטת תשלום</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCharts = () => {
    const paymentMethodData = groupDonations("paymentMethod")
      .filter((donation) => donation.paymentMethod)
      .map((donation) => ({
        name: donation.paymentMethod!,
        amount: donation.groupTotal,
        color: getRandomColor(),
      }));

    const monthlyData = groupDonations("month")
      .filter((donation) => donation.createdAt)
      .map((donation) => ({
        month: new Date(donation.createdAt).toLocaleString("default", {
          month: "short",
        }),
        amount: donation.groupTotal,
      }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );
    return (
      <View style={styles.chartsContainer}>
        <Text style={styles.chartTitle}>התפלגות שיטות תשלום</Text>
        <PieChart
          data={paymentMethodData}
          width={300}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        <Text style={styles.chartTitle}>סך תרומות חודשי</Text>
        <LineChart
          data={{
            labels: monthlyData.map((d) => d.month),
            datasets: [{ data: monthlyData.map((d) => d.amount) }],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
  };

  // if (loading) {
  //   return <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />;
  // }

  // if (error) {
  //   return <Text style={styles.errorText}>{error}</Text>;
  // }

  // return (
  //   <View style={globalStyles.container}>
  //     <View style={styles.searchContainer}>
  //       <Ionicons
  //         name="search"
  //         size={24}
  //         color="#1976D2"
  //         style={styles.searchIcon}
  //       />
  //       <TextInput
  //         style={styles.searchInput}
  //         placeholder="חיפוש תרומות..."
  //         value={searchQuery}
  //         onChangeText={handleSearch}
  //       />
  //       <TouchableOpacity onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}>
  //         <Ionicons name="options" size={24} color="#1976D2" />
  //       </TouchableOpacity>
  //     </View>

  //     {showAdvancedFilters && (
  //       <AdvancedFilters
  //         onApply={handleAdvancedFilters}
  //         initialDateRange={dateRange}
  //         initialAmountRange={amountRange}
  //       />
  //     )}

  //     <GroupBySelector onSelect={handleGroupBy} />

  //     <View style={styles.sortContainer}>
  //       {renderSortButton('date', 'תאריך')}
  //       {renderSortButton('donorName', 'שם תורם')}
  //       {renderSortButton('donorAddress', 'כתובת')}
  //       {renderSortButton('amount', 'סכום')}
  //       <TouchableOpacity style={styles.sortDirectionButton} onPress={toggleSortDirection}>
  //         <Ionicons
  //           name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
  //           size={24}
  //           color={colors.primary}
  //         />
  //       </TouchableOpacity>
  //     </View>

  //     <TouchableOpacity style={styles.chartToggle} onPress={() => setShowChart(!showChart)}>
  //       <Text>{showChart ? 'הסתר תרשים' : 'הצג תרשים'}</Text>
  //     </TouchableOpacity>

  //     {showChart && renderCharts()}

  //     <FlatList
  //       data={displayedDonations}
  //       renderItem={renderDonationItem}
  //       keyExtractor={(item) => item.id!}
  //       onEndReached={handleLoadMore}
  //       onEndReachedThreshold={0.1}
  //       refreshing={loading}
  //       onRefresh={fetchDonations}
  //     />

  //     <TouchableOpacity style={styles.exportButton} onPress={exportToCSV}>
  //       <Text style={styles.exportButtonText}>ייצא ל-CSV</Text>
  //     </TouchableOpacity>

  //     <TouchableOpacity
  //       style={styles.addButton}
  //       onPress={() => router.push('/donations/add')}
  //     >

  const exportToCsv = useCallback(async () => {
    const csvContent = [
      "שם התורם, כתובת התורם, סוג התורם, סכום התרומה, אופן התשלום, תדירות התרומה, מספר חודשים, הערות, תאריך, סטטוס",
      ...filteredDonations.map(
        (d) =>
          `${d.donor?.fullName},${d.donor?.address},${d.amount},${d.method},
        ${d.frequency},${d.numOfMonths},${d.notes},
         ${new Date(d.createdAt!).toLocaleDateString()},`//${d.status},
      ),
    ].join("\n");

    const fileName = `donations_${new Date().toISOString()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (Platform.OS === "android") {
        const contentUri = await FileSystem.getContentUriAsync(filePath);
        await Sharing.shareAsync(contentUri);
      } else {
        await Sharing.shareAsync(filePath);
      }
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
      <Text style={styles.headerTitle}>רשימת תרומות</Text>
      <TouchableOpacity onPress={() => setShowCharts(!showCharts)}>
        <Ionicons
          name={showCharts ? "list" : "bar-chart"}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.exportButton} onPress={exportToCsv}>
        <Text style={styles.exportButtonText}>ייצא ל-CSV</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDonations}>
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }
  // return (
  //   <GestureHandlerRootView style={styles.container}>
  //     <View style={styles.header}>
  //       <Text style={styles.title}>תרומות</Text>
  //       {/* כפתור שמציג את המודל */}
  //       <TouchableOpacity
  //         style={styles.filterButton}
  //         onPress={() => bottomSheetRef.current?.expand()}
  //       >
  //         <Text style={styles.filterButtonText}>דרכי סינון ומיון</Text>
  //       </TouchableOpacity>
  //     </View>

  //     {/* כאן יוצגו התרומות */}
  //     <View style={styles.container}>
  //       {/* הצגת רשימה של התרומות */}
        
  //     </View>

  //     {/* ה-BottomSheet עצמו */}
  //     <BottomSheet
  //       ref={bottomSheetRef}
  //       index={-1} // מצב התחלתי, סגור
  //       snapPoints={["50%", "100%"]} // גובה המודל – 50% ומלא
  //       onChange={handleSheetChanges}
  //     >
  //       <View style={styles.modalContent}>
  //         <Text style={styles.modalTitle}>סינון ומיון</Text>
  //         <Button title="סינון" onPress={handleFilter} />
  //         <Button title="מיון" onPress={handleSort} />
  //       </View>
  //     </BottomSheet>
  //   </GestureHandlerRootView>
  // );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {/* <TextInput
        style={styles.searchInput}
        placeholder="חפש לפי שם תורם או כתובת"
        value={searchQuery}
        onChangeText={handleSearch}
      /> */}
      
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#1976D2"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="חפש לפי שם תורם, כתובת או סכום תרומה"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Ionicons name="options" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>
      {/* {renderSortButton("date", "תאריך")}
      {renderSortButton("donorName", "שם תורם")}
      {renderSortButton("donorAddress", "כתובת")}
      {renderSortButton("amount", "סכום")}
      <TouchableOpacity
        style={styles.sortDirectionButton}
        onPress={toggleSortDirection}
      >
        <Ionicons
          name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity> */}
      <View style={styles.sortContainer}>
        <CustomPicker
          options={sortOptions}
          selectedValue={sortOption!}
          onValueChange={handleSort}
        />
        <TouchableOpacity
          style={styles.sortDirectionButton}
          onPress={toggleSortDirection}
        >
          <Ionicons
            name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
      {renderFilterOptions()}
      {filterOption === "date" && renderDateFilter()}
      {filterOption === "amount" && renderAmountFilter()}
      {renderGroupOptions()}
      {showCharts ? (
        renderCharts()
      ) : (
        <FlatList
          data={displayedDonations}
          renderItem={renderDonationItem}
          keyExtractor={(item) => item._id!}
          //onEndReached={() => setPage((prevPage) => prevPage + 1)}
          //onEndReachedThreshold={0.1}
          //ListFooterComponent={renderFooter}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  // searchInput: {
  //   height: 40,
  //   borderColor: colors.accent,
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   paddingHorizontal: 8,
  //   marginBottom: 16,
  // },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  donorItem: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
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
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default DonationsListScreen;
