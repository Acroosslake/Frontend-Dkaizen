import axios from 'axios';

const api = axios.create({

    baseURL: 'https://glorious-memory-97j4wrjxxr7jhp64p-8000.app.github.dev/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Este "truco" hace que el token se envíe solo en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;