import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdCalendarToday, MdEmail, MdTimeline, MdSettings, MdLogout, MdMenu, MdClose, MdSchedule } from 'react-icons/md';
import { FaRobot } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useSocket } from '../context/SocketContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { disconnectSocket } = useSocket();

    const handleLogout = () => {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        disconnectSocket();
        // Redirect to landing page
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const menuItems = [
        { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
        { name: 'Meetings', icon: MdSchedule, path: '/meetings' },
        { name: 'AI Scheduler', icon: FaRobot, path: '/ai-scheduler' },
        { name: 'Calendar', icon: MdCalendarToday, path: '/calendar' },
        { name: 'Email Logs', icon: MdEmail, path: '/email-logs' },
        { name: 'Activity', icon: MdTimeline, path: '/activity' },
        { name: 'Settings', icon: MdSettings, path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Hamburger Toggle outside the container so it's always accessible */}
            <button className="mobile-nav-toggle" onClick={toggleMobileMenu}>
                {isMobileOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>

            <div className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-header">
                    <div className="sidebar-header-icon">
                        <FaRobot />
                    </div>
                    <div className="sidebar-brand">
                        <h1>SmartMeet</h1>
                        <p>AI Meeting Scheduler</p>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="sidebar-icon" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="sidebar-footer">
                    <ThemeToggle className="sidebar-theme-toggle" />

                    {/* AI Assistant Button */}
                    <button 
                        onClick={() => {
                            navigate('/ai-scheduler');
                            setIsMobileOpen(false);
                        }} 
                        className="ai-assistant-card"
                    >
                        <div className="ai-avatar">AI</div>
                        <div className="ai-info">
                            <h4>AI Assistant</h4>
                            <span>Always Available</span>
                        </div>
                    </button>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="sidebar-logout">
                        <MdLogout className="sidebar-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
