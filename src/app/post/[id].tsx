import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PostData, postService } from "../../services/postService";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await postService.getById(id);
        setPost(data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar esta postagem.");
        router.back();
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3182CE" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Postagem não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leitura</Text>
        <View style={{ width: 24 }} />{" "}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.metaContainer}>
          <Ionicons name="person-circle-outline" size={20} color="#718096" />
          <Text style={styles.author}>
            Por: {post.authorName || "Autor Desconhecido"}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.bodyText}>{post.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  author: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 16,
    color: "#2D3748",
    lineHeight: 28,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
