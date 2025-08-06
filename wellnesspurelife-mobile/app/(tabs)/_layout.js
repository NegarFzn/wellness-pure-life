import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "index":
              return <Ionicons name="home-outline" size={size} color={color} />;
            case "fitness":
              return (
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={size}
                  color={color}
                />
              );
            case "nourish":
              return (
                <Ionicons name="restaurant-outline" size={size} color={color} />
              );
            case "mindfulness":
              return (
                <MaterialCommunityIcons
                  name="meditation"
                  size={size}
                  color={color}
                />
              );
            case "favorites":
              return (
                <Ionicons name="heart-outline" size={size} color={color} />
              );
            case "profile":
              return (
                <Ionicons name="person-outline" size={size} color={color} />
              );
            default:
              return null;
          }
        },
      })}
    />
  );
}
