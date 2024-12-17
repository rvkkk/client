import Input from "@/components/Input";
import { colors } from "@/styles/colors";
import { globalStyles } from "@/styles/globalStyles";
import { typography } from "@/styles/typography";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/utils/api/auth";
import { router } from "expo-router";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import CustomCheckbox from "@/components/Checkbox";
import { useAuth } from "@/contexts/AuthContext";

const schema = z
  .object({
    firstName: z.string().min(1, "שדה חובה"),
    lastName: z.string().min(1, "שדה חובה"),
    email: z.string().min(1, "שדה חובה").email('כתובת דוא"ל לא תקינה'),
    password: z
      .string()
      .min(1, "שדה חובה")
      .min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
    confirmPassword: z.string().min(1, "שדה חובה"),
    phoneNumber: z
      .string()
      .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "מספר טלפון לא תקין")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "הסיסמאות אינן תואמות",
  });

type SignUpSchema = z.infer<typeof schema>;

const Register = () => {
  const {
    handleSubmit,
    formState: { errors, isLoading },
    setError,
    control,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { setIsLogged } = useAuth();
  const [isChecked, setIsChecked] = useState(false);

  const lastNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const phoneNumberInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (errors.root?.message != undefined) {
      console.log(1);
      setError("root", { message: undefined });
    }
  }, [isChecked]);

  const onSubmit = async (data: SignUpSchema) => {
    if (!isChecked) {
      setError("root", {
        message: "עליך לאשר את תנאי האתר לצורך ההרשמה",
      });
      return;
    }
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber || "",
      });
      setIsLogged!(true);
      router.replace("/drawer");
    } catch (error: any) {
      setError("root", {
        message: "אחד מהנתונים שהקשת שגוי",
      });
    }
  };

  if (isLoading) {
    return <Loading size={"large"} />;
  }

  return (
    <ScrollView style={globalStyles.container} keyboardDismissMode="on-drag">
      <Text style={typography.header}>הרשמה</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="שם פרטי"
            value={value}
            handleChangeText={onChange}
            handeleBlur={onBlur}
            error={errors.firstName?.message}
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
            handleChangeText={onChange}
            handeleBlur={onBlur}
            ref={lastNameInputRef}
            error={errors.lastName?.message}
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
            value={value}
            handleChangeText={onChange}
            handeleBlur={onBlur}
            ref={emailInputRef}
            error={errors.email?.message}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="סיסמה"
            value={value}
            handleChangeText={onChange}
            handeleBlur={onBlur}
            ref={passwordInputRef}
            error={errors.password?.message}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            blurOnSubmit={"submit"}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="אימות סיסמה"
            value={value}
            handleChangeText={onChange}
            handeleBlur={onBlur}
            ref={confirmPasswordInputRef}
            error={errors.confirmPassword?.message}
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
            handleChangeText={onChange}
            handeleBlur={onBlur}
            ref={phoneNumberInputRef}
            error={errors.phoneNumber?.message}
            keyboardType="phone-pad"
            returnKeyType="send"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
      {errors.root?.message && (
        <Text style={typography.errorText}>{errors.root.message}</Text>
      )}
      <CustomCheckbox
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        title="אני מסכים לכל התנאים של האתר"
      />
      <Button
        title="הרשמה"
        handlePress={handleSubmit(onSubmit)}
        containerStyles={{ marginTop: 20 }}
        isLoading={false}
      />
      <Button
        title="GOOGLE SIGNIN"
        handlePress={handleSubmit(onSubmit)} //registerWithGoogle
        containerStyles={styles.googleLogin}
        textStyles={styles.googleText}
        isLoading={false}
      />
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={typography.linkText}>כבר יש לך חשבון? התחבר כאן</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  googleLogin: {
    backgroundColor: colors.secondary,
    marginBottom: 50
  },
  googleText: {
    fontWeight: "bold",
    color: colors.primary,
    fontSize: 18,
  },
});

export default Register;
