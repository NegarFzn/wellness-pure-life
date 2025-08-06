import { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  Platform,
  StyleSheet,
  Button,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { HelloWave } from "../../components/HelloWave";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to WellnessPureLife!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Explore Features</ThemedText>
        <ThemedText>
          Navigate using the tabs below to discover personalized wellness tools,
          nutrition plans, and fitness routines.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Quick Tip</ThemedText>
        <ThemedText>
          To access developer tools, press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "Cmd + D",
              android: "Cmd + M",
              web: "F12",
            })}
          </ThemedText>
        </ThemedText>
      </ThemedView>

      <View style={styles.logoutContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          accessibilityLabel="Logout and return to login screen"
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 12,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  logoutContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
});
