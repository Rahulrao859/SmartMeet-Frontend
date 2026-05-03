import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import { MdCalendarToday, MdCheckCircle, MdEmail, MdHome } from 'react-icons/md';
import { FaRobot, FaUsers } from 'react-icons/fa';
import { api } from '../services/api';

const Dashboard = () => {
=======
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import { MdCalendarToday, MdCheckCircle, MdEmail, MdAdd, MdNotifications, MdSchedule, MdPersonAdd } from 'react-icons/md';
import { FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { api } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
    const [stats, setStats] = useState({
        meetings_scheduled: 0,
        emails_sent: 0,
        success_rate: 0,
        active_participants: 0
    });
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD

    useEffect(() => {
        loadStats();
    }, []);

=======
    const [userName, setUserName] = useState('there');

    useEffect(() => {
        loadStats();
        // Get user name from localStorage
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const firstName = user.name ? user.name.split(' ')[0] : 'there';
                setUserName(firstName);
            }
        } catch (e) {
            console.error('Error reading user:', e);
        }
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await api.getStats();
<<<<<<< HEAD
            // Safely access stats with fallback to default values
=======
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
            if (data && data.stats) {
                setStats({
                    meetings_scheduled: data.stats.meetings_scheduled || 0,
                    emails_sent: data.stats.emails_sent || 0,
                    success_rate: data.stats.success_rate || 0,
                    active_participants: data.stats.active_participants || 0
                });
            }
        } catch (error) {
            console.error('Error loading stats:', error);
<<<<<<< HEAD
            // Keep default stats values on error (already set in useState)
            // This prevents blank page
=======
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome to SmartMeet</h1>
                    <p className="text-gray-400 text-lg">Your AI-powered meeting scheduler for seamless collaboration</p>
                </div>
                <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg transition-colors duration-200 border border-navy-700">
                    <MdHome className="text-xl" />
                    <span>Return to Home</span>
                </Link>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-400">Loading statistics...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        icon={MdCalendarToday}
                        title="Meetings Scheduled"
                        value={stats.meetings_scheduled.toString()}
                        change="+12%"
                        positive={true}
                    />
                    <StatsCard
                        icon={MdEmail}
                        title="Emails Sent"
                        value={stats.emails_sent.toString()}
                        change="+28%"
                        positive={true}
                    />
                    <StatsCard
                        icon={FaUsers}
                        title="Active Participants"
                        value={stats.active_participants.toString()}
                        change="+6%"
                        positive={true}
                    />
                    <StatsCard
                        icon={MdCheckCircle}
                        title="Success Rate"
                        value={`${stats.success_rate}%`}
                        change="+2%"
                        positive={true}
                    />
                </div>
            )}

            {/* Quick Actions */}
            <QuickActions />
=======
    const recentActivities = [
        { id: 1, icon: MdSchedule, title: 'Meeting scheduled with Sarah Connor', time: '10 min ago', color: '#6C63FF', bgColor: 'rgba(108, 99, 255, 0.1)' },
        { id: 2, icon: MdEmail, title: 'Invitation email sent to John Doe', time: '1 hour ago', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
        { id: 3, icon: MdPersonAdd, title: 'Alex Smith joined the workspace', time: '2 hours ago', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
        { id: 4, icon: MdCheckCircle, title: 'Q4 Report preparation completed', time: '5 hours ago', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    ];

    return (
        <div className="dashboard-page">
            {/* ===== TOP BAR HEADER ===== */}
            <div className="dash-topbar">
                <div className="dash-topbar-left">
                    <h1>{getGreeting()}, {userName} 👋</h1>
                    <p>Here's what's happening with your meetings today</p>
                </div>
                <div className="dash-topbar-right">
                    <button className="btn-schedule" onClick={() => navigate('/ai-scheduler')}>
                        <MdAdd size={20} />
                        Schedule Meeting
                    </button>
                    <button className="btn-notif">
                        <MdNotifications size={22} />
                        <span className="notif-dot" />
                    </button>
                </div>
            </div>

            {/* ===== STATS CARDS ===== */}
            <div className="dash-content">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        Loading statistics...
                    </div>
                ) : (
                    <div className="stats-grid">
                        <StatsCard
                            icon={MdCalendarToday}
                            title="Meetings Scheduled"
                            value={stats.meetings_scheduled.toString()}
                            change="+12%"
                            positive={true}
                            gradient="linear-gradient(135deg, #6C63FF, #897CFF)"
                            accentColor="#6C63FF"
                        />
                        <StatsCard
                            icon={MdEmail}
                            title="Emails Sent"
                            value={stats.emails_sent.toString()}
                            change="+28%"
                            positive={true}
                            gradient="linear-gradient(135deg, #3B82F6, #60A5FA)"
                            accentColor="#3B82F6"
                        />
                        <StatsCard
                            icon={FaUsers}
                            title="Active Participants"
                            value={stats.active_participants.toString()}
                            change="+6%"
                            positive={true}
                            gradient="linear-gradient(135deg, #8B5CF6, #A78BFA)"
                            accentColor="#8B5CF6"
                        />
                        <StatsCard
                            icon={MdCheckCircle}
                            title="Success Rate"
                            value={`${stats.success_rate}%`}
                            change="+2%"
                            positive={true}
                            gradient="linear-gradient(135deg, #4F46E5, #6366F1)"
                            accentColor="#4F46E5"
                        />
                    </div>
                )}

                {/* ===== QUICK ACTIONS ===== */}
                <QuickActions />

                {/* ===== BOTTOM WIDGETS: Recent Activity + Upcoming Meetings ===== */}
                <div className="dash-widgets">
                    {/* Recent Activity */}
                    <div className="widget-card">
                        <div className="section-heading">
                            <h2>Recent Activity</h2>
                            <p>Latest actions across your workspace</p>
                        </div>
                        <div className="activity-list">
                            {recentActivities.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.id} className="activity-row">
                                        <div className="activity-icon" style={{ backgroundColor: item.bgColor }}>
                                            <Icon style={{ color: item.color, fontSize: '18px' }} />
                                        </div>
                                        <span className="activity-text">{item.title}</span>
                                        <span className="activity-time">{item.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upcoming Meetings */}
                    <div className="widget-card">
                        <div className="section-heading">
                            <h2>Upcoming Meetings</h2>
                            <p>Your schedule at a glance</p>
                        </div>
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <FaCalendarAlt size={36} />
                            </div>
                            <h3>No upcoming meetings</h3>
                            <p>Schedule your first meeting using AI</p>
                            <button className="btn-schedule-sm" onClick={() => navigate('/ai-scheduler')}>
                                Schedule Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        </div>
    );
};

export default Dashboard;
