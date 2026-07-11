import axios from 'axios';

import catEngineering         from '../assets/categories/cat_engineering.jpg';
import catPolytechnic         from '../assets/categories/cat_polytechnic.jpg';
import catComputerApplications from '../assets/categories/cat_computer_applications.jpg';
import catMedical             from '../assets/categories/cat_medical.jpg';
import catNursing             from '../assets/categories/cat_nursing.jpg';
import catAlliedHealth        from '../assets/categories/cat_allied_health.jpg';
import catPhysiotherapy       from '../assets/categories/cat_physiotherapy.jpg';
import catOccupationalTherapy from '../assets/categories/cat_occupational_therapy.jpg';
import catArtsScience         from '../assets/categories/cat_arts_science.jpg';
import catManagement          from '../assets/categories/cat_management.jpg';
import catPharmacy            from '../assets/categories/cat_pharmacy.jpg';
import catLaw                 from '../assets/categories/cat_law.jpg';
import catArchitecture        from '../assets/categories/cat_architecture.jpg';
import catPhysicalEducation   from '../assets/categories/cat_physical_education.jpg';
import catAgriculture         from '../assets/cat_agriculture.jpg';
import catDefault             from '../assets/cat_default.jpg';

const BASE_URL = 'http://localhost:8000/api';

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

// Helper to normalize course fields for legacy compatibility
export const normalizeCourse = (item) => {
  if (!item) return item;
  if (item.course_name_display) {
    const cat = (item.category || '').toLowerCase();
    let level = 'Undergraduate';
    if (item.degree_type === 'pg') level = 'Postgraduate';
    else if (item.degree_type === 'diploma') level = 'Diploma';
    else if (item.degree_type === 'phd') level = 'Postgraduate';

    let duration = item.duration;
    if (!duration) {
      duration = '4 Years';
      if (item.degree_type === 'pg') duration = '2 Years';
      else if (item.degree_type === 'diploma' || item.degree_type === 'phd') duration = '3 Years';
      else if (cat.includes('arts') || cat.includes('science') || cat.includes('management') || cat.includes('health') || cat.includes('education') || cat.includes('agriculture')) {
        duration = '3 Years';
      } else if (cat.includes('medical') || cat.includes('architecture')) {
        duration = '5 Years';
      }
    }

    let icon = '📚';
    const name = (item.course_name_display || '').toLowerCase();
    if (name.includes('computer') || name.includes('information') || name.includes('data') || name.includes('ai') || name.includes('machine')) {
      icon = '💻';
    } else if (cat.includes('engineering') || cat.includes('polytechnic')) {
      icon = '⚙️';
    } else if (cat.includes('nursing')) {
      icon = '💉';
    } else if (cat.includes('pharmacy')) {
      icon = '💊';
    } else if (cat.includes('law')) {
      icon = '⚖️';
    } else if (cat.includes('agriculture')) {
      icon = '🌾';
    } else if (cat.includes('architecture')) {
      icon = '🏛️';
    } else if (cat.includes('arts') || cat.includes('science')) {
      icon = '📖';
    } else if (cat.includes('health') || cat.includes('physio') || cat.includes('occupational')) {
      icon = '🏥';
    } else if (cat.includes('management') || cat.includes('business') || cat.includes('commerce')) {
      icon = '💼';
    }

    const collegeName = item.college_details ? item.college_details.college_name : '';
    const description = collegeName 
      ? `Offered at ${collegeName}. A comprehensive program in ${item.course_name_display} designed to prepare students for top industry opportunities.`
      : `A comprehensive program in ${item.course_name_display} designed to prepare students for top industry opportunities.`;

    const cid = item.course_id || item.id || 1;
    const students = 120 + (cid % 5) * 30;
    const rating = (4.4 + (cid % 7) * 0.08).toFixed(1);

    const colleges_info = item.college_details ? [{
      id: item.college_details.college_id,
      college_name: item.college_details.college_name,
      location_city: item.college_details.location_city,
      location_state: item.college_details.location_state,
      short_name: item.college_details.college_name.split(' - ').pop() || '',
      image: item.college_details.primary_image_url || item.college_details.banner_image || item.college_details.logo_url || null
    }] : [];

    return {
      ...item,
      id: item.course_id || item.id,
      title: item.course_name_display,
      category_display: item.category_display || item.category,
      level: level,
      duration: duration,
      icon: icon,
      description: description,
      students: students,
      rating: parseFloat(rating),
      colleges_info: colleges_info,
      image: item.image_url || getCourseImage(item.course_name_display, item.category_display || item.category)
    };
  }
  return item;
};

// Courses
export const fetchCourses = (params = {}) =>
  api.get('/courses/', { params }).then(data => {
    if (data && data.results) {
      return {
        ...data,
        results: data.results.map(normalizeCourse)
      };
    } else if (Array.isArray(data)) {
      return data.map(normalizeCourse);
    }
    return data;
  });

export const fetchCourseDetail = (id) =>
  api.get(`/courses/${id}/`).then(normalizeCourse);

// Applications
export const submitApplication = (formData) =>
  api.post('/applications/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchMyApplications = (email = '') => {
  if (email) {
    return api.get(`/applications/by-email/`, { params: { email } });
  }
  return api.get('/applications/');
};

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

export const groupCoursesByName = (rawCourses) => {
  const groupedMap = new Map();

  rawCourses.forEach(c => {
    const nameKey = (c.course_name || c.title || c.name || '').trim();
    if (!nameKey) return;
    
    // Group case-insensitively
    const key = nameKey.toLowerCase();

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        ...c,
        id: c.id, // keep representative id
        title: nameKey,
        colleges_info: []
      });
    }

    const rep = Math.round(c.rating || 4.5); // dummy usage / carry over
    const repObj = groupedMap.get(key);

    if (c.college_details) {
      const colId = c.college_details.college_id;
      if (!repObj.colleges_info.some(col => col.id === colId)) {
        repObj.colleges_info.push({
          id: colId,
          college_name: c.college_details.college_name,
          location_city: c.college_details.location_city,
          location_state: c.college_details.location_state,
          short_name: c.college_details.short_name || c.college_details.college_name.split(' - ').pop() || ''
        });
      }
    }
    
    // Merge colleges from colleges_info if it's already there
    if (c.colleges_info) {
      c.colleges_info.forEach(col => {
        if (!repObj.colleges_info.some(existing => existing.id === col.id)) {
          repObj.colleges_info.push(col);
        }
      });
    }
  });

  return Array.from(groupedMap.values());
};

export const getCourseImage = (title, category) => {
  const t = (title || '').toLowerCase();
  const cat = (category || '').toLowerCase();

  if (t.includes('mbbs') || cat === 'medical') {
    return catMedical;
  }
  if (t.includes('nursing') || cat === 'nursing') {
    return catNursing;
  }
  if (t.includes('physiotherapy') || cat === 'physiotherapy') {
    return catPhysiotherapy;
  }
  if (t.includes('occupational') || cat === 'occupational_therapy') {
    return catOccupationalTherapy;
  }
  if (cat.includes('allied') || cat.includes('health') || t.includes('allied')) {
    return catAlliedHealth;
  }
  if (cat.includes('pharmacy') || t.includes('pharmacy') || t.includes('pharm')) {
    return catPharmacy;
  }
  if (t.includes('mba') || t.includes('mca') || cat === 'management') {
    return catManagement;
  }
  if (t.includes('law') || cat === 'law' || t.includes('llb')) {
    return catLaw;
  }
  if (t.includes('architecture') || cat === 'architecture' || t.includes('arch')) {
    return catArchitecture;
  }
  if (t.includes('polytechnic') || t.includes('diploma')) {
    return catPolytechnic;
  }
  if (t.includes('computer') || cat === 'computer_applications' || t.includes('bca') || t.includes('mca')) {
    return catComputerApplications;
  }
  if (t.includes('physical education') || cat === 'education') {
    return catPhysicalEducation;
  }
  if (t.includes('engineering') || cat === 'engineering') {
    return catEngineering;
  }
  if (cat.includes('agriculture') || cat.includes('agricultural') || t.includes('agriculture')) {
    return catAgriculture;
  }
  return catDefault;
};

export default api;
