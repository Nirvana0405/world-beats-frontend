// lib/auth.ts

// 🔐 トークンキーの定義（変更しやすくするため）
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_ID_KEY = "user_id";

// ✅ ログイン判定（SSR対応済み）
export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(ACCESS_TOKEN_KEY);
};

// ✅ アクセストークンを取得（SSR対応）
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
};

// ✅ ログアウト処理（localStorageからすべて削除 & リダイレクト）
export const logoutUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);

    // リダイレクト先を明示
    window.location.href = "/login"; // または "/" に変更可能
  }
};
