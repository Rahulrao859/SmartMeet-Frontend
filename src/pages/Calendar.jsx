import React, { useState } from 'react';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { SiZoom, SiGooglecalendar } from 'react-icons/si';
import { MdEmail, MdVideocam } from 'react-icons/md';

const Calendar = () => {
    const [connectedCalendars, setConnectedCalendars] = useState([
        {
            id: 1,
            name: 'Google Calendar',
            email: 'user@company.com',
            icon: SiGooglecalendar,
            color: '#DB4437',
            bgColor: 'rgba(219, 68, 55, 0.1)',
            connected: true,
        }
    ]);

    const [availableIntegrations, setAvailableIntegrations] = useState([
        {
            id: 2,
            name: 'Outlook Calendar',
            description: 'Connect your Outlook calendar to sync meetings',
            icon: MdEmail,
            color: '#0078D4',
            bgColor: 'rgba(0, 120, 212, 0.1)',
        },
        {
            id: 3,
            name: 'Zoom',
            description: 'Automatically generate Zoom links for meetings',
            icon: SiZoom,
            color: '#2D8CFF',
            bgColor: 'rgba(45, 140, 255, 0.1)',
        },
        {
            id: 4,
            name: 'Microsoft Teams',
            description: 'Sync Teams status and create meeting links',
            icon: MdVideocam,
            color: '#6264A7',
            bgColor: 'rgba(98, 100, 167, 0.1)',
        }
    ]);

    const toggleConnection = (id) => {
        setConnectedCalendars(calendars => 
            calendars.map(cal => 
                cal.id === id ? { ...cal, connected: !cal.connected } : cal
            )
        );
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1>Calendar Integrations</h1>
                <p>Manage your connected calendars and meeting platforms</p>
            </div>

            {/* Connected Calendars Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8983e2', fontWeight: '600', marginBottom: '16px' }}>
                    Connected Calendars
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {connectedCalendars.map((cal) => (
                        <div key={cal.id} className="card-clean" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', backgroundColor: cal.bgColor, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <cal.icon style={{ fontSize: '24px', color: cal.color }} />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)' }}>{cal.name}</h3>
                                    <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)' }}>{cal.email}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {cal.connected && (
                                    <span className="pill-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FaCheck size={10} />
                                        Synced
                                    </span>
                                )}
                                {/* Custom HTML Toggle Switch */}
                                <label className="switch">
                                    <input type="checkbox" checked={cal.connected} onChange={() => toggleConnection(cal.id)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Integrations Section */}
            <div>
                <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8983e2', fontWeight: '600', marginBottom: '16px' }}>
                    Available Integrations
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {availableIntegrations.map((integration) => (
                        <div key={integration.id} className="card-clean">
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ width: '56px', height: '56px', backgroundColor: integration.bgColor, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <integration.icon style={{ fontSize: '28px', color: integration.color }} />
                                </div>
                                <button className="btn-outline">
                                    <FaPlus style={{ marginRight: '6px', fontSize: '12px' }} />
                                    Connect
                                </button>
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-dark)' }}>{integration.name}</h3>
                            <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{integration.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
