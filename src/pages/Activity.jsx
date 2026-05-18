import React, { useState, useEffect } from 'react';
import { MdSchedule, MdPersonAdd, MdEmail, MdCheckCircle } from 'react-icons/md';

const Activity = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = ['All', 'Meetings', 'Emails', 'Users', 'Tasks'];

    // Fetch activities from backend
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                
                // Fetch meetings and emails from backend
                const [meetingsRes, emailsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/meetings'),
                    fetch('http://localhost:5000/api/email-logs')
                ]);

                const meetings = await meetingsRes.json();
                const emailLogs = await emailsRes.json();

                // Transform backend data into activity format
                const combinedActivities = [];

                // Add email activities
                if (Array.isArray(emailLogs)) {
                    emailLogs.forEach(email => {
                        combinedActivities.push({
                            id: email.id || `email-${email.recipient}-${email.timestamp}`,
                            type: 'email',
                            title: 'Email Sent',
                            description: `Invitation sent to ${email.recipient}`,
                            time: email.time || 'Just now',
                            icon: MdEmail,
                            color: '#3B82F6',
                            bgColor: 'rgba(59, 130, 246, 0.1)',
                            timestamp: email.timestamp
                        });
                    });
                }

                // Add meeting activities
                if (Array.isArray(meetings)) {
                    meetings.forEach(meeting => {
                        combinedActivities.push({
                            id: meeting.id,
                            type: 'meeting',
                            title: 'Meeting Scheduled',
                            description: `${meeting.title || 'Meeting'} scheduled for ${meeting.date} at ${meeting.time}`,
                            time: 'Just now',
                            icon: MdSchedule,
                            color: '#2563EB',
                            bgColor: 'rgba(37, 99, 235, 0.1)',
                            timestamp: meeting.createdAt || new Date()
                        });
                    });
                }

                // Sort by timestamp (newest first)
                combinedActivities.sort((a, b) => {
                    const timeA = new Date(a.timestamp || 0).getTime();
                    const timeB = new Date(b.timestamp || 0).getTime();
                    return timeB - timeA;
                });

                setActivities(combinedActivities);
            } catch (error) {
                console.error('Error fetching activities:', error);
                // Fallback to empty array if API fails
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();

        // Poll for new activities every 5 seconds
        const interval = setInterval(fetchActivities, 5000);

        return () => clearInterval(interval);
    }, []);

    const filteredActivities = activities.filter(activity => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Meetings') return activity.type === 'meeting';
        if (activeFilter === 'Emails') return activity.type === 'email';
        if (activeFilter === 'Users') return activity.type === 'user';
        if (activeFilter === 'Tasks') return activity.type === 'task';
        return true;
    });

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', color: 'var(--text-dark)', fontWeight: 'bold' }}>Activity Feed</h1>
                <p>Real-time actions across your workspace</p>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '999px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease',
                            border: activeFilter === filter ? '1px solid #2563EB' : '1px solid var(--card-border)',
                            backgroundColor: activeFilter === filter ? '#2563EB' : 'var(--card-bg)',
                            color: activeFilter === filter ? '#FFFFFF' : 'var(--text-dark)'
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <p>Loading activities...</p>
                </div>
            )}

            {/* Timeline */}
            {!loading && (
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute',
                        left: '11px',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        backgroundColor: 'var(--card-border)',
                        zIndex: 0
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {filteredActivities.length > 0 ? filteredActivities.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div key={activity.id} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    
                                    {/* Timeline Node */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-31px', /* 24px padding + 7px offset to center on 2px line */
                                        top: '16px', /* Align with card content */
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--card-bg)',
                                        border: `2px solid ${activity.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <Icon style={{ color: activity.color, fontSize: '18px' }} />
                                    </div>

                                    {/* Content Card */}
                                    <div style={{
                                        width: '100%',
                                        backgroundColor: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '8px',
                                        padding: '16px 20px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                                    }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h3 style={{ margin: '0', fontSize: '15px', fontWeight: '600', color: 'var(--text-dark)' }}>{activity.title}</h3>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{activity.time}</span>
                                        </div>
                                        <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-muted)' }}>{activity.description}</p>
                                    </div>
                                </div>
                            );
                        }) : (
                             <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px dashed var(--card-border)' }}>
                                 No activities yet. Schedule a meeting or send invitations to see them here.
                             </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity;
