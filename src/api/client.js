import axios from 'axios';

// Point this at your Render URL, or http://localhost:3000 for local dev
const BASE_URL = import.meta.env.VITE_API_URL || 'https://luma-api-djcb.onrender.com';

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('luma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      err.isAuthError = true;
    }
    return Promise.reject(err);
  }
);

export default client;
