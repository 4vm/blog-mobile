import { api } from "./api";

export interface PostData {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  published: boolean;
}

export const postService = {
  getAll: async () => {
    const response = await api.get<PostData[]>("/posts");
    return response.data;
  },

  search: async (keyword: string) => {
    const response = await api.get<PostData[]>(`/posts/search`, {
      params: { q: keyword },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<PostData>(`/posts/${id}`);
    return response.data;
  },

  create: async (data: Omit<PostData, "id">) => {
    const response = await api.post<PostData>("/posts", data);
    return response.data;
  },

  update: async (id: string, data: Partial<PostData>) => {
    const response = await api.put<PostData>(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};
