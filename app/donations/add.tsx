import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  FlatList,
  Animated,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { createDonation } from "@/utils/api/donations";
import { colors } from "@/styles/colors";
import DonorDetailsScreen from "@/app/donors/add";
import { typography } from "@/styles/typography";
import Input from "@/components/Input";
import {
  DonorPost,
  IDonor,
  ISynagogue,
  SynagoguePost,
} from "@/constants/types";
import { router, useLocalSearchParams } from "expo-router";
import SynagogueDetailsScreen from "@/app/synagogues/add";
import getCoordinatesFromAddress from "@/hooks/useAddressLocation";
import SearchBar from "@/components/SearchBar";
import { getUserDonors } from "@/utils/api/donors";
import { getUserSenagogues } from "@/utils/api/synagogues";
import SynagogueItem from "@/components/SynagogueItem";
import DonorItem from "@/components/DonorItem";
import { globalStyles } from "@/styles/globalStyles";
import Button from "@/components/Button";
import PickerSelect from "@/components/PickerSelect";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const donationSchema = z.object({
  amount: z.coerce
    .number()
    .step(0.01, "סכום התרומה חייב להיות עד שני מספרים אחרי הנקודה")
    .min(0.1, "סכום התרומה חייב להיות גדול מ- 0"),
  method: z.string().min(1, "אנא בחר שיטת תשלום"),
  frequency: z.string(),
  numberOfMonth: z.union([
    z.number().int().min(1, "מספר החודשים חייב להיות לפחות 1"),
    z.literal(""),
  ]),
  notes: z.string().optional(),
});

type DonationFormFields = z.infer<typeof donationSchema>;

interface DonorDetailsRef {
  getDonorDetails: () => Promise<DonorPost | null>;
}

interface SynagogueDetailsRef {
  getDonorDetails: () => Promise<SynagoguePost | null>;
}

const AddDonationScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [donorId, setDonorId] = useState(id);
  const [newDonor, setNewDonor] = useState(false);
  const [synagogue, setSynagogue] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [optionalDonors, setOptionalDonors] = useState<(IDonor | ISynagogue)[]>(
    []
  );
  const [donors, setDonors] = useState<IDonor[]>([]);
  const [synagogues, setSynagogues] = useState<ISynagogue[]>([]);
  const [sortAnimation] = useState(new Animated.Value(0));
  const donorDetailsRef = useRef<DonorDetailsRef | null>(null);
  const synagogueDetailsRef = useRef<SynagogueDetailsRef | null>(null);
  const { user, setUser } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormFields>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      method: "",
      frequency: "חד פעמי",
      numberOfMonth: 1,
      notes: "",
    },
  });

  const isRecurring = watch("frequency") === "הוראת קבע";

  const methodItems = [
    { label: "אשראי", value: "אשראי" },
    { label: "העברה", value: "העברה" },
    { label: "צ'ק", value: "צ'ק" },
    { label: "מזומן", value: "מזומן" },
  ];

  const frequencyItems = [
    { label: "חד פעמי", value: "חד פעמי" },
    { label: "הוראת קבע", value: "הוראת קבע" },
  ];

  useEffect(() => {
    if (
      !newDonor &&
      ((synagogue && !synagogues[0]) || (!synagogue && !donors[0]))
    )
      fetchDonors();
    else if (synagogue) setOptionalDonors(synagogues);
    else setOptionalDonors(donors);
  }, [newDonor, synagogue]);

  const fetchDonors = async () => {
    try {
      let data;
      if (synagogue) {
        data = await getUserSenagogues();
        setSynagogues(data);
      } else {
        data = await getUserDonors();
        setDonors(data);
      }
      setOptionalDonors(data.slice(0, 10));
    } catch (err) {}
  };

  const searchOptionalDonors = async (query: string) => {
    setSearchQuery(query);
    let filtered;
    if (synagogue)
      filtered = synagogues.filter((synagogue) => {
        const address = synagogue?.address;
        return (
          `${address?.street.toLowerCase()} ${address?.building
            .toString()
            .toLowerCase()} ${
            !synagogue && address?.apartment
          }, ${address?.city.toLowerCase()} ${address?.country.toLowerCase()}`.includes(
            query.toLowerCase()
          ) || synagogue?.fullName?.toLowerCase().includes(query.toLowerCase())
        );
      });
    else
      filtered = donors.filter((donor) => {
        const address = donor?.address;
        return (
          `${address?.street.toLowerCase()} ${address?.building
            .toString()
            .toLowerCase()} ${
            !synagogue && address?.apartment
          }, ${address?.city.toLowerCase()} ${address?.country.toLowerCase()}`.includes(
            query.toLowerCase()
          ) ||
          `${donor?.firstName} ${donor?.lastName}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      });
    setOptionalDonors(filtered.slice(0, 10));
  };

  const renderDonorItem = useCallback(
    ({ item }: { item: IDonor | ISynagogue }) => (
      <Animated.View style={{ transform: [{ translateX: sortAnimation }] }}>
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() => {
            setDonorId(item._id!),
              setOptionalDonors([item]),
              setSearchQuery("");
          }}
        >
          {synagogue ? (
            <SynagogueItem synagogue={item as ISynagogue} />
          ) : (
            <DonorItem donor={item as IDonor} />
          )}
        </TouchableOpacity>
      </Animated.View>
    ),
    []
  );

  const onSubmit = async (formData: DonationFormFields) => {
    let donorDetails = null;
    if (synagogue) {
      if (newDonor && synagogueDetailsRef.current) {
        donorDetails = await synagogueDetailsRef.current.getDonorDetails();
        if (donorDetails?.address === undefined) return;
      }
    } else if (newDonor && donorDetailsRef.current) {
      donorDetails = await donorDetailsRef.current.getDonorDetails();
      if (donorDetails?.address === undefined) return;
    }
    let coordinate;
    if (newDonor)
      coordinate = await getCoordinatesFromAddress(donorDetails!.address);

    const newDonation = {
      donorId,
      amount: formData.amount,
      frequency: formData.frequency,
      numOfMonths:
        formData.frequency === "הוראת קבע" ? formData.numberOfMonth || 1 : 1,
      method: formData.method,
      notes: formData.notes || "",
      donorType: synagogue ? "בית כנסת" : "תורם",
      donorDetails: newDonor ? { ...donorDetails, coordinate } : null,
    };

    await createDonation(newDonation);
    setUser!({
      ...user!,
      totalDonations: user!.totalDonations! + formData.amount,
    });
    router.replace("/drawer");
  };

  // if (isSubmitting) return <Loading size={"large"} />;

  return (
    <FlatList
      style={globalStyles.container}
      data={!newDonor ? optionalDonors : []}
      renderItem={renderDonorItem}
      keyExtractor={(item) => item._id!}
      ListHeaderComponent={
        <View>
          <Text style={typography.header}>הוספת תרומה חדשה</Text>
          {!id && (
            <View>
              <View style={styles.flex}>
                <TouchableOpacity
                  style={styles.typeButton}
                  onPress={() => setSynagogue(false)}
                >
                  <Text style={styles.buttonText}>תורם</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.typeButton}
                  onPress={() => setSynagogue(true)}
                >
                  <Text style={styles.buttonText}>בית כנסת</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.switchContainer}>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                    color: colors.tabIconSelected,
                  }}
                >
                  {synagogue ? "בית כנסת" : "תורם"} חדש?
                </Text>
                <Switch value={newDonor} onValueChange={setNewDonor} />
              </View>
              {newDonor ? (
                synagogue ? (
                  <SynagogueDetailsScreen ref={synagogueDetailsRef} />
                ) : (
                  <DonorDetailsScreen ref={donorDetailsRef} />
                )
              ) : (
                <SearchBar
                  placeHolder={`חפש${
                    synagogue ? " בית כנסת" : " תורם"
                  } לפי שם או כתובת`}
                  searchQuery={searchQuery}
                  handleSave={searchOptionalDonors}
                  handleSearch={searchOptionalDonors}
                />
              )}
            </View>
          )}
        </View>
      }
      ListFooterComponent={
        <View>
          <Text style={typography.subheader}>פרטי התרומה</Text>

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <Input
                title="סכום התרומה"
                value={value ? value.toString() : ""}
                handleChangeText={(text) => {
                  if (text.startsWith(".")) onChange("0.");
                  else if (text.endsWith(".") || text.includes(".")) {
                    onChange(text);
                  } else {
                    const numValue = parseFloat(text) || 0;
                    onChange(numValue);
                  }
                }}
                keyboardType="decimal-pad"
                error={errors.amount?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="method"
            render={({ field: { onChange, value } }) => (
              <PickerSelect
                items={methodItems}
                value={value}
                setSelectedValue={onChange}
                title="אופן התרומה"
                error={errors.method?.message}
              />
            )}
          />

          <View style={styles.switchContainer}>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                color: colors.tabIconSelected,
              }}
            >
              הו"ק?
            </Text>
            <Controller
              control={control}
              name="frequency"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value === "הוראת קבע"}
                  onValueChange={(e) => onChange(e ? "הוראת קבע" : "חד פעמי")}
                />
              )}
            />
          </View>

          {isRecurring && (
            <Controller
              control={control}
              name="numberOfMonth"
              render={({ field: { onChange, value } }) => (
                <Input
                  title="מספר חודשים"
                  value={value ? value.toString() : ""}
                  handleChangeText={(e) => onChange(Number(e))}
                  keyboardType="numeric"
                  error={errors.numberOfMonth?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Input
                title="הערות"
                value={value || ""}
                handleChangeText={onChange}
                otherStyles={styles.notesInput}
                multiline
              />
            )}
          />

          <View style={{ marginBottom: 20 }}>
            <Button
              title="הוסף תרומה"
              handlePress={handleSubmit(onSubmit)}
              containerStyles={styles.addButton}
            />
          </View>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  flex: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
    gap: 20,
    justifyContent: "center",
    direction: "rtl",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    direction: "rtl",
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
    alignItems: "flex-start",
    paddingTop: 5,
  },
  addButton: {
    marginTop: 20,
    marginBottom: 150,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  typeButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 32,
    alignItems: "center",
    width: 100,
  },
  donorButton: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 32,
    alignItems: "center",
    width: 100,
  },
});

export default AddDonationScreen;

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Switch,
//   FlatList,
//   Animated,
// } from "react-native";
// import { createDonation } from "@/utils/api/donations";
// import { colors } from "@/styles/colors";
// import DonorDetailsScreen from "@/app/donors/add";
// import { typography } from "@/styles/typography";
// import Input from "@/components/Input";
// import {
//   DonorPost,
//   IDonor,
//   ISynagogue,
//   SynagoguePost,
// } from "@/constants/types";
// import { router, useLocalSearchParams } from "expo-router";
// import SynagogueDetailsScreen from "@/app/synagogues/add";
// import getCoordinatesFromAddress from "@/hooks/useAddressLocation";
// import SearchBar from "@/components/SearchBar";
// import { getUserDonors } from "@/utils/api/donors";
// import { getUserSenagogues } from "@/utils/api/synagogues";
// import SynagogueItem from "@/components/SynagogueItem";
// import DonorItem from "@/components/DonorItem";
// import { globalStyles } from "@/styles/globalStyles";
// import Button from "@/components/Button";
// import PickerSelect from "@/components/PickerSelect";

// interface DonorDetailsRef {
//   getDonorDetails: () => DonorPost | null;
// }

// interface SynagogueDetailsRef {
//   getDonorDetails: () => SynagoguePost | null;
// }

// type CombinedDetailsRef = DonorDetailsRef | SynagogueDetailsRef;

// const AddDonationScreen = () => {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const [donorId, setDonorId] = useState(id);
//   const [amount, setAmount] = useState<number>();
//   const [method, setMethod] = useState("");
//   const [frequency, setFrequency] = useState("");
//   const [isRecurring, setIsRecurring] = useState(false);
//   const [numberOfMonth, setNumberOfMonth] = useState(1);
//   const [notes, setNotes] = useState("");
//   const [amountError, setAmountError] = useState("");
//   const [methodError, setMethodError] = useState("");
//   const [newDonor, setNewDonor] = useState(false);
//   const [synagogue, setSynagogue] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [optionalDonors, setOptionalDonors] = useState<(IDonor | ISynagogue)[]>(
//     []
//   );
//   const [donors, setDonors] = useState<IDonor[]>([]);
//   const [synagogues, setSynagogues] = useState<ISynagogue[]>([]);
//   const [sortAnimation] = useState(new Animated.Value(0));
//   //const donorDetailsRef = useRef<DonorDetailsRef>(null);
//   const donorDetailsRef = useRef<DonorDetailsRef | null>(null);
//   const synagogueDetailsRef = useRef<SynagogueDetailsRef | null>(null);
//   const methodItems = [
//     { label: "אשראי", value: "אשראי" },
//     { label: "העברה", value: "העברה" },
//     { label: "צ'ק", value: "צ'ק" },
//     { label: "מזומן", value: "מזומן" },
//   ];

//   const validateForm = () => {
//     let flag = true;
//     if (!amount) {
//       setAmountError("שדה חובה");
//       flag = false;
//     }
//     if (!method) {
//       setMethodError("שדה חובה");
//       flag = false;
//     }
//     return flag;
//   };

//   const handleAddDonation = async () => {
//     const flag = validateForm();
//     let donorDetails = null;
//     if (synagogue) {
//       if (newDonor && synagogueDetailsRef.current) {
//         donorDetails = synagogueDetailsRef.current.getDonorDetails();
//         if (donorDetails?.address === undefined) return;
//       }
//     } else if (newDonor && donorDetailsRef.current) {
//       donorDetails = donorDetailsRef.current.getDonorDetails();
//       if (donorDetails?.address === undefined) return;
//     }
//     if (flag) {
//       let coordinate;
//       if (newDonor)
//         coordinate = await getCoordinatesFromAddress(donorDetails!.address);
//       const newDonation = {
//         donorId,
//         amount: amount!,
//         frequency,
//         numOfMonths: frequency === "הוראת קבע" ? numberOfMonth : 1,
//         method,
//         notes,
//         donorType: synagogue ? "בית כנסת" : "תורם",
//         donorDetails: newDonor
//           ? { ...donorDetails, coordinate, averageDonations: amount }
//           : null,
//       };
//       await createDonation(newDonation);
//       router.back();
//     }
//   };

//   useEffect(() => {
//     if (
//       !newDonor &&
//       ((synagogue && !synagogues[0]) || (!synagogue && !donors[0]))
//     )
//       fetchDonors();
//     else if (synagogue) setOptionalDonors(synagogues);
//     else setOptionalDonors(donors);
//   }, [newDonor, synagogue]);

//   const fetchDonors = async () => {
//     try {
//       let data;
//       if (synagogue) {
//         data = await getUserSenagogues();
//         setSynagogues(data);
//       } else {
//         data = await getUserDonors();
//         setDonors(data);
//       }
//       setOptionalDonors(data.slice(0, 10));
//     } catch (err) {}
//   };

//   const searchOptionalDonors = async (query: string) => {
//     setSearchQuery(query);
//     let filtered;
//     if (synagogue)
//       filtered = synagogues.filter((synagogue) => {
//         const address = synagogue?.address;
//         return (
//           `${address?.street.toLowerCase()} ${address?.building
//             .toString()
//             .toLowerCase()} ${
//             !synagogue && address?.apartment
//           }, ${address?.city.toLowerCase()} ${address?.country.toLowerCase()}`.includes(
//             query.toLowerCase()
//           ) || synagogue?.fullName?.toLowerCase().includes(query.toLowerCase())
//         );
//       });
//     else
//       filtered = donors.filter((donor) => {
//         const address = donor?.address;
//         return (
//           `${address?.street.toLowerCase()} ${address?.building
//             .toString()
//             .toLowerCase()} ${
//             !synagogue && address?.apartment
//           }, ${address?.city.toLowerCase()} ${address?.country.toLowerCase()}`.includes(
//             query.toLowerCase()
//           ) ||
//           `${donor?.firstName} ${donor?.lastName}`
//             .toLowerCase()
//             .includes(query.toLowerCase())
//         );
//       });
//     setOptionalDonors(filtered.slice(0, 10));
//   };

//   const renderDonorItem = useCallback(
//     ({ item }: { item: IDonor | ISynagogue }) => (
//       <Animated.View style={{ transform: [{ translateX: sortAnimation }] }}>
//         <TouchableOpacity
//           style={globalStyles.card}
//           onPress={() => {
//             setDonorId(item._id!),
//               setOptionalDonors([item]),
//               setSearchQuery("");
//           }}
//         >
//           {synagogue ? (
//             <SynagogueItem synagogue={item as ISynagogue} />
//           ) : (
//             <DonorItem donor={item as IDonor} />
//           )}
//         </TouchableOpacity>
//       </Animated.View>
//     ),
//     []
//   );

//   return (
//     <FlatList
//       style={globalStyles.container}
//       data={!newDonor ? optionalDonors : []}
//       renderItem={renderDonorItem}
//       keyExtractor={(item) => item._id!}
//       //refreshing={isLoading}
//       //onRefresh={fetchDonors}
//       ListHeaderComponent={
//         <View>
//           <Text style={typography.header}>הוספת תרומה חדשה</Text>
//           {!id && (
//             <View>
//               <View style={styles.flex}>
//                 <TouchableOpacity
//                   style={styles.typeButton}
//                   onPress={() => setSynagogue(false)}
//                 >
//                   <Text style={styles.buttonText}>תורם</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.typeButton}
//                   onPress={() => setSynagogue(true)}
//                 >
//                   <Text style={styles.buttonText}>בית כנסת</Text>
//                 </TouchableOpacity>
//               </View>
//               <View style={styles.switchContainer}>
//                 <Text
//                   style={{
//                     fontWeight: "600",
//                     fontSize: 16,
//                     color: colors.tabIconSelected,
//                   }}
//                 >
//                   תורם חדש?
//                 </Text>
//                 <Switch value={newDonor} onValueChange={setNewDonor} />
//               </View>
//               {newDonor ? (
//                 synagogue ? (
//                   <SynagogueDetailsScreen ref={synagogueDetailsRef} />
//                 ) : (
//                   <DonorDetailsScreen ref={donorDetailsRef} />
//                 )
//               ) : (
//                 <SearchBar
//                   placeHolder="חפש לפי שם או כתובת"
//                   searchQuery={searchQuery}
//                   handleSave={searchOptionalDonors}
//                   handleSearch={searchOptionalDonors}
//                 />
//               )}
//             </View>
//           )}
//         </View>
//       }
//       ListFooterComponent={
//         <View>
//           <Text style={typography.subheader}>פרטי התרומה</Text>
//           <Input
//             title="סכום התרומה"
//             value={amount || ""}
//             handleChangeText={(e) => {
//               setAmount(Number.parseInt(e) || 0), setAmountError("");
//             }}
//             error={amountError}
//             keyboardType="numeric"
//           />
//           <PickerSelect
//             items={methodItems}
//             value={method}
//             setSelectedValue={(e) => {
//               setMethod(e), setMethodError("");
//             }}
//             title="אופן התרומה"
//             error={methodError}
//           />
//           <View style={styles.switchContainer}>
//             <Text
//               style={{
//                 fontWeight: "600",
//                 fontSize: 16,
//                 color: colors.tabIconSelected,
//               }}
//             >
//               הו"ק?
//             </Text>
//             <Switch
//               value={isRecurring}
//               onValueChange={(e) => {
//                 setIsRecurring(e);
//                 setFrequency(e ? "הוראת קבע" : "חד פעמי");
//               }}
//             />
//           </View>

//           {isRecurring && (
//             <Input
//               title="מספר חודשים"
//               value={numberOfMonth}
//               handleChangeText={(e) => {
//                 setNumberOfMonth(Number(e));
//               }}
//               keyboardType="numeric"
//             />
//           )}
//           <Input
//             title="הערות"
//             value={notes}
//             handleChangeText={setNotes}
//             otherStyles={styles.notesInput}
//             multiline
//           />
//           <View style={{marginBottom: 20}}>
//           <Button
//             title="הוסף תרומה"
//             handlePress={handleAddDonation}
//             containerStyles={styles.addButton}
//           /></View>
//         </View>
//       }
//     />
//   );
// };

// const styles = StyleSheet.create({
//   flex: {
//     display: "flex",
//     flexDirection: "row",
//     padding: 20,
//     gap: 20,
//     justifyContent: "center",
//     direction: "rtl",
//   },
//   switchContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     direction: "rtl",
//   },
//   notesInput: {
//     height: 100,
//     textAlignVertical: "top",
//     alignItems: "flex-start",
//     paddingTop: 5,
//   },
//   addButton: {
//     marginTop: 20,
//     marginBottom: 150,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   typeButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 32,
//     alignItems: "center",
//     width: 100,
//   },
//   donorButton: {
//     backgroundColor: colors.secondary,
//     padding: 15,
//     borderRadius: 32,
//     alignItems: "center",
//     width: 100,
//   },
// });

// export default AddDonationScreen;
