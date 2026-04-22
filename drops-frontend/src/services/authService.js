import { api } from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (email, password, name) => api.post('/auth/register', { email, password, name });
export const getProfile = () => api.get('/auth/profile');
