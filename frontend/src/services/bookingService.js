


import api from './api';
import { mockBookings } from '../data/mockData';

export const createBooking = async (data) => {
  const res = await api.post('/bookings/', data);
  return res.data;
};

export const getMyBookings = async (statusFilter) => {
  try {
    const params = statusFilter ? { status: statusFilter } : {};
    const { data } = await api.get('/bookings/my/', { params });
    return data;
  } catch {
    return mockBookings;
  }
};

export const getBookingByReference = async (reference) => {
  try {
    const { data } = await api.get(`/bookings/reference/${reference}/`);
    return data;
  } catch {
    return mockBookings.find((b) => b.booking_reference === reference) || mockBookings[0];
  }
};

export const cancelBooking = async (id) => {
  const { data } = await api.put(`/bookings/${id}/cancel/`);
  return data;
};

export const getHostBookings = async (statusFilter) => {
  try {
    const params = statusFilter ? { status: statusFilter } : {};
    const { data } = await api.get('/bookings/host/', { params });
    return data;
  } catch {
    return [];
  }
};

export const confirmBooking = async (id) => {
  const { data } = await api.put(`/bookings/host/${id}/confirm/`);
  return data;
};

export const completeBooking = async (id) => {
  const { data } = await api.put(`/bookings/host/${id}/complete/`);
  return data;
};