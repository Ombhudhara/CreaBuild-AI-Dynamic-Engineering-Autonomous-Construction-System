import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function RoleProtectedRoute({ children, allowedRoles }) {
    const { token, role } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const currentRole = role ? role.toLowerCase() : 'viewer';

    if (!allowedRoles.includes(currentRole)) {
        toast.error('Unauthorized access. Elevated privileges required.');
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
