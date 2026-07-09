import api from './api';

export const getColleges = (params = {}) => api.get('/colleges/', { params });
export const getCollege = (slug) => api.get(`/colleges/${slug}/`);
export const searchColleges = (query) => api.get('/colleges/', { params: { search: query } });
