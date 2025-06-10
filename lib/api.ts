// src/api/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// 環境変数からAPIベースURLを取得
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// 共通axiosインスタンス（将来の拡張にも対応）
const api = axios.create({
  baseURL: API_URL,
});

// トークンがある場合、自動でAuthorizationヘッダーを付与
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (username: string, password: string) => {
  try {
    const res = await api.post('/token/', { username, password });
    return res.data; // { access, refresh }
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || 'ログインに失敗しました');
  }
};

export const registerUser = async (username: string, password: string) => {
  try {
    const res = await api.post('/register/', { username, password });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || '登録に失敗しました');
  }
};

export const getProfile = async () => {
  try {
    const res = await api.get('/profile/');
    return res.data;
  } catch (err: any) {
    throw new Error('プロフィールの取得に失敗しました');
  }
};
