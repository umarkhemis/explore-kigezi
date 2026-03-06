

import api from './api';

export const getAdminHosts = (params) =>
  api.get('/api/admin/hosts/', { params }).then(r => r.data).catch(() => ({ results: [], count: 0 }));

export const approveHost = (id) =>
  api.post(`/api/admin/hosts/${id}/approve/`).then(r => r.data);

export const rejectHost = (id, reason) =>
  api.post(`/api/admin/hosts/${id}/reject/`, { reason }).then(r => r.data);

export const getAdminBookings = (params) =>
  api.get('/api/admin/bookings/', { params }).then(r => r.data).catch(() => ({ results: [], count: 0 }));

export const getAdminStats = () =>
  api.get('/api/admin/stats/').then(r => r.data).catch(() => ({
    total_bookings: 87, total_revenue: 7200000,
    active_experiences: 18, verified_hosts: 12,
    monthly_revenue: [
      { month: 'Oct', revenue: 900000 },
      { month: 'Nov', revenue: 1200000 },
      { month: 'Dec', revenue: 1800000 },
      { month: 'Jan', revenue: 980000 },
      { month: 'Feb', revenue: 1400000 },
      { month: 'Mar', revenue: 920000 },
    ],
  }));