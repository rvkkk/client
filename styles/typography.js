import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    direction: "rtl"
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    color: colors.textLight,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "light",
    color: colors.error,
    textAlign: 'center',
    margin: 10,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    textAlign: "center",
  },
  removeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.error,
    textAlign: "center",
    marginTop: 15
  },
});