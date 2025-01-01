import { View, Text, ScrollView, Alert, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Loading from "@/components/Loading";
import { globalStyles } from "@/styles/globalStyles";
import { DonationPost, IDonation } from "@/constants/types";
import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import {
  deleteDonation,
  getDonationById,
  updateDonation,
} from "@/utils/api/donations";
import { typography } from "@/styles/typography";
import Input from "@/components/Input";
import PickerSelect from "@/components/PickerSelect";
import { useAuth } from "@/contexts/AuthContext";

const donationSchema = z.object({
  amount: z.number().min(1, "סכום התרומה חייב להיות גדול מ-0"),
  method: z.string().min(1, "אנא בחר שיטת תשלום"),
  frequency: z.string().min(1, "אנא בחר תדירות תרומה"),
  numberOfMonth: z.number().int().min(1, "מספר החודשים חייב להיות לפחות 1"),
  notes: z.string().optional(),
});

type DonationFormFields = z.infer<typeof donationSchema>;

const DonationPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {user, setUser} = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [donation, setDonation] = useState<IDonation>();
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<DonationFormFields>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      method: "",
      frequency: "",
      numberOfMonth: 1,
      notes: "",
    },
  });

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

  const notesInputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchDonation();
  }, []);

  const fetchDonation = async () => {
    try {
      setIsLoading(true);
      const data = await getDonationById(id);
      setDonation(data);

      setValue("amount", data.amount);
      setValue("method", data.method);
      setValue("frequency", data.frequency);
      setValue("numberOfMonth", data.numOfMonths);
      setValue("notes", data.notes || "");
    } catch (err) {
      setError("שגיאה בקליטת נתוני תרומה");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData: DonationFormFields) => {
    try {
      setIsLoading(true);
      let d: DonationPost = {
        amount: formData.amount,
        method: formData.method,
        frequency: formData.frequency,
        notes: formData.notes || "",
        numOfMonths: formData.numberOfMonth,
        donorType: donation?.donorType!,
        donorId: donation?.donorId!,
      };

      await updateDonation(donation?._id!, d);
      Alert.alert("הודעה", "התרומה עודכנה בהצלחה");
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לעדכן את התרומה");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("מחיקת תרומה", "האם אתה בטוח שברצונך למחוק תרומה זו?", [
      {
        text: "ביטול",
        style: "cancel",
      },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          await deleteDonation(donation?._id!);
          setUser!({ ...user!, totalDonations: user!.totalDonations! - getValues("amount") });
          router.back();
        },
      },
    ]);
  };

  if (isLoading) return <Loading size={"large"} />;
  if (error) return <ErrorMessage error={error} handleFetch={fetchDonation} />;

  return (
    <ScrollView style={globalStyles.scrollContainer}>
      <View
        style={{
          borderBottomColor: colors.lightGray,
          borderBottomWidth: 4,
          borderStyle: "dotted",
        }}
      >
        <Text style={typography.header}>פרטי התרומה</Text>

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="סכום התרומה"
              value={value ? value.toString() : ""}
              handleChangeText={(text) => onChange(Number.parseInt(text) || 0)}
              keyboardType="number-pad"
              error={errors.amount?.message}
              handeleBlur={onBlur}
              returnKeyType="next"
              blurOnSubmit={"blurAndSubmit"}
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

        <Controller
          control={control}
          name="frequency"
          render={({ field: { onChange, value } }) => (
            <PickerSelect
              items={frequencyItems}
              value={value}
              setSelectedValue={onChange}
              title="תדירות"
              error={errors.frequency?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="numberOfMonth"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="מספר חודשים"
              value={value ? value.toString() : "1"}
              handleChangeText={(text) => onChange(Number.parseInt(text) || 1)}
              keyboardType="number-pad"
              error={errors.numberOfMonth?.message}
              handeleBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => notesInputRef.current?.focus()}
              blurOnSubmit={"submit"}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="הערות"
              value={value || ""}
              ref={notesInputRef}
              handleChangeText={onChange}
              otherStyles={styles.notesInput}
              handeleBlur={onBlur}
              multiline
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              blurOnSubmit="blurAndSubmit"
            />
          )}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="עדכן"
            handlePress={handleSubmit(onSubmit)}
            containerStyles={{ flex: 1, marginTop: 20 }}
          />
          <FontAwesome
            onPress={handleDelete}
            color={colors.primary}
            name="trash"
            size={24}
          />
        </View>
      </View>

      <Button
        title="מעבר לדף התורם"
        handlePress={() => router.push(`/donors/${donation?.donorId}`)}
        containerStyles={{ background: colors.success, marginTop: 20 }}
      />
    </ScrollView>
  );
};

export default DonationPage;

const styles = StyleSheet.create({
  buttonContainer: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  notesInput: {
    height: 69,
  },
  text: {
    ...typography.subheader,
    marginBottom: 5,
    fontSize: 16,
  },
});

// import { View, Text, ScrollView, Animated, Alert, TouchableOpacity } from "react-native";
// import React, { useEffect, useState } from "react";
// import { router, useLocalSearchParams } from "expo-router";
// import { FontAwesome } from "@expo/vector-icons";
// import Loading from "@/components/Loading";
// import { globalStyles } from "@/styles/globalStyles";
// import { DonationPost, IDonation } from "@/constants/types";
// import { StyleSheet } from "react-native";
// import { colors } from "@/styles/colors";
// import ErrorMessage from "@/components/ErrorMessage";
// import Button from "@/components/Button";
// import {
//   deleteDonation,
//   getDonationById,
//   updateDonation,
// } from "@/utils/api/donations";
// import { typography } from "@/styles/typography";
// import Input from "@/components/Input";
// import PickerSelect from "@/components/PickerSelect";

// const DonationPage = () => {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const [isLoading, setIsLoading] = useState(true);
//   const [donation, setDonation] = useState<IDonation>();
//   const [amount, setAmount] = useState<number>();
//   const [method, setMethod] = useState("");
//   const [frequency, setFrequency] = useState("");
//   const [numberOfMonth, setNumberOfMonth] = useState(1);
//   const [notes, setNotes] = useState("");
//   const [amountError, setAmountError] = useState("");
//   const [methodError, setMethodError] = useState("");
//   const [error, setError] = useState("");
//   const [sortAnimation] = useState(new Animated.Value(0));

//   const methodItems = [
//     { label: "אשראי", value: "אשראי" },
//     { label: "העברה", value: "העברה" },
//     { label: "צ'ק", value: "צ'ק" },
//     { label: "מזומן", value: "מזומן" },
//   ];

//   const frequencyItems = [
//     { label: "חד פעמי", value: "חד פעמי" },
//     { label: "הוראת קבע", value: "הוראת קבע" },
//   ]

//   useEffect(() => {
//     fetchDonation();
//   }, []);

//   const fetchDonation = async () => {
//     try {
//       setIsLoading(true);
//       const data = await getDonationById(id);
//       console.log(data);
//       setDonation(data);
//       setAmount(data.amount);
//       setMethod(data.method);
//       setFrequency(data.frequency);
//       setNumberOfMonth(data.numOfMonths);
//       setNotes(data.notes);
//     } catch (err) {
//       setError("שגיאה בקליטת נתוני תרומה");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     let d: DonationPost = {
//       amount: donation?.amount!,
//       method: donation?.method!,
//       frequency: donation?.frequency!,
//       notes: donation?.notes!,
//       numOfMonths: donation?.numOfMonths!,
//       donorType: donation?.donorType!,
//       donorId: donation?.donorId!,
//     };
//     if (amount != undefined && donation?.amount != amount) d.amount = amount;
//     if (method != undefined && donation?.method != method) d.method = method;
//     if (frequency != undefined && donation?.frequency != frequency)
//       d.frequency = frequency;
//     if (numberOfMonth != undefined && donation?.numOfMonths != numberOfMonth)
//       d.numOfMonths = numberOfMonth;
//     if (notes != undefined && donation?.notes != notes) d.notes = notes;
//     await updateDonation(donation?._id!, d);
//   };

//   const handleDelete = () => {
//     Alert.alert("מחיקת תרומה", "האם אתה בטוח שברצונך למחוק תרומה זו?");
//     deleteDonation(donation?._id!);
//     router.back();
//   };

//   if (isLoading) return <Loading size={"large"} />;
//   if (error) return <ErrorMessage error={error} handleFetch={fetchDonation} />;

//   return (
//     <ScrollView style={globalStyles.scrollContainer}>
//       <View
//         style={{
//           borderBottomColor: colors.lightGray,
//           borderBottomWidth: 4,
//           borderStyle: "dotted",
//         }}
//       >
//         <Text style={typography.header}>פרטי התרומה</Text>
//         <Input
//           title="סכום התרומה"
//           value={amount!}
//           handleChangeText={(e) => {
//               setAmount(Number.parseInt(e) || 0), setAmountError("");
//           }}
//           error={amountError}
//           keyboardType="number-pad"
//         />
//            <PickerSelect
//             items={methodItems}
//             value={method}
//             setSelectedValue={(e) => {
//               setMethod(e), setMethodError("");
//             }}
//             title="אופן התרומה"
//             error={methodError}
//           />
//             <PickerSelect
//             items={frequencyItems}
//             value={frequency}
//             setSelectedValue={setFrequency}
//              title="תדירות"
//           />
//         <Input
//           title="מספר חודשים"
//           value={numberOfMonth}
//           handleChangeText={(e) => {
//             if (Number(e) > 1) setNumberOfMonth(Number.parseInt(e) || 1);
//           }}
//           keyboardType="number-pad"
//           error={methodError}
//         />
//         <Input
//           title="הערות"
//           value={notes}
//           handleChangeText={setNotes}
//           otherStyles={styles.notesInput}
//           multiline
//         />
//         <View style={styles.buttonContainer}>
//           <Button
//             title="עדכן"
//             handlePress={handleUpdate}
//             isLoading={false}
//             containerStyles={{ flex: 1, marginTop: 20 }}
//           />
//           <FontAwesome
//             onPress={handleDelete}
//             onPressIn={handleDelete}
//             color={colors.primary}
//             name="trash"
//             size={24}
//           />
//         </View>
//       </View>
//       <Button
//         title="מעבר לדף התורם"
//         handlePress={() => router.push(`/donors/${donation?.donorId}`)}
//         containerStyles={{ background: colors.success, marginTop: 20 }}
//       />
//     </ScrollView>
//   );
// };

// export default DonationPage;

// const styles = StyleSheet.create({
//   buttonContainer: {
//     direction: "rtl",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 20,
//   },
//   notesInput: {
//     height: 69,
//   },
//   text: {
//     ...typography.subheader,
//     marginBottom: 5,
//     fontSize: 16,
//   },
// });
