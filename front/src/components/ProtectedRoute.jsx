import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Cargando...</div>; // O un spinner bonito

    // Si no hay usuario, mandarlo al login
    if (!user) return <Navigate to="/login" replace />;

    // Si hay roles permitidos y el usuario no tiene el adecuado, mandarlo a Home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />; // Si todo está bien, muestra la página solicitada
};

export default ProtectedRoute;