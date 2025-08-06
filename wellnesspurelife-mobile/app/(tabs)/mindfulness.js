import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function MindfulnessScreen() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindData = async () => {
      try {
        const res = await fetch("https://wellnesspurelife.com/api/news");
        const data = await res.json();
        setResources(
          data.filter(
            (item) =>
              item.category === "mind" || item.tags?.includes("mindfulness")
          )
        );
      } catch (err) {
        console.error("Error fetching mindfulness content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMindData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={resources}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    padding: 16,
    backgroundColor: "#e6f2f3",
    marginBottom: 12,
    borderRadius: 8,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});
