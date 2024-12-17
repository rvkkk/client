import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { router } from "expo-router";
  import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
  import { StatusBar } from "expo-status-bar";
  import { colors } from "@/styles/colors";
  import { useAuth } from "@/contexts/AuthContext";
  
  const Page = () => {
    const { isLogged } = useAuth();
  
    return (
      <View style={styles.container}>
        <StatusBar style="light"/>
        <ImageBackground
          source={require("@/assets/images/coins.png")}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <View style={styles.wrapper}>
            <Animated.Text
              style={styles.title}
              entering={FadeInRight.delay(300).duration(500)}
            >
              שנורר
            </Animated.Text>
            <Animated.Text
              style={styles.description}
              entering={FadeInRight.delay(700).duration(500)}
            >
              האפליקציה שתעזור לך לעשות שנורר בצורה הטובה ביותר
            </Animated.Text>
            <Animated.View entering={FadeInDown.delay(1200).duration(500)}>
              <TouchableOpacity
                style={styles.btn}
                //onPress={() => isLogged ? navigation.replace("login") : navigation.replace("auth")}
                onPress={() => isLogged ? router.replace("/drawer") : router.replace("/(auth)/login")}
              >
                <Text style={styles.btnText}>בוא נתחיל</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ImageBackground>
      </View>
    );
  };
  
  export default Page;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    wrapper: {
      flex: 1,
      justifyContent: "flex-end",
      paddingBottom: 50,
      paddingHorizontal: 30,
      gap: 10,
      backgroundColor: "rgba(0,0,0,0.5)"
    },
    title: {
      color: colors.white,
      fontSize: 24,
      fontWeight: "bold",
      letterSpacing: 1.5,
      lineHeight: 36,
      textAlign: "center",
    },
    description: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "500",
      letterSpacing: 1.2,
      lineHeight: 22,
      textAlign: "center",
    },
    btn: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      marginVertical: 20,
      alignItems: "center",
      borderRadius: 10
    },
    btnText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "700"
    }
  });
  