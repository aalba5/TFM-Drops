import { api } from './api';

export const getHabits = () => api.get('/habits');
export const getHabit = (id) => api.get(`/habits/${id}`);
export const createHabit = (data) => api.post('/habits', data);
export const updateHabit = (id, data) => api.put(`/habits/${id}`, data);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);
export const toggleEntry = (id, date) => api.post(`/habits/${id}/toggle`, { date });
export const getStats = (id) => api.get(`/habits/${id}/stats`);
