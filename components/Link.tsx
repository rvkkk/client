import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { typography } from "@/styles/typography";
import { useRouter } from "expo-router";

type Props = {
  href: string;
    text: string;
}

const CustomerLink: React.FC<Props> = ({ href, text }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(href as any);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={typography.linkText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomerLink;