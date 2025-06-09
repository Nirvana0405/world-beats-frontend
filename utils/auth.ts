// utils/auth.ts
import Cookies from 'js-cookie';

export const setToken = (token: string) => {
  Cookies.set('access_token', token, { expires: 1 }); // 有効期限1日
};

export const getToken = () => {
  return Cookies.get('access_token');
};

export const removeToken = () => {
  Cookies.remove('access_token');
};
