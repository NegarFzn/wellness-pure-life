import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { router } from "expo-router";
import { registerForPushNotificationsAsync } from "../../src/utils/notifications";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);

          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            console.log("Push Token:", pushToken);

            await fetch(
              "https://wellnesspurelife.com/api/notifications/token",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: decoded.id,
                  token: pushToken,
                }),
              }
            );
          }
        } catch (e) {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        }
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  const sendTestNotification = async () => {
    const res = await fetch(
      "https://wellnesspurelife.com/api/notifications/send",
      {
        method: "POST",
      }
    );
    const data = await res.json();
    Alert.alert("Notification Result", JSON.stringify(data));
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name: {user.name}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      <Text style={styles.label}>
        Premium: {user.isPremium ? "✅ Yes" : "❌ No"}
      </Text>
      <Button title="Send Test Notification" onPress={sendTestNotification} />
      <Button title="Logout" onPress={handleLogout} color="#cc0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 16 },
  label: { fontSize: 18, marginBottom: 10 },
});
