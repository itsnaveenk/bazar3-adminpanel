import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY;

const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle 401 responses
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default http;
