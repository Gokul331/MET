import axios from 'axios';

const BASE_URL = 'https://ice-foundation-1.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('met_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// Colleges
export const fetchColleges = (params = {}) =>
  api.get('/colleges/', { params });

export const fetchCollegeDetail = (slug) =>
  api.get(`/colleges/${slug}/`);

// Courses
export const fetchCourses = (params = {}) =>
  api.get('/courses/', { params });

export const fetchCourseDetail = (id) =>
  api.get(`/courses/${id}/`);

// Applications
export const submitApplication = (formData) =>
  api.post('/applications/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchMyApplications = () =>
  api.get('/applications/');

export const fetchApplicationDetail = (id) =>
  api.get(`/applications/${id}/`);

export const downloadApplicationPDF = (id) =>
  api.get(`/applications/${id}/pdf/`, { responseType: 'arraybuffer' });

// Auth
export const loginUser = (credentials) =>
  api.post('/auth/login/', credentials);

export const registerUser = (data) =>
  api.post('/auth/register/', data);

export const logoutUser = () =>
  api.post('/auth/logout/');

// Contact
export const submitContactForm = (data) =>
  api.post('/contact/', data);

// Scholarships
export const fetchScholarships = () =>
  api.get('/scholarships/');

// Trust API (compatibility alias used by Courses page)
export const trustAPI = {
  getCourses: () => fetchCourses(),
  getColleges: () => fetchColleges(),
};

export default api;
