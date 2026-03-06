import api from './api';

export const login = (credentials) =>
  api.post('/api/auth/token/', credentials).then((r) => r.data);

export const register = (data) =>
  api.post('/api/auth/register/', data).then((r) => r.data);

export const refreshToken = (refresh) =>
  api.post('/api/auth/token/refresh/', { refresh }).then((r) => r.data);

export const getMe = () => api.get('/api/auth/me/').then((r) => r.data);
