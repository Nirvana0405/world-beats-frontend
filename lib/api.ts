import axios from 'axios';
import Cookies from 'js-cookie';

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post('http://127.0.0.1:8000/api/token/', {
    username,
    password,
  });
  return response.data; // { access, refresh }
};

export const registerUser = async (username: string, password: string) => {
  const response = await axios.post('http://127.0.0.1:8000/api/register/', {
    username,
    password,
  });
  return response.data;
};

export const getProfile = async () => {
  const token = Cookies.get('access_token');
  const res = await axios.get('http://127.0.0.1:8000/api/profile/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
