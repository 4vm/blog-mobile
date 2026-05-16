import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function IndexScreen() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        console.log("Usuário logado! Redirecionando para a Home...");
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, loading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#3182CE" />
    </View>
  );
}
