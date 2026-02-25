import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user, loading, supabase } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Loading authentication...</div>
            </div>
        );
    }

    // If supabase keys are missing, we bypass protection so the user can still see the app UI
    // while running locally without credentials.
    if (!supabase) {
        return children;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};
