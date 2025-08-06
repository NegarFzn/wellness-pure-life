import { ScrollView, StyleSheet, View } from "react-native";

export default function ParallaxScrollView({ children }) {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  container: { padding: 16 },
});
