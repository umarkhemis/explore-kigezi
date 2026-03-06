import api from './api';

export const getAdminHosts = (params) =>
  api.get('/api/admin/hosts/', { params }).then((r) => r.data);

export const approveHost = (id) =>
  api.post(`/api/admin/hosts/${id}/approve/`).then((r) => r.data);

export const rejectHost = (id, reason) =>
  api.post(`/api/admin/hosts/${id}/reject/`, { reason }).then((r) => r.data);

export const getAdminBookings = (params) =>
  api.get('/api/admin/bookings/', { params }).then((r) => r.data);

export const getAdminStats = () =>
  api.get('/api/admin/stats/').then((r) => r.data);
