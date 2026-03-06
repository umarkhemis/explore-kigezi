import api from './api';

export const getExperiences = (params) =>
  api.get('/api/experiences/', { params }).then((r) => r.data);

export const getExperience = (id) =>
  api.get(`/api/experiences/${id}/`).then((r) => r.data);
