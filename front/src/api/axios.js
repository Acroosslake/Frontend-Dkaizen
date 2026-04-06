import axios from 'axios';

const api = axios.create({
    // Ahora lee del .env corregido
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;