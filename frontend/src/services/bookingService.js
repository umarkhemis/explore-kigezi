import api from './api';

export const getMyBookings = () =>
  api.get('/api/bookings/my/').then((r) => r.data);

export const cancelBooking = (id) =>
  api.post(`/api/bookings/${id}/cancel/`).then((r) => r.data);

export const createBooking = (data) =>
  api.post('/api/bookings/', data).then((r) => r.data);

export const getBooking = (ref) =>
  api.get(`/api/bookings/${ref}/`).then((r) => r.data);
