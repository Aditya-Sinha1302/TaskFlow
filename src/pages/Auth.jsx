import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const { supabase } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!supabase) {
            setError("Supabase credentials missing! App is running without auth backend.");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Registration successful! Check your email for a confirmation link.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo-glow">
                        <div className="icon-pulse-wrapper">
                            <Lock size={32} className="brand-icon" />
                        </div>
                    </div>
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Log in to manage your tasks securely.' : 'Sign up to get started with your new workspace.'}</p>
                </div>

                {error && <div className="auth-alert error-alert">{error}</div>}
                {message && <div className="auth-alert success-alert">{message}</div>}

                <form className="auth-form" onSubmit={handleAuth}>
                    <div className="form-group icon-input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group icon-input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? <Loader2 className="spin" size={20} /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" className="auth-switch-btn" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign up' : 'Log in'} <ArrowRight size={14} />
                        </button>
                    </p>
                </div>

                {!supabase && (
                    <div className="auth-alert warning-alert mt-4">
                        <strong>Developer Note:</strong> Supabase has not been configured in .env.local yet. Run the app without logging in by navigating back to <a href="/">Dashboard</a>.
                    </div>
                )}
            </div>

            <div className="auth-bg-decorators">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>
        </div>
    );
};

export default Auth;
