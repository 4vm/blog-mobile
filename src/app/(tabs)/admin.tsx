import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PostData, postService } from "../../services/postService";
import { UserData, userService } from "../../services/userService";

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");

  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

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

  async function handleDeletePost(id: string) {
    Alert.alert(
      "Excluir Postagem",
      "Tem certeza que deseja apagar este post?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await postService.delete(id);
              Alert.alert("Sucesso", "Postagem excluída!");
              loadPosts();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a postagem.");
            }
          },
        },
      ],
    );
  }

  async function loadUsers() {
    try {
      setLoadingUsers(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os usuários.");
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleDeleteUser(id: string) {
    Alert.alert(
      "Excluir Usuário",
      "Tem certeza que deseja apagar este usuário? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await userService.delete(id);
              Alert.alert("Sucesso", "Usuário excluído!");
              loadUsers();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o usuário.");
            }
          },
        },
      ],
    );
  }

  useEffect(() => {
    if (activeTab === "posts") loadPosts();
    else loadUsers();
  }, [activeTab]);

  const renderPostItem = ({ item }: { item: PostData }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>
          Status: {item.published ? "🟢 Publicado" : "🔴 Rascunho"}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            item.id && router.push(`/manage-post?id=${item.id}` as any)
          }
        >
          <Ionicons name="pencil" size={20} color="#3182CE" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => item.id && handleDeletePost(item.id)}
        >
          <Ionicons name="trash" size={20} color="#E53E3E" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserItem = ({ item }: { item: UserData }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.email}</Text>
        <View
          style={[
            styles.roleBadge,
            item.role === "TEACHER" ? styles.badgeTeacher : styles.badgeStudent,
          ]}
        >
          <Text style={styles.badgeText}>
            {item.role === "TEACHER" ? "Professor" : "Aluno"}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        {/* Botão de Editar Usuário Atualizado */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            item.id && router.push(`/manage-user?id=${item.id}` as any)
          }
        >
          <Ionicons name="pencil" size={20} color="#3182CE" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => item.id && handleDeleteUser(item.id)}
        >
          <Ionicons name="trash" size={20} color="#E53E3E" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Admin</Text>
        {/* Botão de Criar Atualizado */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            if (activeTab === "posts") router.push("/manage-post");
            else router.push("/manage-user");
          }}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>
            {activeTab === "posts" ? "Novo Post" : "Novo Usuário"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "posts" && styles.activeTabText,
            ]}
          >
            Postagens
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "users" && styles.activeTabText,
            ]}
          >
            Usuários
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "posts" ? (
        loadingPosts ? (
          <ActivityIndicator
            size="large"
            color="#3182CE"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={renderPostItem}
            contentContainerStyle={styles.listContent}
            refreshing={loadingPosts}
            onRefresh={loadPosts}
          />
        )
      ) : loadingUsers ? (
        <ActivityIndicator
          size="large"
          color="#3182CE"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          refreshing={loadingUsers}
          onRefresh={loadUsers}
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A202C",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#48BB78",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "#3182CE",
  },
  tabText: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#3182CE",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeTeacher: {
    backgroundColor: "#EBF4FF",
  },
  badgeStudent: {
    backgroundColor: "#E6FFFA",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2B6CB0",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginLeft: 16,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
  },
});
