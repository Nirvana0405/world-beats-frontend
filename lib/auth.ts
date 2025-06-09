import Cookies from 'js-cookie';

/**
 * アクセストークンを保存（1日間）
 */
export const setToken = (token: string) => {
  Cookies.set('access_token', token, { expires: 1 });
};

/**
 * アクセストークンを取得（クライアント限定）
 */
export const getToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get('access_token');
};

/**
 * トークンを削除
 */
export const removeToken = () => {
  Cookies.remove('access_token');
};

/**
 * ログイン判定（SSR対策付き）
 */
export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!Cookies.get('access_token');
};

/**
 * ログアウト処理
 */
export const logoutUser = () => {
  removeToken();
};
