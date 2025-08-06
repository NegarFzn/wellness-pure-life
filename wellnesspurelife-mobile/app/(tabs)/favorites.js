import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem("fitnessFavorites");
        const favs = stored ? JSON.parse(stored) : [];
        setFavorites(favs);
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = loadFavorites();
    return () => unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No favorites yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>Level: {item.level}</Text>
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
    backgroundColor: "#e6fcf5",
    marginBottom: 12,
    borderRadius: 8,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});
