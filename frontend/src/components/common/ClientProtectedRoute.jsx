import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClientProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return null; // or a loading spinner

    if (!user) return <Navigate to="/login" replace />;

    const role = user.role?.toLowerCase();
    
    // If admin is trying to access client pages, redirect to admin dashboard
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;

    // Business roles allowed
    const businessRoles = ['seller', 'client', 'business account', 'partner', 'business'];
    if (!businessRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ClientProtectedRoute;
