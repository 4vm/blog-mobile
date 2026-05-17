import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3182CE",
        headerTitleAlign: "center",
      }}
    >
      {/* Aba Pública (Alunos e Professores) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Postagens",
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text" size={24} color={color} />
          ),
        }}
      />

      {/* Aba Administrativa */}
      <Tabs.Screen
        name="admin"
        options={{
          title: "Painel Admin",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
          href: user?.role === "TEACHER" ? "/admin" : null,
        }}
      />
    </Tabs>
  );
}
