import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
} from "react";
import { View, Text, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/Input";
import PickerSelect from "@/components/PickerSelect";
import { typography } from "@/styles/typography";
import { DonorPost } from "@/constants/types";

const donorSchema = z.object({
  firstName: z.string().min(1, "שדה חובה"),
  lastName: z.string().min(1, "שדה חובה"),
  email: z
    .union([z.string().email('כתובת דוא"ל לא תקינה').optional(), z.literal("")])
    .optional(),
  phoneNumber: z
    .union([
      z
        .string()
        .refine((val) => val === "" || /^(\+\d{1,3}[- ]?)?\d{10}$/.test(val), {
          message: "מספר טלפון לא תקין",
        })
        .optional(),
      z.literal(""),
    ])
    .optional(),
  age: z.number().int().max(120, "גיל לא תקין").min(0).optional(),
  gender: z.string().optional(),
  familyStatus: z.string().optional(),
  affiliation: z.string().optional(),
  address: z.object({
    country: z.string().min(1, "שדה חובה"),
    city: z.string().min(1, "שדה חובה"),
    street: z.string().min(1, "שדה חובה"),
    building: z.string().min(1, "שדה חובה"),
    apartment: z.number().int().optional(),
  }),
});

type DonorFormFields = z.infer<typeof donorSchema>;

interface DonorDetailsScreenProps {
  donor?: DonorPost;
}

interface DonorDetailsRef {
  getDonorDetails: () => Promise<DonorPost | null>;
}

const genderItems = [
  { label: "זכר", value: "גבר" },
  { label: "נקבה", value: "אישה" },
  { label: "אחר", value: "אחר" },
];

const familyStatusItems = [
  { label: "רווק/ה", value: "רווק" },
  { label: "נשוי/ה", value: "נשוי" },
  { label: "גרוש/ה", value: "גרוש" },
  { label: "אלמן/ה", value: "אלמן" },
];

const affiliationItems = [
  { label: "חרדי/ת", value: "חרדי" },
  { label: "דתי/ה לאומי", value: "דתי לאומי" },
  { label: "מסורתי/ת", value: "מסורתי" },
  { label: "חילוני/ת", value: "חילוני" },
  { label: "אחר", value: "אחר" },
];

const DonorDetailsScreen: ForwardRefRenderFunction<
  DonorDetailsRef,
  DonorDetailsScreenProps
> = ({ donor }, ref) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DonorFormFields>({
    resolver: zodResolver(donorSchema),
    mode: "onBlur",
    defaultValues: donor
      ? {
          firstName: donor.firstName || "",
          lastName: donor.lastName || "",
          email: donor.email || "",
          phoneNumber: donor.phoneNumber || "",
          age: donor.age,
          gender: donor.gender || "",
          familyStatus: donor.familyStatus || "",
          affiliation: donor.affiliation || "",
          address: {
            country: donor.address.country || "",
            city: donor.address.city || "",
            street: donor.address.street || "",
            building: donor.address.building || "",
            apartment: donor.address.apartment,
          },
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          gender: "",
          familyStatus: "",
          affiliation: "",
          address: {
            country: "",
            city: "",
            street: "",
            building: "",
          },
        },
  });

  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const phoneNumberInputRef = useRef<TextInput>(null);
  const ageInputRef = useRef<TextInput>(null);
  const cityInputRef = useRef<TextInput>(null);
  const streetInputRef = useRef<TextInput>(null);
  const buildingInputRef = useRef<TextInput>(null);
  const apartmentInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    getDonorDetails: () => {
      return new Promise<DonorPost | null>((resolve) => {
        handleSubmit(
          (data) => {
            const donorDetails: DonorPost = {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              age: data.age || 0,
              gender: data.gender || "",
              familyStatus: data.familyStatus || "",
              affiliation: data.affiliation || "",
              address: {
                country: data.address.country,
                city: data.address.city,
                street: data.address.street,
                building: data.address.building,
                apartment: data.address.apartment,
              },
            };
            resolve(donorDetails);
          },
          () => {
            resolve(null);
          }
        )();
      });
    },
  }));

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={typography.subheader}>פרטי התורם</Text>

      <Controller
        control={control}
        name="address.country"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="ארץ"
            value={value}
            handleChangeText={onChange}
            error={errors.address?.country?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => cityInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="address.city"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="עיר"
            value={value}
            ref={cityInputRef}
            handleChangeText={onChange}
            error={errors.address?.city?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => streetInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="address.street"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="רחוב"
            value={value}
            ref={streetInputRef}
            handleChangeText={onChange}
            error={errors.address?.street?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => buildingInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="address.building"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="מספר בניין"
            value={value}
            ref={buildingInputRef}
            handleChangeText={onChange}
            error={errors.address?.building?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => apartmentInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="address.apartment"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="מספר דירה"
            value={value ? value.toString() : ""}
            ref={apartmentInputRef}
            handleChangeText={(text) => onChange(Number.parseInt(text) || 0)}
            keyboardType="number-pad"
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => firstNameInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="שם פרטי"
            value={value}
            ref={firstNameInputRef}
            handleChangeText={onChange}
            error={errors.firstName?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => lastNameInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="שם משפחה"
            value={value}
            ref={lastNameInputRef}
            handleChangeText={onChange}
            error={errors.lastName?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => phoneNumberInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="מספר פלאפון"
            value={value || ""}
            ref={phoneNumberInputRef}
            handleChangeText={onChange}
            keyboardType="phone-pad"
            error={errors.phoneNumber?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="אימייל"
            value={value || ""}
            ref={emailInputRef}
            handleChangeText={onChange}
            keyboardType="email-address"
            error={errors.email?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => ageInputRef.current}
            blurOnSubmit={"blurAndSubmit"}
          />
        )}
      />

      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="גיל"
            value={value ? value.toString() : ""}
            ref={ageInputRef}
            handleChangeText={(text) => {
              const parsedValue = Number.parseInt(text) || 0;
              // if (parsedValue >= 0 && parsedValue <= 120) {
                onChange(parsedValue);
              // }
            }}
            keyboardType="number-pad"
            handeleBlur={onBlur}
            returnKeyType="next"
            blurOnSubmit={"blurAndSubmit"}
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <PickerSelect
            items={genderItems}
            value={value || ""}
            setSelectedValue={onChange}
            title="מין"
          />
        )}
      />

      <Controller
        control={control}
        name="familyStatus"
        render={({ field: { onChange, value } }) => (
          <PickerSelect
            items={familyStatusItems}
            value={value || ""}
            setSelectedValue={onChange}
            title="מצב משפחתי"
          />
        )}
      />

      <Controller
        control={control}
        name="affiliation"
        render={({ field: { onChange, value } }) => (
          <PickerSelect
            items={affiliationItems}
            value={value || ""}
            setSelectedValue={onChange}
            title="השתייכות"
          />
        )}
      />
    </View>
  );
};

export default forwardRef(DonorDetailsScreen);

// import React, {
//   forwardRef,
//   ForwardRefRenderFunction,
//   useEffect,
//   useImperativeHandle,
//   useState,
// } from "react";
// import { View, Text } from "react-native";
// import Input from "@/components/Input";
// import { typography } from "@/styles/typography";
// import { DonorPost } from "@/constants/types";
// import { StyleSheet } from "react-native";
// import PickerSelect from "@/components/PickerSelect";

// interface DonorDetailsScreenProps {
//   donor?: DonorPost;
// }

// const DonorDetailsScreen: ForwardRefRenderFunction<
//   unknown,
//   DonorDetailsScreenProps
// > = (props, ref) => {
//   const { donor } = props;
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [age, setAge] = useState<number>();
//   const [gender, setGender] = useState("");
//   const [familyStatus, setFamilyStatus] = useState("");
//   const [affiliation, setAffiliation] = useState("");
//   const [country, setCountry] = useState("");
//   const [city, setCity] = useState("");
//   const [street, setStreet] = useState("");
//   const [building, setBuilding] = useState("");
//   const [apartment, setApartment] = useState<number>();
//   const [fnError, setFNError] = useState("");
//   const [lnError, setLNError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [pNError, setPNError] = useState("");
//   const [countryError, setCountryError] = useState("");
//   const [cityError, setCityError] = useState("");
//   const [streetdError, setStreetError] = useState("");
//   const [buildingError, setBuildingError] = useState("");

//   const genderItems = [
//     { label: "זכר", value: "גבר" },
//     { label: "נקבה", value: "אישה" },
//     { label: "אחר", value: "אחר" },
//   ];

//   const familyStatusItems = [
//     { label: "רווק/ה", value: "רווק" },
//     { label: "נשוי/ה", value: "נשוי" },
//     { label: "גרוש/ה", value: "גרוש" },
//     { label: "אלמן/ה", value: "אלמן" },
//   ];

//   const affiliationItems = [
//     { label: "חרדי/ת", value: "חרדי" },
//     { label: "דתי/ה לאומי", value: "דתי לאומי" },
//     { label: "מסורתי/ת", value: "מסורתי" },
//     { label: "חילוני/ת", value: "חילוני" },
//     { label: "אחר", value: "אחר" },
//   ];

//   useEffect(() => {
//     if (donor) {
//       setFirstName(donor.firstName || "");
//       setLastName(donor.lastName || "");
//       setPhoneNumber(donor.phoneNumber || "");
//       setEmail(donor.email || "");
//       setAge(donor.age);
//       setGender(donor.gender || "");
//       setFamilyStatus(donor.familyStatus || "");
//       setAffiliation(donor.affiliation || "");
//       setCountry(donor.address.country || "");
//       setCity(donor.address.city || "");
//       setStreet(donor.address.street || "");
//       setBuilding(donor.address.building || "");
//       setApartment(donor.address.apartment);
//     }
//   }, []);

//   const validateEmail = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (email && !emailRegex.test(email)) {
//       setEmailError("כתובת האימייל אינה תקינה");
//     }
//   };

//   const validatePhoneNumber = () => {
//     const phoneRegex = /^05\d{1}-?\d{7}$/;
//     const phoneHomeRegex = /^0\d{1}-?\d{7}$/;
//     if (
//       phoneNumber &&
//       !phoneRegex.test(phoneNumber) &&
//       !phoneHomeRegex.test(phoneNumber)
//     ) {
//       setPNError("מספר שגוי");
//     }
//   };

//   const validateForm = () => {
//     let flag = true;
//     if (!firstName) {
//       setFNError("שדה חובה");
//       flag = false;
//     }
//     if (!lastName) {
//       setLNError("שדה חובה");
//       flag = false;
//     }
//     if (!country) {
//       setCountryError("שדה חובה");
//       flag = false;
//     }
//     if (!city) {
//       setCityError("שדה חובה");
//       flag = false;
//     }
//     if (!street) {
//       setStreetError("שדה חובה");
//       flag = false;
//     }
//     if (!building) {
//       setBuildingError("שדה חובה");
//       flag = false;
//     }
//     if (emailError || pNError) {
//       flag = false;
//     }

//     return flag;
//   };

//   useImperativeHandle(ref, () => ({
//     getDonorDetails: () => {
//       if (validateForm()) {
//         return {
//           firstName,
//           lastName,
//           email,
//           phoneNumber,
//           age,
//           gender,
//           familyStatus,
//           affiliation,
//           address: { country, city, street, building, apartment },
//         };
//       }
//       return null;
//     },
//   }));

//   return (
//     <View>
//       <Text style={typography.subheader}>פרטי התורם</Text>
//       <Input
//         title="ארץ"
//         value={country}
//         handleChangeText={(e) => {
//           setCountry(e), setCountryError("");
//         }}
//         error={countryError}
//       />
//       <Input
//         title="עיר"
//         value={city}
//         handleChangeText={(e) => {
//           setCity(e), setCityError("");
//         }}
//         error={cityError}
//       />
//       <Input
//         title="רחוב"
//         value={street}
//         handleChangeText={(e) => {
//           setStreet(e), setStreetError("");
//         }}
//         error={streetdError}
//       />
//       <Input
//         title="מספר בניין"
//         value={building}
//         handleChangeText={(e) => {
//           setBuilding(e), setBuildingError("");
//         }}
//         error={buildingError}
//       />
//       <Input
//         title="מספר דירה"
//         value={apartment || ""}
//         handleChangeText={(e) => setApartment(Number.parseInt(e) || 0)}
//         keyboardType="number-pad"
//       />
//       <Input
//         title="שם פרטי"
//         value={firstName}
//         handleChangeText={(e) => {
//           setFirstName(e), setFNError("");
//         }}
//         error={fnError}
//       />
//       <Input
//         title="שם משפחה"
//         value={lastName}
//         handleChangeText={(e) => {
//           setLastName(e), setLNError("");
//         }}
//         error={lnError}
//       />
//       <Input
//         title="מספר פלאפון"
//         value={phoneNumber}
//         handleChangeText={(e) => {
//           setPhoneNumber(e), setPNError("");
//         }}
//         keyboardType="name-phone-pad"
//         handeleBlur={validatePhoneNumber}
//         error={pNError}
//       />
//       <Input
//         title="אימייל"
//         value={email}
//         handleChangeText={(e) => {
//           setEmail(e), setEmailError("");
//         }}
//         keyboardType="email-address"
//         handeleBlur={validateEmail}
//         error={emailError}
//       />
//       <PickerSelect
//         items={genderItems}
//         value={gender}
//         setSelectedValue={setGender}
//         title="מין"
//       />
//       <Input
//         title="גיל"
//         value={age || ""}
//         handleChangeText={(e) => setAge(Number.parseInt(e) || 0)}
//         keyboardType="number-pad"
//       />
//       <PickerSelect
//         items={familyStatusItems}
//         value={familyStatus}
//         setSelectedValue={setFamilyStatus}
//         title="מצב משפחתי"
//       />
//       <PickerSelect
//         items={affiliationItems}
//         value={affiliation}
//         setSelectedValue={setAffiliation}
//         title="השתייכות"
//       />
//     </View>
//   );
// };

// export default forwardRef(DonorDetailsScreen);
