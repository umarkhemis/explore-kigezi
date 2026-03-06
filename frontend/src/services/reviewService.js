



import api from './api';

export const createReview = async (data) => {
  const res = await api.post('/reviews/', data);
  return res.data;
};

export const respondToReview = async (id, response) => {
  const res = await api.put(`/reviews/${id}/respond/`, {
    host_response: response,
  });
  return res.data;
};

export const getMyReviews = async () => {
  try {
    const { data } = await api.get('/reviews/my/');
    return data;
  } catch {
    return [];
  }
};