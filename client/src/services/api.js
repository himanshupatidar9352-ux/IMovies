import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('imovies_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized / expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (localStorage.getItem('imovies_token')) {
        localStorage.removeItem('imovies_token');
        localStorage.removeItem('imovies_user');
        window.dispatchEvent(new Event('authChange'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;

