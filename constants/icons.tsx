import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import React from "react";

type IconProps = { color: string; focused: boolean };
type IconComponent = (props: IconProps) => React.ReactElement;

interface IconDictionary {
  [key: string]: IconComponent;
  map: IconComponent;
  search: IconComponent;
  donors: IconComponent;
  donations: IconComponent;
  profile: IconComponent;
}

export const icon: IconDictionary = {
  map: ({ color, focused }: IconProps) =>
    focused ? (
      <Ionicons name="map" size={24} color={color} />
    ) : (
      <Ionicons name="map-outline" size={24} color={color} />
    ),
  search: ({ color, focused }: IconProps) =>
    focused ? (
      <Ionicons name="compass" size={24} color={color} />
    ) : (
      <Ionicons name="compass-outline" size={24} color={color} />
    ),
  donors: ({ color, focused }: IconProps) =>
    focused ? (
      <FontAwesome5 name="donate" size={24} color={color} />
    ) : (
      <FontAwesome5 name="donate" size={24} color={color} />
    ),
  donations: ({ color, focused }: IconProps) =>
    focused ? (
      <FontAwesome5 name="donate" size={24} color={color} />
    ) : (
      <FontAwesome5 name="donate" size={24} color={color} />
    ),
  profile: ({ color, focused }: IconProps) =>
    focused ? (
      <Ionicons name="person" size={24} color={color} />
    ) : (
      <Ionicons name="person-outline" size={24} color={color} />
    ),
};
