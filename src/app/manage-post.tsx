import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { postService } from "../services/postService";

export default function ManagePostScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(user?.name || "");
  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPostToEdit() {
      if (!id) return;
      try {
        const post = await postService.getById(id);
        setTitle(post.title);
        setContent(post.content);
        setPublished(post.published);

        if (post.authorName) setAuthorName(post.authorName);
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível carregar a postagem para edição.",
        );
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchPostToEdit();
  }, [id]);

  async function handleSave() {
    if (!title.trim() || !content.trim() || !authorName.trim()) {
      Alert.alert(
        "Atenção",
        "Autor, título e conteúdo são campos obrigatórios.",
      );
      return;
    }

    try {
      setSaving(true);

      const postData = {
        title,
        content,
        published,
        authorId: user?.id || "",
        authorName: authorName.trim(),
      };

      if (isEditing) {
        await postService.update(id, postData);
        Alert.alert("Sucesso", "Postagem atualizada com sucesso!");
      } else {
        await postService.create(postData);
        Alert.alert("Sucesso", "Postagem criada com sucesso!");
      }

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro ao salvar",
        error.response?.data?.message || error.message,
      );
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
          {isEditing ? "Editar Post" : "Novo Post"}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Autor</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do autor"
          value={authorName}
          onChangeText={setAuthorName}
        />

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o título da postagem"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Conteúdo</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escreva o conteúdo aqui..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? "Salvar Alterações" : "Criar Postagem"}
            </Text>
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
    marginTop: Platform.OS === "ios" ? 40 : 0,
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
    fontSize: 16,
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
    color: "#1A202C",
    marginBottom: 20,
  },
  textArea: {
    height: 150,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
