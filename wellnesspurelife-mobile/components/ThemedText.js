import { Text, StyleSheet } from "react-native";

export const ThemedText = ({ children, type = "default" }) => {
  return <Text style={[styles.text, styles[type]]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  defaultSemiBold: {
    fontWeight: "600",
  },
});
