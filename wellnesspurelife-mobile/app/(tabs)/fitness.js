import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FitnessScreen() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("https://wellnesspurelife.com/api/challenge");
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const addToFavorites = async (plan) => {
    try {
      const stored = await AsyncStorage.getItem("fitnessFavorites");
      const favorites = stored ? JSON.parse(stored) : [];
      const alreadyExists = favorites.some((fav) => fav.title === plan.title);
      if (alreadyExists) {
        Alert.alert("Already added", "This plan is already in your favorites.");
        return;
      }
      favorites.push(plan);
      await AsyncStorage.setItem("fitnessFavorites", JSON.stringify(favorites));
      Alert.alert("Added!", "Plan added to favorites.");
    } catch (err) {
      console.error("Error saving favorite:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={plans}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>Level: {item.level}</Text>
          <Text>{item.description}</Text>
          <Button
            title="Add to Favorites"
            onPress={() => addToFavorites(item)}
          />
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
    backgroundColor: "#f0f4f8",
    marginBottom: 12,
    borderRadius: 8,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});
