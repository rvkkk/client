import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/Input";
import PickerSelect from "@/components/PickerSelect";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { SynagoguePost } from "@/constants/types";

const synagogueSchema = z.object({
  name: z.string().min(1, "שדה חובה"),
  affiliation: z.string().optional(),
  address: z.object({
    country: z.string().min(1, "שדה חובה"),
    city: z.string().min(1, "שדה חובה"),
    street: z.string().min(1, "שדה חובה"),
    building: z.string().min(1, "שדה חובה"),
  }),
  prayerTimes: z.object({
    shacharit: z.array(z.object({
      time: z.string(),
      createdAt: z.date()
    })),
    mincha: z.array(z.object({
      time: z.string(),
      createdAt: z.date()
    })),
    arvit: z.array(z.object({
      time: z.string(),
      createdAt: z.date()
    }))
  })
});

type SynagogueFormFields = z.infer<typeof synagogueSchema>;

interface SynagogueDetailsScreenProps {
  synagogue?: SynagoguePost;
}

interface SynagogueDetailsRef {
  getDonorDetails: () => Promise<SynagoguePost | null>;
}

const affiliationItems = [
  { label: "חסידי", value: "חסידי" },
  { label: "ליטאי", value: "ליטאי" },
  { label: "ספרדי", value: "ספרדי" },
  { label: "תימני", value: "תימני" },
  { label: "מרוקאי", value: "מרוקאי" },
  { label: "דתי לאומי", value: "דתי לאומי" },
  { label: "מסורתי", value: "מסורתי" },
];

const PrayerArray = ({ control, name }: { control: any; name: "prayerTimes.shacharit" | "prayerTimes.mincha" | "prayerTimes.arvit" }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          direction: "rtl",
        }}
      >
        <Text
          style={[
            typography.body,
            { alignSelf: "center", color: colors.primary },
          ]}
        >
          {name === "prayerTimes.shacharit" ? "זמני שחרית" :
           name === "prayerTimes.mincha" ? "זמני מנחה" : 
           "זמני ערבית"}
        </Text>
        <TouchableOpacity onPress={() => append({ time: "", createdAt: new Date() })}>
          <Text style={typography.linkText}>הוסף</Text>
        </TouchableOpacity>
      </View>

      {fields.map((field, index) => (
        <View key={field.id} style={{ flexDirection: 'row', alignItems: 'center', direction: "rtl" }}>
          <Controller
            control={control}
            name={`${name}.${index}.time`}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ flex: 1 }}>
                <Input
                  title={`.${index + 1}`}
                  value={value}
                  handleChangeText={onChange}
                  handeleBlur={onBlur}
                />
              </View>
            )}
          />
          <TouchableOpacity onPress={() => remove(index)} style={{ marginRight: 10 }}>
            <Text style={typography.removeText}>מחק</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const SynagogueDetailsScreen: ForwardRefRenderFunction<
  SynagogueDetailsRef,
  SynagogueDetailsScreenProps
> = ({ synagogue }, ref) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SynagogueFormFields>({
    resolver: zodResolver(synagogueSchema),
    defaultValues: synagogue
      ? {
          name: synagogue.fullName || "",
          affiliation: synagogue.affiliation || "",
          address: {
            country: synagogue.address.country || "",
            city: synagogue.address.city || "",
            street: synagogue.address.street || "",
            building: synagogue.address.building || "",
          },
          prayerTimes: {
            shacharit: synagogue.prayerTimes.shacharit || [],
            mincha: synagogue.prayerTimes.mincha || [],
            arvit: synagogue.prayerTimes.arvit || [],
          },
        }
      : {
          name: "",
          affiliation: "",
          address: {
            country: "",
            city: "",
            street: "",
            building: "",
          },
          prayerTimes: {
            shacharit: [],
            mincha: [],
            arvit: [],
          },
        },
  });

  const fullNameInputRef = useRef<TextInput>(null);
  const cityInputRef = useRef<TextInput>(null);
  const streetInputRef = useRef<TextInput>(null);
  const buildingInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    getDonorDetails: () => {
      return new Promise<SynagoguePost | null>((resolve) => {
        handleSubmit(
          (data) => {
            console.log(66, data)
          const synagogueDetails: SynagoguePost = {
            fullName: data.name,
            affiliation: data.affiliation || "",
            address: {
              country: data.address.country,
              city: data.address.city,
              street: data.address.street,
              building: data.address.building,
            },
            prayerTimes: {
              shacharit: data.prayerTimes.shacharit,
              mincha: data.prayerTimes.mincha,
              arvit: data.prayerTimes.arvit,
            },
          };
          resolve(synagogueDetails);
        },
        () => {
          console.log(56)
          resolve(null);
        }
      )();
    });
    },
  }));

  return (
    <View style={{marginBottom: 20}}>
      <Text style={typography.subheader}>פרטי בית הכנסת</Text>

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
            onSubmitEditing={() => fullNameInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="שם בית הכנסת"
            value={value}
            ref={fullNameInputRef}
            handleChangeText={onChange}
            error={errors.name?.message}
            handeleBlur={onBlur}
            returnKeyType="next"
            blurOnSubmit={"blurAndSubmit"}
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
            title="זרם / חוג"
          />
        )}
      />

      <PrayerArray control={control} name="prayerTimes.shacharit" />
      <PrayerArray control={control} name="prayerTimes.mincha" />
      <PrayerArray control={control} name="prayerTimes.arvit" />
    </View>
  );
};

export default forwardRef(SynagogueDetailsScreen);

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
// import Button from "@/components/Button";
// import { PrayerDetails, SynagoguePost } from "@/constants/types";
// import { colors } from "@/styles/colors";
// import PickerSelect from "@/components/PickerSelect";
// import { TouchableOpacity } from "react-native";

// interface SynagogueDetailsScreenProps {
//   synagogue?: SynagoguePost;
// }

// const SynagogueDetailsScreen: ForwardRefRenderFunction<
//   unknown,
//   SynagogueDetailsScreenProps
// > = (props, ref) => {
//   const { synagogue } = props;

//   const [name, setName] = useState("");
//   const [affiliation, setAffiliation] = useState("");
//   const [country, setCountry] = useState("");
//   const [city, setCity] = useState("");
//   const [street, setStreet] = useState("");
//   const [building, setBuilding] = useState("");
//   const [shacharit, setShacharit] = useState<PrayerDetails[]>([]);
//   const [mincha, setMincha] = useState<PrayerDetails[]>([]);
//   const [arvit, setArvit] = useState<PrayerDetails[]>([]);
//   const [nameError, setNameError] = useState("");
//   const [countryError, setCountryError] = useState("");
//   const [cityError, setCityError] = useState("");
//   const [streetdError, setStreetError] = useState("");
//   const [buildingError, setBuildingError] = useState("");

//   const affiliationItems = [
//     { label: "חסידי", value: "חסידי" },
//     { label: "ליטאי", value: "ליטאי" },
//     { label: "ספרדי", value: "ספרדי" },
//     { label: "תימני", value: "תימני" },
//     { label: "מרוקאי", value: "מרוקאי" },
//     { label: "דתי לאומי", value: "דתי לאומי" },
//     { label: "מסורתי", value: "מסורתי" },
//   ];

//   useEffect(() => {
//     if (synagogue) {
//       setName(synagogue.fullName || "");
//       setAffiliation(synagogue.affiliation || "");
//       setCountry(synagogue.address.country || "");
//       setCity(synagogue.address.city || "");
//       setStreet(synagogue.address.street || "");
//       setBuilding(synagogue.address.building || "");
//       setShacharit(synagogue.prayerTimes.shacharit || []);
//       setMincha(synagogue.prayerTimes.mincha || []);
//       setArvit(synagogue.prayerTimes.arvit || []);
//     }
//   }, []);

//   const validateForm = () => {
//     let flag = true;
//     if (!name) {
//       setNameError("שדה חובה");
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
//     return flag;
//   };

//   useImperativeHandle(ref, () => ({
//     getDonorDetails: () => {
//       if (validateForm()) {
//         return {
//           name,
//           affiliation,
//           address: { country, city, street, building },
//           prayerTimes: { shacharit, mincha, arvit },
//         };
//       }
//       return null;
//     },
//   }));

//   const updateField = (
//     set: React.Dispatch<React.SetStateAction<PrayerDetails[]>>,
//     index: number,
//     value: string
//   ) => {
//     set((prev: PrayerDetails[]) => {
//       const copy = [...prev];
//       copy[index].time = value;
//       return copy;
//     });
//   };

//   return (
//     <View>
//       <Text style={typography.subheader}>פרטי בית הכנסת</Text>
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
//         title="שם בית הכנסת"
//         value={name}
//         handleChangeText={(e) => {
//           setName(e), setNameError("");
//         }}
//         error={nameError}
//       />
//       <PickerSelect
//         items={affiliationItems}
//         value={affiliation}
//         setSelectedValue={setAffiliation}
//         title="זרם / חוג"
//       />
//       <PrayerArray
//         title="זמני שחרית"
//         array={shacharit}
//         updateField={updateField}
//         set={setShacharit}
//       />
//       <PrayerArray
//         title="זמני מנחה"
//         array={mincha}
//         updateField={updateField}
//         set={setMincha}
//       />
//       <PrayerArray
//         title="זמני ערבית"
//         array={arvit}
//         updateField={updateField}
//         set={setArvit}
//       />
//     </View>
//   );
// };

// export default forwardRef(SynagogueDetailsScreen);

// const PrayerArray = ({
//   title,
//   array,
//   updateField,
//   set,
// }: {
//   title: string;
//   array: PrayerDetails[];
//   updateField: (index: any, key: any, value: any) => void;
//   set: React.Dispatch<React.SetStateAction<PrayerDetails[]>>;
// }) => {
//   return (
//     <View style={{ marginTop: 20 }}>
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           direction: "rtl",
//         }}
//       >
//         <Text
//           style={[
//             typography.body,
//             { alignSelf: "center", color: colors.primary },
//           ]}
//         >
//           {title}
//         </Text>
//         <TouchableOpacity onPress={() => set((prev) => [...prev, { time: "", createdAt: new Date() }])}>
//         <Text style={typography.linkText}>הוסף</Text>
//       </TouchableOpacity>

//         {/* <Button
//           title="הוסף"
//           isLoading={false}
//           containerStyles={{ marginBottom: 0 }}
//           handlePress={() =>
//             set((prev) => [...prev, { time: "", createdAt: new Date() }])
//           }
//         ></Button> */}
//       </View>

//       {array.map((field, index) => (
//         <Input
//           key={index}
//           value={field.time}
//           handleChangeText={(e) => updateField(set, index, e)}
//           title={`.${index + 1}`}
//           //  otherStyles={{ textAlign: 'left' }}
//         />
//       ))}
//     </View>
//   );
// };
