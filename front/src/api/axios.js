import axios from 'axios';

const api = axios.create({
    // Tu URL del backend en el puerto 8000
    baseURL: 'https://glorious-memory-97j4wrjxxr7jhp64p-8000.app.github.dev/api', 
    
    // ✅ VITAL: Esto permite que las cookies y cabeceras de sesión viajen entre dominios
    withCredentials: true, 
    
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Interceptor de peticiones: 
 * Inserta automáticamente el Token JWT en el Header de cada llamada.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;