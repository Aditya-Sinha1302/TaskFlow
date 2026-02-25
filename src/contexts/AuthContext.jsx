import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const updateProfile = useStore(state => state.updateProfile);

    useEffect(() => {
        // If supabase is missing (no keys provided yet), bypass auth lock
        if (!supabase) {
            setLoading(false);
            return;
        }

        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            // Sync user email to profile state if available
            if (session?.user?.email) {
                updateProfile({ email: session.user.email, isPro: true });
            }
            setLoading(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.email) {
                updateProfile({ email: session.user.email, isPro: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [updateProfile]);

    return (
        <AuthContext.Provider value={{ user, session, loading, supabase }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
