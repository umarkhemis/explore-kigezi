




import api from './api';

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login/', { email, password });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register/', userData);
  return data;
};

export const registerHost = async (userData) => {
  const { data } = await api.post('/hosts/register/', userData);
  return data;
};

export const logoutUser = async (refreshToken) => {
  await api.post('/auth/logout/', { refresh: refreshToken });
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me/');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.patch('/auth/me/update/', profileData);
  return data;
};