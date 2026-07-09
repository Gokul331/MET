import api from './api';

export const login = (credentials) => api.post('/auth/login/', credentials);
export const register = (data) => api.post('/auth/register/', data);
export const logout = () => api.post('/auth/logout/');
export const getProfile = () => api.get('/auth/profile/');
export const updateProfile = (data) => api.put('/auth/profile/', data);

export const setToken = (token) => localStorage.setItem('met_token', token);
export const getToken = () => localStorage.getItem('met_token');
export const removeToken = () => localStorage.removeItem('met_token');
export const isLoggedIn = () => !!getToken();
