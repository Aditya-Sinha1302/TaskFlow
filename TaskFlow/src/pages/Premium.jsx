import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, Loader2, ArrowLeft, ShieldCheck, GraduationCap } from 'lucide-react';
import { useStore } from '../store/useStore';
import './Premium.css';

const Premium = () => {
    const navigate = useNavigate();
    const profile = useStore(state => state.profile);
    const updateProfile = useStore(state => state.updateProfile);

    const [loadingPlan, setLoadingPlan] = useState(null);

    // Load Razorpay Script
    useEffect(() => {
        const rzpScript = document.createElement('script');
        rzpScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
        rzpScript.async = true;
        document.body.appendChild(rzpScript);

        return () => {
            if (document.body.contains(rzpScript)) document.body.removeChild(rzpScript);
        };
    }, []);

    if (profile.isPro) {
        return (
            <div className="premium-page already-pro glass-panel">
                <ShieldCheck size={64} className="pro-icon pulse-glow" />
                <h1>You're Already a Pro!</h1>
                <p>Enjoy your unlimited access to all TaskFlow features.</p>
                <button onClick={() => navigate('/')} className="btn-primary cool-btn">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const features = [
        "Unlimited Tasks Creation",
        "Unlimited Custom Kanban Columns",
        "Advanced Productivity Analytics",
        "Priority Support Team Access",
        "Early Access to Future Updates"
    ];

    const handleCheckout = async (amount, planName) => {
        setLoadingPlan(planName);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
            const response = await fetch(`${backendUrl}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, planName })
            });
            const data = await response.json();

            if (data.order_id) {
                const options = {
                    key: data.key_id,
                    amount: data.amount,
                    currency: data.currency,
                    name: "TaskFlow Premium",
                    description: `Subscription: ${planName}`,
                    order_id: data.order_id,
                    handler: function (response) {
                        // On Success
                        updateProfile({ isPro: true });
                        navigate('/success');
                    },
                    prefill: {
                        name: profile.name || "TaskFlow User",
                        email: profile.email || "user@example.com",
                    },
                    theme: {
                        color: "#10b981"
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    alert("Payment Failed: " + response.error.description);
                });
                rzp.open();

            } else {
                alert(`Failed to create Razorpay Order.\n\nError: ${data.error}\nDetails: ${JSON.stringify(data.details || 'No additional details provided.')}`);
            }
        } catch (error) {
            console.error(error);
            alert("Could not connect to the Razorpay backend server. Make sure it's running on port 3001!");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="premium-page">
            <button className="back-btn text-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="premium-container glass-card">
                <div className="premium-header">
                    <div className="pro-badge lg">
                        <Sparkles size={24} className="sparkle-icon" />
                        PRO PLAN
                    </div>
                    <h1 className="premium-title">Choose Your Subscription</h1>
                    <p className="premium-subtitle">
                        Unlock the full potential of TaskFlow today. Cancel anytime.
                    </p>
                </div>

                <div className="pricing-tiers">
                    {/* Standard Monthly */}
                    <div className="pricing-card">
                        <h3>Standard Monthly</h3>
                        <div className="price-tag">
                            <span className="currency">₹</span>
                            <span className="amount">119</span>
                            <span className="period">/ mo</span>
                        </div>
                        <p className="price-desc">Perfect for rolling month-to-month access.</p>
                        <button
                            className="btn-primary checkout-btn"
                            onClick={() => handleCheckout(119, 'Standard Monthly')}
                            disabled={loadingPlan !== null}
                        >
                            {loadingPlan === 'Standard Monthly' ? <Loader2 className="spin" size={18} /> : 'Subscribe Now'}
                        </button>
                    </div>

                    {/* Standard Quarterly - Recommended */}
                    <div className="pricing-card recommended pulse-glow-border">
                        <div className="recommended-badge">Most Popular</div>
                        <h3>Standard 4-Months</h3>
                        <div className="price-tag">
                            <span className="currency">₹</span>
                            <span className="amount">400</span>
                            <span className="period">/ 4-mo</span>
                        </div>
                        <p className="price-desc">Save ₹76 every term. Best value for professionals.</p>
                        <button
                            className="btn-primary checkout-btn"
                            onClick={() => handleCheckout(400, 'Standard 4-Months')}
                            disabled={loadingPlan !== null}
                        >
                            {loadingPlan === 'Standard 4-Months' ? <Loader2 className="spin" size={18} /> : 'Subscribe Now'}
                        </button>
                    </div>

                    {/* Founder's Promo */}
                    <div className="pricing-card student-card pulse-glow-border-green">
                        <div className="student-badge"><Sparkles size={16} /> First 500 Promo</div>
                        <h3>Founder's Promo</h3>
                        <div className="price-tag">
                            <span className="currency">₹</span>
                            <span className="amount">50</span>
                            <span className="period">/ 3-mo</span>
                        </div>
                        <p className="price-desc">Extremely limited introductory pricing. Renews at standard rates.</p>

                        <button
                            className="btn-primary checkout-btn success-btn pulse-glow"
                            onClick={() => handleCheckout(50, "Founder's Promo")}
                            disabled={loadingPlan !== null}
                        >
                            {loadingPlan === "Founder's Promo" ? <Loader2 className="spin" size={18} /> : 'Claim Offer'}
                        </button>
                    </div>
                </div>

                <div className="premium-features-list">
                    <h3>All plans include:</h3>
                    <div className="features-grid">
                        {features.map((feature, idx) => (
                            <div key={idx} className="feature-item lg">
                                <div className="feature-check"><Check size={18} /></div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="premium-actions single">
                    <div className="secure-badge">
                        <ShieldCheck size={14} />
                        Payments securely processed by Razorpay
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Premium;
