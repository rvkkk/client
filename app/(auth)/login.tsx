import Input from "@/components/Input";
import { colors } from "@/styles/colors";
import { globalStyles } from "@/styles/globalStyles";
import { typography } from "@/styles/typography";
import React, { useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/utils/api/auth";
import { router } from "expo-router";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  email: z.string().min(1, "שדה חובה").email('כתובת דוא"ל לא תקינה'),
  password: z
    .string()
    .min(1, "שדה חובה")
    .min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
});

type FormFields = z.infer<typeof schema>;

const Login = () => {
  const {
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setError,
    control,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });
  const { setIsLogged } = useAuth();

  const passwordInputRef = useRef<TextInput>(null);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await login(data);
      setIsLogged!(true);
      router.replace("/drawer");
    } catch (error: any) {
      setError("root", {
        message: "אחד מהנתונים שהקשת שגוי",
      });
    }
  };

  if (isSubmitting) {
    return <Loading size={"large"} />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={typography.header}>התחברות</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="אימייל"
            value={value}
            handleChangeText={onChange}
            handeleBlur={onBlur}
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
            returnKeyType="send"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
      <TouchableOpacity style={{ direction: "rtl" }}>
        <Text style={styles.forgetPassword}>שכחת סיסמה?</Text>
      </TouchableOpacity>
      {errors.root && (
        <Text style={typography.errorText}>{errors.root.message}</Text>
      )}
      <Button
        title="התחברות"
        handlePress={handleSubmit(onSubmit)}
        containerStyles={{ marginTop: 20 }}
        isLoading={false}
      />
      <Button
        title="GOOGLE LOGIN"
        handlePress={() => router.push("/(auth)/register")}
        containerStyles={styles.googleLogin}
        textStyles={styles.googleText}
        isLoading={false}
      />
      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={typography.linkText}>אין לך חשבון? הירשם כאן</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  forgetPassword: {
    ...typography.body,
    color: "#1976D2",
    writingDirection: "rtl",
  },
  googleLogin: {
    backgroundColor: colors.secondary,
  },
  googleText: {
    fontWeight: "bold",
    color: colors.primary,
    fontSize: 18,
  },
});

export default Login;
