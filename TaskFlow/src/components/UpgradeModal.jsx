import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, X, Check } from 'lucide-react';
import './UpgradeModal.css';

const UpgradeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const features = [
        "Unlimited Tasks Creation",
        "Unlimited Custom Kanban Columns",
        "Advanced Productivity Analytics",
        "Priority Support Team Access"
    ];

    const handleUpgrade = (e) => {
        e.preventDefault();
        onClose();
        navigate('/premium');
    };

    return (
        <div className="modal-overlay glass-heavy" onClick={onClose}>
            <div className="upgrade-modal glass-card" onClick={(e) => e.stopPropagation()}>
                <button className="icon-btn close-btn" onClick={onClose} title="Close">
                    <X size={24} />
                </button>

                <div className="upgrade-header">
                    <div className="pro-badge">
                        <Sparkles size={20} className="sparkle-icon" />
                        PRO
                    </div>
                    <h2>Unlock Your Full Potential</h2>
                    <p>You've hit the limits of the free plan. Upgrade to Pro to supercharge your workflow.</p>
                </div>

                <div className="upgrade-features">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-item">
                            <div className="feature-check"><Check size={16} /></div>
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="upgrade-actions">
                    <button onClick={handleUpgrade} className="btn-primary upgrade-btn pulse-glow">
                        <Lock size={18} />
                        View Premium Features
                    </button>
                    <button className="btn-secondary text-btn" onClick={onClose}>
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
