import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../services/auth';
import { toast } from 'react-hot-toast';

export default function RoleProtectedRoute({ children, allowedRoles }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
        toast.error('Unauthorized access. Elevated privileges required.');
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
