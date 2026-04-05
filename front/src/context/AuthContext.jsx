import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Revisa si hay sesión al cargar la app (F5)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/me')
                .then(res => {
                    // Dependiendo de cómo lo envíe Laravel, aseguramos guardar los datos correctos
                    setUser(res.data.user || res.data);
                })
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // 2. Nueva función Login: Ya no hace la petición a /login. 
    // Ahora Login.jsx hace el trabajo pesado y solo nos pasa el token aquí.
    const login = async (token) => {
        localStorage.setItem('token', token);
        try {
            // Traemos los datos del usuario recién logueado para que el ProtectedRoute lo deje pasar
            const res = await api.get('/me');
            setUser(res.data.user || res.data);
        } catch (error) {
            console.error("Error al registrar el usuario en el contexto:", error);
        }
    };

    // 3. Salida limpia
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/'); // Al salir, te mandamos al Home flotante de D'KAIZEN
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};