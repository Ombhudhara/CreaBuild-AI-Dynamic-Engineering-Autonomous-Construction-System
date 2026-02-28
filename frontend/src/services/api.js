import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api', // Matching the backend PORT=5001 in .env
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
