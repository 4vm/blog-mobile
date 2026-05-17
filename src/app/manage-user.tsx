import { Ionicons } from "@expo/vector-icons";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { UserData, userService } from "../services/userService";

export default function ManageUserScreen() {
  const { user: currentUser } = useAuth();

  if (currentUser?.role !== "TEACHER") {
    return <Redirect href="/" />;
  }

  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;
      try {
        const user = await userService.getById(id);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
      } catch (error) {
        Alert.alert("Erro", "Usuário não encontrado.");
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  async function handleSave() {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Atenção", "Nome e e-mail são obrigatórios.");
      return;
    }

    if (!isEditing && !password.trim()) {
      Alert.alert("Atenção", "A senha é obrigatória para novos usuários.");
      return;
    }

    try {
      setSaving(true);

      const userData: Partial<UserData> = {
        name,
        email,
        role,
      };

      if (password.trim()) {
        userData.password = password;
      }

      if (isEditing) {
        await userService.update(id, userData);
        Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
      } else {
        await userService.create(userData);
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      }

      router.back();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      Alert.alert("Erro ao salvar", errorMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3182CE" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="close" size={28} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Editar Usuário" : "Novo Usuário"}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: João Silva"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="exemplo@escola.com"
        />

        <Text style={styles.label}>
          {isEditing ? "Nova Senha (opcional)" : "Senha"}
        </Text>
        <TextInput
          style={[styles.input, styles.lastInput]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Usuário</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#1A202C",
  },
  lastInput: {
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: "#3182CE",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
