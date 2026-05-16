import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { PostData, postService } from "../../services/postService";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [keyword, setKeyword] = useState("");

  async function loadPosts() {
    try {
      setLoadingPosts(true);
      const data = await postService.getAll();
      setPosts(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as postagens.");
    } finally {
      setLoadingPosts(false);
    }
  }

  async function handleSearch() {
    if (!keyword.trim()) {
      return loadPosts();
    }

    try {
      setLoadingPosts(true);
      const data = await postService.search(keyword);
      setPosts(data);
    } catch (error: any) {
      Alert.alert("Aviso", "Nenhum post encontrado com essa palavra.");
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const renderPost = ({ item }: { item: PostData }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.id) {
          router.push(`/post/${item.id}` as any);
        }
      }}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postAuthor}>
        Por: {item.authorName || "Autor Desconhecido"}
      </Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name}</Text>
          <Text style={styles.role}>{user?.role}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#E53E3E" />
        </TouchableOpacity>
      </View>

      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts..."
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Listagem de Posts */}
      {loadingPosts ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3182CE" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma postagem disponível.</Text>
          }
          refreshing={loadingPosts}
          onRefresh={loadPosts}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A202C",
  },
  role: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
  },
  searchButton: {
    backgroundColor: "#3182CE",
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 4,
  },
  postAuthor: {
    fontSize: 12,
    color: "#3182CE",
    marginBottom: 8,
    fontWeight: "600",
  },
  postContent: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#A0AEC0",
    marginTop: 40,
    fontSize: 16,
  },
});
