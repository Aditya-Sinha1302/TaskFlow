import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import './Sidebar.css';

const Sidebar = () => {
    const profile = useStore((state) => state.profile);
    const navigate = useNavigate();

    const handleUpgrade = (e) => {
        e.preventDefault();
        navigate('/premium');
    };

    return (
        <aside className="sidebar glass">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <CheckSquare size={24} color="#ffffff" />
                </div>
                <h2>TaskFlow</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <CheckSquare size={20} />
                    <span>Tasks</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            {!profile.isPro && (
                <div className="sidebar-upgrade-card">
                    <div className="upgrade-icon-bg">
                        <Sparkles size={20} color="white" />
                    </div>
                    <h4>Go Premium</h4>
                    <p>Unlock unlimited tasks & boards</p>
                    <button onClick={handleUpgrade} className="btn-primary sidebar-upgrade-btn" style={{ border: 'none' }}>
                        Upgrade Content
                    </button>
                </div>
            )}

            <div className="sidebar-footer">
                <div className="user-profile">
                    <img src={profile.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Default"} alt="User Avatar" className="avatar" />
                    <div className="user-info">
                        <div className="user-name-row" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="user-name">{profile.name}</span>
                            {profile.isPro && (
                                <span className="sidebar-pro-badge">
                                    <Sparkles size={12} /> PRO
                                </span>
                            )}
                        </div>
                        <span className="user-role">{profile.role}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
