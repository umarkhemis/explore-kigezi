import api from './api';

export const getHostStats = () =>
  api.get('/api/hosts/dashboard/stats/').then((r) => r.data);

export const getHostBookings = (params) =>
  api.get('/api/hosts/bookings/', { params }).then((r) => r.data);

export const getHostExperiences = () =>
  api.get('/api/hosts/experiences/').then((r) => r.data);

export const updateBookingStatus = (id, status) =>
  api.patch(`/api/hosts/bookings/${id}/`, { status }).then((r) => r.data);

export const createExperience = (data) =>
  api
    .post('/api/experiences/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const updateExperience = (id, data) =>
  api
    .patch(`/api/experiences/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const deleteExperience = (id) =>
  api.delete(`/api/experiences/${id}/`).then((r) => r.data);

export const toggleExperienceStatus = (id, isActive) =>
  api.patch(`/api/experiences/${id}/`, { is_active: isActive }).then((r) => r.data);

export const registerHost = (data) =>
  api
    .post('/api/hosts/register/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const getCategories = () =>
  api.get('/api/experiences/categories/').then((r) => r.data);
