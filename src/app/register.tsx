import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { userService } from "../services/userService";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [adminKey, setAdminKey] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(
        "Atenção",
        "Por favor, preencha todos os campos obrigatórios.",
      );
      return;
    }

    if (role === "TEACHER" && !adminKey.trim()) {
      Alert.alert(
        "Chave Obrigatória",
        "Professores precisam inserir a Admin Key para cadastro.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Chama o endpoint público de registro via userService
      await userService.create({
        name,
        email,
        password,
        role,
        adminKey: role === "TEACHER" ? adminKey : undefined,
      });

      Alert.alert("Sucesso 🎉", "Conta criada com sucesso! Faça seu login.");
      router.replace("/login");
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message;
      Alert.alert("Erro no Cadastro", msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Maria Souza"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: maria@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Seleção de Perfil na Criação Pública */}
        <View style={styles.switchContainer}>
          <Text style={styles.labelSwitch}>Você é um Professor?</Text>
          <Switch
            value={role === "TEACHER"}
            onValueChange={(val) => setRole(val ? "TEACHER" : "STUDENT")}
            trackColor={{ false: "#CBD5E0", true: "#90CDF4" }}
            thumbColor={role === "TEACHER" ? "#3182CE" : "#f4f3f4"}
          />
        </View>

        {/* Exibe o campo de chave APENAS se marcar a opção de Professor */}
        {role === "TEACHER" && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Admin Key (Chave do Sistema)</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a chave de segurança"
              value={adminKey}
              onChangeText={setAdminKey}
              secureTextEntry
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar e Entrar</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
  },
  content: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8,
  },
  labelSwitch: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1A202C",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  button: {
    backgroundColor: "#48BB78",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A3E635",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
