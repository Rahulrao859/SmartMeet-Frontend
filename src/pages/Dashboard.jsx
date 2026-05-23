import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import { MdCalendarToday, MdCheckCircle, MdEmail, MdAdd, MdNotifications, MdSchedule, MdChevronRight } from 'react-icons/md';
import { FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';

// Configure base URL from environment
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [stats, setStats] = useState({
        meetings_scheduled: 0,
        emails_sent: 0,
        success_rate: 0,
        active_participants: 0
    });
    const [activities, setActivities] = useState([]);
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('there');

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const loadStats = async () => {
        try {
            const data = await api.getStats();
            if (data) {
                setStats({
                    meetings_scheduled: data.totalMeetings || 0,
                    emails_sent: data.emailsSent || 0,
                    success_rate: data.successRate || 0,
                    active_participants: data.activeParticipants || 0
                });
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadRecentActivity = async () => {
        try {
            const data = await api.getRecentActivity();
            if (data && data.activities) {
                setActivities(data.activities);
            }
        } catch (error) {
            console.error('Error loading activity:', error);
        }
    };

    const loadUpcomingMeetings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/v1/meetings?limit=3&status=confirmed`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.meetings) {
                setUpcomingMeetings(res.data.meetings);
            }
        } catch (error) {
            console.error('Error loading upcoming meetings:', error);
        }
    };

    const loadDashboardData = async () => {
        setLoading(true);
        await Promise.all([
            loadStats(),
            loadRecentActivity(),
            loadUpcomingMeetings()
        ]);
        setLoading(false);
    };

    // Load data on mount
    useEffect(() => {
        loadDashboardData();

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

    // Listen to real-time events to auto-refresh statistics and activities
    useEffect(() => {
        if (!socket) return;

        const handleRealTimeUpdate = () => {
            console.log('[DASHBOARD] Real-time change received, refreshing feed…');
            loadStats();
            loadRecentActivity();
            loadUpcomingMeetings();
        };

        socket.on('meeting:created', handleRealTimeUpdate);
        socket.on('meeting:updated', handleRealTimeUpdate);
        socket.on('meeting:cancelled', handleRealTimeUpdate);
        socket.on('meeting:deleted', handleRealTimeUpdate);
        socket.on('email:log', handleRealTimeUpdate);

        return () => {
            socket.off('meeting:created', handleRealTimeUpdate);
            socket.off('meeting:updated', handleRealTimeUpdate);
            socket.off('meeting:cancelled', handleRealTimeUpdate);
            socket.off('meeting:deleted', handleRealTimeUpdate);
            socket.off('email:log', handleRealTimeUpdate);
        };
    }, [socket]);

    // Beautiful time ago helper
    const formatTimeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffSec < 60) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        return `${diffDay}d ago`;
    };

    return (
        <div className="dashboard-page">
            {/* ===== TOP BAR HEADER ===== */}
            <div className="dash-topbar">
                <div className="dash-topbar-left">
                    <h1>{getGreeting()}, {userName}</h1>
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
                    <div style={{ textAlign: 'center', padding: '100px 40px', color: '#6366f1', fontSize: '15px', fontWeight: '500' }}>
                        <div style={{
                            width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.1)',
                            borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 16px',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        Loading your SmartMeet dashboard…
                    </div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <StatsCard
                                icon={MdCalendarToday}
                                title="Meetings Scheduled"
                                value={stats.meetings_scheduled.toString()}
                                change="+12%"
                                positive={true}
                                gradient="linear-gradient(135deg, #2563EB, #60A5FA)"
                                accentColor="#2563EB"
                            />
                            <StatsCard
                                icon={MdEmail}
                                title="Emails Sent"
                                value={stats.emails_sent.toString()}
                                change="+28%"
                                positive={true}
                                gradient="linear-gradient(135deg, #0284C7, #38BDF8)"
                                accentColor="#0284C7"
                            />
                            <StatsCard
                                icon={FaUsers}
                                title="Active Participants"
                                value={stats.active_participants.toString()}
                                change="+6%"
                                positive={true}
                                gradient="linear-gradient(135deg, #059669, #34D399)"
                                accentColor="#059669"
                            />
                            <StatsCard
                                icon={MdCheckCircle}
                                title="Success Rate"
                                value={`${stats.success_rate}%`}
                                change="+2%"
                                positive={true}
                                gradient="linear-gradient(135deg, #EA580C, #FDBA74)"
                                accentColor="#EA580C"
                            />
                        </div>

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
                                <div className="activity-list" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                                    {activities.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                                            No recent activities recorded yet.
                                        </div>
                                    ) : (
                                        activities.map((item) => {
                                            const Icon = item.type === 'meeting' ? MdCalendarToday : MdEmail;
                                            return (
                                                <div key={item._id} className="activity-row">
                                                    <div className="activity-icon" style={{ backgroundColor: item.bgColor }}>
                                                        <Icon style={{ color: item.color, fontSize: '18px' }} />
                                                    </div>
                                                    <span className="activity-text">{item.title}</span>
                                                    <span className="activity-time">{formatTimeAgo(item.createdAt)}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Upcoming Meetings */}
                            <div className="widget-card">
                                <div className="section-heading">
                                    <h2>Upcoming Meetings</h2>
                                    <p>Your schedule at a glance</p>
                                </div>
                                {upcomingMeetings.length === 0 ? (
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
                                ) : (
                                    <div className="activity-list">
                                        {upcomingMeetings.map((m) => (
                                            <div key={m._id} className="activity-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/meetings')}>
                                                <div className="activity-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                                                    <MdSchedule style={{ color: '#6366f1', fontSize: '18px' }} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                    <span className="activity-text" style={{ fontWeight: '600' }}>{m.title}</span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                        📅 {m.date} at {m.time} ({m.platform})
                                                    </span>
                                                </div>
                                                <MdChevronRight style={{ color: 'var(--text-secondary)', fontSize: '20px' }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
