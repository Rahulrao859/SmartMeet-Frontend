import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — wraps authenticated-only pages.
 * Redirects to /login if no JWT token is stored in localStorage.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;
