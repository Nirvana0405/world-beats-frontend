// src/lib/auth.ts
import Cookies from 'js-cookie';

/**
 * アクセストークンを保存（1日間）
 */
export const setToken = (token: string) => {
  Cookies.set('access_token', token, { expires: 1 }); // 1日間保存
};

/**
 * アクセストークンを取得（クライアント限定）
 */
export const getToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get('access_token');
};

/**
 * アクセストークンを削除
 */
export const removeToken = () => {
  Cookies.remove('access_token');
};

/**
 * ログイン判定（クライアント実行のみ）
 */
export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!Cookies.get('access_token');
};

/**
 * ログアウト処理（追加で必要ならリダイレクトもここで）
 */
export const logoutUser = () => {
  removeToken();
  // 例: 画面遷移を含めるならここで router.push('/login') などを使う
};
