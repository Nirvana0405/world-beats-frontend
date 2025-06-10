import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (
  username: string,
  password: string
): Promise<{ access: string; refresh: string }> => {
  try {
    const res = await api.post<{ access: string; refresh: string }>("/token/", {
      username,
      password,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "ログインに失敗しました");
    }
    throw new Error("ログインに失敗しました");
  }
};

export const registerUser = async (
  username: string,
  password: string
): Promise<{ id: number; username: string }> => {
  try {
    const res = await api.post<{ id: number; username: string }>("/register/", {
      username,
      password,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "登録に失敗しました");
    }
    throw new Error("登録に失敗しました");
  }
};

export const getProfile = async (): Promise<{
  id: number;
  display_name: string;
  bio: string;
  favorite_genres: string[];
  favorite_artists: string;
  icon?: string;
}> => {
  try {
    const res = await api.get("/profile/");
    return res.data;
  } catch (error: unknown) {
    console.error("プロフィール取得エラー:", error); // ← これ重要（err未使用対策）
    throw new Error("プロフィールの取得に失敗しました");
  }
};
