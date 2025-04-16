import axios from 'axios';
import { config } from '../config';

// Use the correct API URL from your config
const API_URL = config.apiUrl;

// Axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Important for cookies
});

// Add authorization header on each request when token is available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await refreshToken();
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

async function refreshToken() {
  const response = await axios.post(
    `${API_URL}/auth/refresh-token`, 
    {}, 
    { withCredentials: true }
  );
  
  localStorage.setItem('token', response.data.accessToken);
  return response.data;
}

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
  
  getProjects: async () => {
    return api.get('/projects');
  },
  
  getProjectById: async (projectId) => {
    return api.get(`/projects/${projectId}`);
  }
};

export default api;