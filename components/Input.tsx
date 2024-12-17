import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ReturnKeyTypeOptions,
  KeyboardAvoidingView,
  Platform,
  SubmitBehavior,
} from "react-native";
import React, { forwardRef, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { colors } from "@/styles/colors";

type InputProps = {
  title: string;
  value: string | number;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  handeleBlur?: (text: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  otherStyles?: object;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  multiline?: boolean;
  maxLength?: number;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  blurOnSubmit?: SubmitBehavior;
};

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      title,
      value,
      placeholder,
      handleChangeText,
      handeleBlur,
      otherStyles,
      keyboardType,
      multiline,
      maxLength,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
      error,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const isPassword = title === "סיסמה" || title === "אימות סיסמה";

    const rightIcon = isPassword ? (
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
      >
        <Entypo
          name={showPassword ? "eye" : "eye-with-line"}
          size={20}
          color="black"
        />
      </TouchableOpacity>
    ) : null;

    return (
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      style={{ 
        marginVertical: 10, 
        direction: "rtl",
        flex: multiline ? 1 : 0
      }}
    >
        <Text style={styles.title}>{title}</Text>
        <View
          style={[
            styles.inputOuter,
            otherStyles,
            error ? styles.errorBorder : null,   
            // multiline && { 
            //     minHeight: 100, 
            //     textAlignVertical: 'top',
            //     marginBottom: 10 
            //   }
          ]}
        >
          <TextInput
            style={[
              styles.inputInner,
            ]}
            textAlign="right"
            value={value ? value.toString() : ""}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            keyboardType={keyboardType || "default"}
            onChangeText={handleChangeText}
            onBlur={handeleBlur}
            secureTextEntry={isPassword && !showPassword}
            multiline={multiline}
            maxLength={maxLength}
            ref={ref}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            submitBehavior={blurOnSubmit}
          />
          {rightIcon}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </KeyboardAvoidingView>
    );
  }
);

export default Input;

const styles = StyleSheet.create({
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "400",
  },
  border: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
  },
  errorBorder: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  inputOuter: {
    direction: "rtl",
    width: "100%",
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
    gap: 8,
    fontSize: 16,
    color: "#333",
    textAlign: "right",
  },
  inputInner: {
    width: "100%",
    fontSize: 16,
    writingDirection: "rtl",
    textAlign: "right",
    direction: "rtl",
    flex: 1,
    padding: 10,
    color: colors.text,
  },
  eyeIcon: {
    marginRight: 10,
  },
});

// type props = {
//   title: string;
//   value: string | number;
//   placeholder?: string;
//   handleChangeText: (text: string) => void;
//   handeleBlur?: (text: NativeSyntheticEvent<TextInputFocusEventData>) => void;
//   otherStyles?: object;
//   keyboardType?: KeyboardTypeOptions;
//   error?: string;
//   multiline?: boolean;
//   maxLength?: number;
//   ref?: React.RefObject<TextInput>
//   returnKeyType?: ReturnKeyTypeOptions;
//   onSubmitEditing?: () => void;
//   blurOnSubmit?: boolean;
// };

// const Input = ({
//   title,
//   value,
//   placeholder,
//   handleChangeText,
//   handeleBlur,
//   otherStyles,
//   keyboardType,
//   multiline,
//   maxLength,
//   ref,
//   returnKeyType,
//   onSubmitEditing,
//   blurOnSubmit,
//   error}: props) => {
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   return (
//     <View style={{marginVertical: 10}}>
//       <Text style={styles.title}>{title}</Text>
//       {/* <View style={styles.border}> */}
//         {/*"border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row"*/}
//         <TextInput
//           style={[globalStyles.input, otherStyles, error ? styles.errorBorder : null]}//לבדוק את זה
//           value={value.toString()}
//           placeholder={placeholder}
//           placeholderTextColor="#7b7b8b"
//           keyboardType={keyboardType || "default"}
//           onChangeText={handleChangeText}
//           onBlur={handeleBlur}
//           secureTextEntry={title === "סיסמה" && !showPassword}
//           multiline={multiline}
//           maxLength={maxLength}
//           ref={ref}
//           returnKeyType={returnKeyType}
//           onSubmitEditing={onSubmitEditing}
//           blurOnSubmit={blurOnSubmit}
//         />
//         {title === "סיסמה" && (
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               {showPassword ? <Entypo name="eye" size={24} color="black" /> :
//               <Entypo name="eye-with-line" size={24} color="black" />}
//             {/* <Image
//               source={!showPassword ? icons.eye : icons.eyeHide}
//               className="w-6 h-6"
//               resizeMode="contain"
//             /> */}
//           </TouchableOpacity>
//         )}
//       {/* </View> */}
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };
