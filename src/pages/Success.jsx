import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CheckCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const Success = () => {
    const navigate = useNavigate();
    const updateProfile = useStore(state => state.updateProfile);

    useEffect(() => {
        // Upgrade the user to Pro immediately upon hitting this route
        updateProfile({ isPro: true });

        // Trigger a massive confetti explosion
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // Redirect back to the dashboard after a short delay
        const timer = setTimeout(() => {
            navigate('/', { replace: true });
        }, 4000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [navigate, updateProfile]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            textAlign: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--status-done)',
                borderRadius: '50%',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
                animation: 'pulse 2s infinite'
            }}>
                <CheckCircle size={64} color="white" />
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 'bold' }}>Payment Successful!</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Welcome to the Pro tier! All restrictions have been lifted.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)' }}>
                <Loader2 className="spin" size={18} />
                Redirecting you back to your workspace...
            </div>

            <style>{`
                .spin { animation: spin 2s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(16, 185, 129, 0.6); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Success;
