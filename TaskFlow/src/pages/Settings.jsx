import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Moon, Sun, Save, User, Briefcase, Camera, Image as ImageIcon, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const PRESET_AVATARS = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Sparky",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Clank",
];

const Settings = () => {
    const { theme, setTheme, profile, updateProfile } = useStore();
    const [formData, setFormData] = useState(profile);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const fileInputRef = React.useRef(null);
    const { supabase } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (supabase) {
                await supabase.auth.signOut();
            }
        } catch (error) {
            console.warn("Supabase signout skipped (no backend connected).");
        } finally {
            localStorage.removeItem('task-manager-storage');
            navigate('/auth');
            window.location.reload(); // Force a hard reload to clear all in-memory Zustand states
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your profile and preferences</p>
                </div>
            </div>

            <div className="settings-layout">
                <section className="settings-section glass">
                    <h2>Appearance</h2>
                    <div className="theme-toggle">
                        <p>Select your preferred theme</p>
                        <div className="theme-options">
                            <button
                                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => setTheme('light')}
                            >
                                <Sun size={20} /> Light Mode
                            </button>
                            <button
                                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => setTheme('dark')}
                            >
                                <Moon size={20} /> Dark Mode
                            </button>
                        </div>
                    </div>
                </section>

                <section className="settings-section glass">
                    <h2>Profile Details</h2>
                    <div className="profile-content">
                        <div className="avatar-section">
                            <div className="avatar-wrapper">
                                <img src={formData.avatar || profile.avatar} alt="Profile Avatar" className="avatar-img" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                                <button
                                    type="button"
                                    className="avatar-edit-btn"
                                    title="Change Avatar"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div className="avatar-info">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                    <h3>{formData.name || 'Your Name'}</h3>
                                    {profile.isPro && (
                                        <span className="settings-pro-badge">
                                            <Sparkles size={14} /> PRO
                                        </span>
                                    )}
                                </div>
                                <p>{formData.role || 'Your Role'}</p>
                            </div>
                            <button
                                type="button"
                                className="toggle-presets-btn"
                                onClick={() => setShowPresets(!showPresets)}
                            >
                                <ImageIcon size={14} /> {showPresets ? 'Hide Presets' : 'Choose Preset Avatar'}
                            </button>

                            {showPresets && (
                                <div className="presets-grid">
                                    {PRESET_AVATARS.map((src, idx) => (
                                        <div
                                            key={idx}
                                            className={`preset-item ${formData.avatar === src ? 'selected' : ''}`}
                                            onClick={() => {
                                                setFormData({ ...formData, avatar: src });
                                                setShowPresets(false);
                                            }}
                                        >
                                            <img src={src} alt={`Preset ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form className="profile-form" onSubmit={handleSave}>
                            <div className="form-group icon-input-group">
                                <label>Full Name</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div className="form-group icon-input-group">
                                <label>Role</label>
                                <div className="input-wrapper">
                                    <Briefcase className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="Product Manager"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary glow-btn">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                {saveSuccess && <span className="save-success glass-badge">Profile updated!</span>}
                                <button type="button" className="logout-btn" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
                                    <LogOut size={18} />
                                    Log Out
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
