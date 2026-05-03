import React, { useState } from 'react';
import { MdSchedule, MdPersonAdd, MdEmail, MdCheckCircle } from 'react-icons/md';

const Activity = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Meetings', 'Emails', 'Users', 'Tasks'];

    const activities = [
        { id: 1, type: 'meeting', title: 'Meeting Scheduled', description: 'Project Alpha Review with Sarah Connor', time: '10 mins ago', icon: MdSchedule, color: '#6C63FF', bgColor: 'rgba(108, 99, 255, 0.1)' },
        { id: 2, type: 'email', title: 'Email Sent', description: 'Invitation sent to John Doe', time: '1 hour ago', icon: MdEmail, color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
        { id: 3, type: 'user', title: 'New User Added', description: 'Alex Smith joined the workspace', time: '2 hours ago', icon: MdPersonAdd, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
        { id: 4, type: 'task', title: 'Task Completed', description: 'Prepare Q4 Report marked as done', time: 'Yesterday', icon: MdCheckCircle, color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
        { id: 5, type: 'meeting', title: 'Meeting Rescheduled', description: 'Design Sync moved to Friday', time: 'Yesterday', icon: MdSchedule, color: '#EAB308', bgColor: 'rgba(234, 179, 8, 0.1)' },
    ];

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
                <p>Recent actions and updates across your workspace</p>
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
                            border: activeFilter === filter ? '1px solid #6C63FF' : '1px solid #D1D5DB',
                            backgroundColor: activeFilter === filter ? '#6C63FF' : '#FFFFFF',
                            color: activeFilter === filter ? '#FFFFFF' : '#4B5563'
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '11px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    backgroundColor: '#E8ECF4',
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
                                    backgroundColor: '#FFFFFF',
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
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E8ECF4',
                                    borderRadius: '12px',
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
                                        <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>{activity.time}</span>
                                    </div>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#6B7280' }}>{activity.description}</p>
                                </div>
                            </div>
                        );
                    }) : (
                         <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
                             No activities found for this filter.
                         </div>
                    )}
                </div>
            </div>

            {/* Load More Button */}
            {filteredActivities.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <button className="btn-outline" style={{ padding: '0 32px' }}>
                        Load older activity
                    </button>
                </div>
            )}
        </div>
    );
};

export default Activity;
