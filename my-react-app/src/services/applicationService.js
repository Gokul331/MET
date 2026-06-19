import api from './api';

export const getApplications = () => api.get('/applications/');
export const getApplication = (id) => api.get(`/applications/${id}/`);
export const createApplication = (formData) =>
  api.post('/applications/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateApplication = (id, data) => api.put(`/applications/${id}/`, data);
export const downloadPDF = (id) =>
  api.get(`/applications/${id}/pdf/`, { responseType: 'arraybuffer' });
