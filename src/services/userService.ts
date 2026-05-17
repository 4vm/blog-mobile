import { api } from "./api";

export interface UserData {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "STUDENT" | "TEACHER";
  adminKey?: string;
}

export const userService = {
  create: async (data: Partial<UserData>) => {
    const { adminKey, ...userData } = data;

    const response = await api.post<UserData>("/register", userData, {
      headers: {
        "x-admin-key": adminKey,
      },
    });
    return response.data;
  },

  getAll: async (role?: "STUDENT" | "TEACHER") => {
    const response = await api.get<UserData[]>("/users", { params: { role } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<UserData>(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<UserData>) => {
    const response = await api.put<UserData>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
