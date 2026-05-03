import React, { useState } from 'react';
<<<<<<< HEAD
import { FaCheck, FaPlus, FaGoogle, FaMicrosoft } from 'react-icons/fa';
=======
import { FaCheck, FaPlus } from 'react-icons/fa';
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
import { SiZoom, SiGooglecalendar } from 'react-icons/si';
import { MdEmail, MdVideocam } from 'react-icons/md';

const Calendar = () => {
    const [connectedCalendars, setConnectedCalendars] = useState([
        {
            id: 1,
            name: 'Google Calendar',
            email: 'user@company.com',
            icon: SiGooglecalendar,
<<<<<<< HEAD
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
=======
            color: '#DB4437',
            bgColor: 'rgba(219, 68, 55, 0.1)',
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
            connected: true,
        }
    ]);

    const [availableIntegrations, setAvailableIntegrations] = useState([
        {
            id: 2,
            name: 'Outlook Calendar',
            description: 'Connect your Outlook calendar to sync meetings',
            icon: MdEmail,
<<<<<<< HEAD
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
=======
            color: '#0078D4',
            bgColor: 'rgba(0, 120, 212, 0.1)',
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        },
        {
            id: 3,
            name: 'Zoom',
            description: 'Automatically generate Zoom links for meetings',
            icon: SiZoom,
<<<<<<< HEAD
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
=======
            color: '#2D8CFF',
            bgColor: 'rgba(45, 140, 255, 0.1)',
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        },
        {
            id: 4,
            name: 'Microsoft Teams',
            description: 'Sync Teams status and create meeting links',
            icon: MdVideocam,
<<<<<<< HEAD
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-500/10',
        }
    ]);

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Calendar Integrations</h1>
                <p className="text-gray-400 text-lg">Manage your connected calendars and meeting platforms</p>
            </div>

            {/* Connected Calendars Section */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-white mb-4">Connected Calendars</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {connectedCalendars.map((cal) => (
                        <div key={cal.id} className="bg-gradient-to-br from-navy-800 to-navy-700 border border-navy-600 rounded-2xl p-6 flex items-center justify-between group hover:border-primary-purple transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${cal.bgColor} rounded-xl flex items-center justify-center`}>
                                    <cal.icon className={`text-2xl ${cal.color}`} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{cal.name}</h3>
                                    <p className="text-gray-400 text-sm">{cal.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-green-400 text-sm bg-green-400/10 px-3 py-1 rounded-full">
                                    <FaCheck className="text-xs" />
                                    Synced
                                </span>
                                {/* Toggle Switch */}
                                <div className="w-12 h-6 bg-primary-purple rounded-full relative cursor-pointer ml-2">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
=======
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
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Integrations Section */}
            <div>
<<<<<<< HEAD
                <h2 className="text-xl font-semibold text-white mb-4">Available Integrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableIntegrations.map((integration) => (
                        <div key={integration.id} className="bg-navy-900 border border-navy-700 rounded-2xl p-6 hover:border-navy-500 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 ${integration.bgColor} rounded-xl flex items-center justify-center`}>
                                    <integration.icon className={`text-2xl ${integration.color}`} />
                                </div>
                                <button className="text-white bg-navy-700 hover:bg-navy-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <FaPlus className="text-xs" />
                                    Connect
                                </button>
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">{integration.name}</h3>
                            <p className="text-gray-400 text-sm">{integration.description}</p>
=======
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
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
