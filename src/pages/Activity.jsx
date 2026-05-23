import React, { useState, useEffect } from 'react';
import { MdSchedule, MdEmail, MdCalendarToday, MdNotifications } from 'react-icons/md';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';

const Activity = () => {
    const { socket } = useSocket();
    const [activeFilter, setActiveFilter] = useState('All');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = ['All', 'Meetings', 'Emails'];

    const fetchActivities = async () => {
        try {
            const data = await api.getRecentActivity();
            if (data && data.activities) {
                setActivities(data.activities);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch activities from backend on mount
    useEffect(() => {
        fetchActivities();
    }, []);

    // Listen to real-time events to auto-refresh the timeline
    useEffect(() => {
        if (!socket) return;

        const handleRealTimeUpdate = () => {
            console.log('[ACTIVITY FEED] Real-time change received, refreshing timeline…');
            fetchActivities();
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

    const filteredActivities = activities.filter(activity => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Meetings') return activity.type === 'meeting';
        if (activeFilter === 'Emails') return activity.type === 'email';
        return true;
    });

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
        <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
            {/* Header */}
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', color: 'var(--text-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MdNotifications style={{ color: '#6366f1' }} />
                    Activity Feed
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Real-time workspace activity and notifications</p>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '999px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease',
                            border: activeFilter === filter ? '1px solid #6366f1' : '1px solid var(--card-border)',
                            backgroundColor: activeFilter === filter ? '#6366f1' : 'var(--card-bg)',
                            color: activeFilter === filter ? '#FFFFFF' : 'var(--text-primary)',
                            boxShadow: activeFilter === filter ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 40px', color: '#6366f1', fontSize: '15px' }}>
                    <div style={{
                        width: '36px', height: '36px', border: '3px solid rgba(99, 102, 241, 0.1)',
                        borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    Loading activity timeline…
                </div>
            ) : (
                /* Timeline */
                <div style={{ position: 'relative', paddingLeft: '28px' }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute',
                        left: '11px',
                        top: '4px',
                        bottom: '4px',
                        width: '2px',
                        backgroundColor: 'var(--card-border)',
                        zIndex: 0
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        {filteredActivities.length > 0 ? filteredActivities.map((activity) => {
                            const Icon = activity.type === 'meeting' ? MdCalendarToday : MdEmail;
                            return (
                                <div key={activity._id} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    
                                    {/* Timeline Node */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-32px', /* center precisely on 2px line */
                                        top: '4px',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--card-bg)',
                                        border: `2px solid ${activity.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                    }}>
                                        <Icon style={{ color: activity.color, fontSize: '15px' }} />
                                    </div>

                                    {/* Content Card */}
                                    <div style={{
                                        width: '100%',
                                        backgroundColor: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '12px',
                                        padding: '16px 20px',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                                        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.03)';
                                    }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <h3 style={{ margin: '0', fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{activity.title}</h3>
                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{formatTimeAgo(activity.createdAt)}</span>
                                        </div>
                                        <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                            {activity.type === 'meeting' 
                                                ? `Date: ${activity.meta.date} at ${activity.meta.time} via ${activity.meta.platform}`
                                                : `Recipient: ${activity.meta.recipient} | Subject: ${activity.meta.subject}`}
                                        </p>
                                        {activity.meta.errorMessage && (
                                            <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444', fontSize: '11px', fontWeight: '500' }}>
                                                Error: {activity.meta.errorMessage}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                             <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px dashed var(--card-border)' }}>
                                 No activities found matching this filter.
                             </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity;
