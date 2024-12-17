import { View, Text, ScrollView, TextInput } from "react-native";
import React, { useEffect, useRef } from "react";
import Input from "@/components/Input";
import { Context, useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import { updateMyProfile } from "@/utils/api/users";
import { globalStyles } from "@/styles/globalStyles";
import { typography } from "@/styles/typography";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/Loading";

const schema = z.object({
  firstName: z.string().min(1, "שדה חובה"),
  lastName: z.string().min(1, "שדה חובה"),
  email: z.string().min(1, "שדה חובה").email('כתובת דוא"ל לא תקינה'),
  phoneNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "מספר שגוי").optional(),
});

type ProfileSchema = z.infer<typeof schema>;

const Profile = () => {
  const { user, setUser, isLogged }: Context = useAuth();

  const {
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setError,
    control,
    setValue
  } = useForm<ProfileSchema>({
    resolver: zodResolver(schema),
  });

  const lastNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const phoneNumberInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('email', user.email || '');
      setValue('phoneNumber', user.phoneNumber || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileSchema) => {
    try {
      await updateMyProfile({ _id: user!._id, ...data, phoneNumber: data.phoneNumber || "" });
      setUser!({ _id: user!._id,  ...data, phoneNumber: data.phoneNumber || "", totalDonations: user!.totalDonations, });
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
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={{ justifyContent: "center" }}
    >
      <Text style={typography.header}>פרופיל אישי</Text>
      {isLogged && user ? (
        <View>
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
                keyboardType="default"
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
                handeleBlur={onBlur}
                error={errors.lastName?.message}
                keyboardType="default"
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
                ref={emailInputRef}
                handleChangeText={onChange}
                handeleBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
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
                handeleBlur={onBlur}
                error={errors.phoneNumber?.message}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.root && (
            <Text style={typography.errorText}>{errors.root.message}</Text>
          )}
          <Button
            title="עדכן פרטים"
            handlePress={handleSubmit(onSubmit)}
            containerStyles={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <View>
          <Text style={typography.subheader}>אינך רשום למערכת, אנא התחבר</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Profile;
