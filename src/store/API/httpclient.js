import axios from 'axios';

const userId = localStorage.getItem('userId');
const api = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
    'User-Id': userId
  },
});

api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['User-Id'] = userId;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

export default api;