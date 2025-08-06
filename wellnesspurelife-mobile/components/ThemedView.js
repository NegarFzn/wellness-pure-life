import { View } from "react-native";

export const ThemedView = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};
