import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaCalendarAlt, FaEnvelope, FaLink } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: FaRobot,
            title: 'Schedule a Meeting using AI',
            description: 'Use natural language to create meetings instantly',
            color: '#6C63FF',
            bgColor: '#F0EEFF',
            path: '/ai-scheduler'
        },
        {
            icon: FaCalendarAlt,
            title: 'View Upcoming Meetings',
            description: 'See all your scheduled meetings at a glance',
            color: '#3B82F6',
            bgColor: '#EFF6FF',
            path: '/calendar'
        },
        {
            icon: FaEnvelope,
            title: 'Email Automation Logs',
            description: 'Track all sent invitations and their status',
            color: '#EF4444',
            bgColor: '#FFF5F5',
            path: '/email-logs'
        },
        {
            icon: FaLink,
            title: 'Calendar Integrations',
            description: 'Connect Google, Outlook, and Zoom seamlessly',
            color: '#10B981',
            bgColor: '#F0FDF4',
            path: '/calendar'
        },
    ];

    return (
        <div className="qa-section">
            <div className="section-heading">
                <h2>Quick Actions</h2>
                <p>Jump into your most used features</p>
            </div>
            <div className="quick-actions-grid">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(action.path)}
                            className="qa-card"
                            style={{ borderTop: `3px solid ${action.color}` }}
                        >
                            <div className="qa-icon-wrapper" style={{ backgroundColor: action.bgColor }}>
                                <Icon style={{ fontSize: '26px', color: action.color }} />
                            </div>
                            <h3 className="qa-title">{action.title}</h3>
                            <p className="qa-desc">{action.description}</p>
                            <button
                                className="qa-btn"
                                onClick={(e) => { e.stopPropagation(); navigate(action.path); }}
                            >
                                Get Started
                                <MdArrowForward size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;
