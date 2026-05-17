import { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

export type UserRole = "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync("auth_token");
        const storedUser = await SecureStore.getItemAsync("auth_user");

        if (storedToken && storedUser) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao recuperar os dados do storage", error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post("/login", { email, password });

      const { token, user: userData } = response.data;

      await SecureStore.setItemAsync("auth_token", token);
      await SecureStore.setItemAsync("auth_user", JSON.stringify(userData));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || "Erro desconhecido ao fazer login.",
        );
      }

      throw new Error(
        "Não foi possível conectar ao servidor. Verifique sua rede.",
      );
    }
  }

  async function signOut() {
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("auth_user");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
