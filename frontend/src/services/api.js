import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;
  }
  // In production build, fall back to live Railway backend URL if VITE_API_URL is missing
  if (import.meta.env.PROD) {
    return 'https://secure-liberation-production.up.railway.app/api';
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('schemesetu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me')
};

export const profileAPI = {
  getProfile: () => API.get('/profile'),
  updateProfile: (profileData) => API.put('/profile', profileData)
};

export const schemesAPI = {
  getStats: () => API.get('/schemes/stats/summary'),
  getSchemes: (params = {}) => API.get('/schemes', { params }),
  getSchemeById: (id) => API.get(`/schemes/${id}`)
};

export const eligibilityAPI = {
  match: (profileData) => API.post('/eligibility/match', { profile: profileData }),
  matchEligibility: (profileData) => API.post('/eligibility/match', { profile: profileData })
};

export const passbookAPI = {
  getSavedSchemes: () => API.get('/passbook'),
  saveScheme: (schemeId) => API.post(`/passbook/save/${schemeId}`),
  removeSavedScheme: (schemeId) => API.delete(`/passbook/remove/${schemeId}`)
};

export const applicationsAPI = {
  getApplications: () => API.get('/applications'),
  createApplication: (schemeId) => API.post(`/applications/${schemeId}`),
  updateApplication: (appId, data) => API.put(`/applications/${appId}`, data)
};

export const chatbotAPI = {
  query: (queryText) => API.post('/chatbot/query', { query: queryText })
};

export const adminAPI = {
  getAllSchemes: () => API.get('/admin/schemes'),
  createScheme: (data) => API.post('/admin/schemes', data),
  updateScheme: (id, data) => API.put(`/admin/schemes/${id}`, data),
  deactivateScheme: (id) => API.delete(`/admin/schemes/${id}`)
};

export default API;
