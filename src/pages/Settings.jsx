<<<<<<< HEAD
import React, { useState } from 'react';
import { MdPerson, MdNotifications, MdSecurity, MdIntegrationInstructions, MdSave, MdPalette, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { theme, setTheme, toggleTheme } = useTheme();
=======
import React, { useState, useEffect } from 'react';
import { MdPerson, MdNotifications, MdSecurity, MdIntegrationInstructions, MdPalette, MdCheckCircle } from 'react-icons/md';
import { FaGoogle, FaWhatsapp } from 'react-icons/fa';
import api from '../services/api';

const GoogleCalendarIntegration = () => {
    const [calendarStatus, setCalendarStatus] = useState({ connected: false, email: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkCalendarStatus();
    }, []);

    const checkCalendarStatus = async () => {
        try {
            const response = await api.get('/calendar/status');
            setCalendarStatus(response.data);
        } catch (error) {
            console.error('Error checking calendar status:', error);
        }
    };

    const handleConnect = async () => {
        try {
            setLoading(true);
            const response = await api.get('/calendar/auth');
            if (response.data.authUrl) {
                window.open(response.data.authUrl, '_blank');
            }
        } catch (error) {
            console.error('Error connecting calendar:', error);
            alert('Failed to connect Google Calendar. Please check your configuration.');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            setLoading(true);
            await api.post('/calendar/disconnect');
            setCalendarStatus({ connected: false, email: null });
            alert('Google Calendar disconnected successfully');
        } catch (error) {
            console.error('Error disconnecting calendar:', error);
            alert('Failed to disconnect calendar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '24px' }}>
            <div className="card-clean" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(219, 68, 55, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaGoogle style={{ fontSize: '24px', color: '#DB4437' }} />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Google Calendar
                            {calendarStatus.connected && <MdCheckCircle style={{ color: '#10B981' }} />}
                        </h4>
                        <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-muted)' }}>
                            {calendarStatus.connected ? calendarStatus.email || 'Connected' : 'Not connected'}
                        </p>
                    </div>
                </div>

                {calendarStatus.connected ? (
                    <button
                        onClick={handleDisconnect}
                        disabled={loading}
                        className="btn-outline"
                        style={{ color: '#EF4444', borderColor: '#EF4444' }}
                    >
                        {loading ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                ) : (
                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Connecting...' : 'Connect'}
                    </button>
                )}
            </div>
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '12px', color: '#0369A1', fontSize: '13px' }}>
                <strong>ℹ️ Info:</strong> Connecting Google Calendar will automatically create calendar events when you schedule meetings through SmartMeet.
            </div>
        </div>
    );
};

// ─── WhatsApp Integration Component ───────────────────────────────────────────
const WhatsAppIntegration = () => {
    const [enabled, setEnabled] = useState(() => localStorage.getItem('wa_enabled') === 'true');
    const [phone, setPhone] = useState(() => localStorage.getItem('wa_phone') || '');
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');
    const [saved, setSaved] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testMsg, setTestMsg] = useState('');

    const handleEdit = () => { setDraft(phone); setEditing(true); setSaved(false); setTestMsg(''); };

    const handleSave = () => {
        const cleaned = draft.trim().replace(/\s/g, '');
        if (!/^\+[1-9]\d{6,14}$/.test(cleaned)) {
            setTestMsg('❌ Invalid format. Use international format: +91XXXXXXXXXX');
            return;
        }
        setPhone(cleaned);
        localStorage.setItem('wa_phone', cleaned);
        localStorage.setItem('wa_enabled', 'true');
        setEnabled(true);
        setEditing(false);
        setSaved(true);
        setTestMsg('');
        setTimeout(() => setSaved(false), 3000);
    };

    const handleToggle = () => {
        const next = !enabled;
        setEnabled(next);
        localStorage.setItem('wa_enabled', String(next));
    };

    const handleTest = async () => {
        if (!phone) { setTestMsg('❌ Save a phone number first.'); return; }
        setTesting(true);
        setTestMsg('');
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const res = await fetch(`${baseUrl}/whatsapp/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const data = await res.json();
            if (data.success) {
                setTestMsg('✅ Test message sent! Check your WhatsApp.');
            } else {
                setTestMsg(`❌ Failed: ${data.error || 'Unknown error'}`);
            }
        } catch (e) {
            setTestMsg('❌ Could not reach backend. Is the server running?');
        } finally {
            setTesting(false);
        }
    };

    return (
        <div style={{ marginTop: '24px' }}>
            {/* Card */}
            <div className="card-clean" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(37,211,102,0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FaWhatsapp style={{ fontSize: '26px', color: '#25D366' }} />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            WhatsApp Notifications
                            {enabled && phone && <MdCheckCircle style={{ color: '#10B981' }} />}
                        </h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                            {phone ? `Sending to ${phone}` : 'No number configured'}
                        </p>
                    </div>
                </div>

                {/* Toggle */}
                <label className="switch" style={{ marginTop: '8px' }}>
                    <input type="checkbox" checked={enabled} onChange={handleToggle} disabled={!phone} />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Phone Number Config */}
            <div style={{ marginTop: '16px', padding: '20px', border: '1px solid var(--card-border)', borderRadius: '12px', backgroundColor: 'var(--bg-soft, #FAFAFA)' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
                    📱 Your WhatsApp Number (international format)
                </label>

                {editing ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input
                            type="tel"
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            placeholder="+916987463059"
                            className="input-field"
                            style={{ flex: 1, minWidth: '200px' }}
                            autoFocus
                        />
                        <button className="btn-primary" onClick={handleSave}>Save</button>
                        <button className="btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500', color: phone ? '#111827' : '#9CA3AF', flex: 1 }}>
                            {phone || 'Not set — click Edit to add'}
                        </span>
                        <button className="btn-outline" onClick={handleEdit}>Edit</button>
                        {phone && (
                            <button
                                className="btn-primary"
                                onClick={handleTest}
                                disabled={testing}
                                style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                            >
                                {testing ? 'Sending...' : '📤 Send Test'}
                            </button>
                        )}
                    </div>
                )}

                {/* Status message */}
                {testMsg && (
                    <p style={{ marginTop: '10px', fontSize: '13px', color: testMsg.startsWith('✅') ? '#059669' : '#DC2626', fontWeight: '500' }}>
                        {testMsg}
                    </p>
                )}
                {saved && !testMsg && (
                    <p style={{ marginTop: '10px', fontSize: '13px', color: '#059669', fontWeight: '500' }}>✅ Number saved!</p>
                )}
            </div>

            {/* Info box */}
            <div style={{ marginTop: '12px', padding: '14px 16px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', color: '#166534', fontSize: '13px' }}>
                <strong>ℹ️ How it works:</strong> When you schedule a meeting via AI Scheduler, a WhatsApp message with the meeting details is automatically sent to this number via Twilio sandbox.
            </div>
        </div>
    );
};

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        fullName: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const nameParts = user.name ? user.name.split(' ') : ['', ''];
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                setUserData({
                    firstName,
                    lastName,
                    email: user.email || '',
                    fullName: user.name || ''
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const getInitials = () => {
        if (userData.firstName && userData.lastName) {
            return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
        } else if (userData.fullName) {
            const parts = userData.fullName.split(' ');
            if (parts.length >= 2) {
                return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
            }
            return userData.fullName.charAt(0).toUpperCase();
        }
        return 'U';
    };
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b

    const tabs = [
        { id: 'profile', label: 'Profile', icon: MdPerson },
        { id: 'appearance', label: 'Appearance', icon: MdPalette },
        { id: 'notifications', label: 'Notifications', icon: MdNotifications },
        { id: 'security', label: 'Security', icon: MdSecurity },
        { id: 'integrations', label: 'Integrations', icon: MdIntegrationInstructions },
    ];

    const handleSaveChanges = () => {
<<<<<<< HEAD
        // Show success message
=======
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        alert('Settings saved successfully!');
    };

    return (
<<<<<<< HEAD
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white dark:text-white text-gray-900 mb-8">Settings</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-navy-800 dark:bg-navy-800 bg-white rounded-xl border border-navy-700 dark:border-navy-700 border-gray-200 overflow-hidden shadow-sm">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-primary-purple to-primary-blue text-white'
                                        : 'text-gray-400 dark:text-gray-400 text-gray-600 hover:bg-navy-700 dark:hover:bg-navy-700 hover:bg-gray-50 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <Icon className="text-xl" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-navy-800 dark:bg-navy-800 bg-white rounded-xl border border-navy-700 dark:border-navy-700 border-gray-200 p-8 shadow-sm">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900 mb-6">Profile Settings</h2>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary-purple to-primary-blue rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                        JD
                                    </div>
                                    <button className="px-6 py-3 bg-navy-700 dark:bg-navy-700 bg-gray-100 text-white dark:text-white text-gray-700 rounded-lg hover:bg-navy-600 dark:hover:bg-navy-600 hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm">
                                        Change Avatar
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">First Name</label>
                                        <input type="text" defaultValue="John" className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">Last Name</label>
                                        <input type="text" defaultValue="Doe" className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">Email Address</label>
                                        <input type="email" defaultValue="john.doe@example.com" className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">Bio</label>
                                        <textarea rows="4" placeholder="Tell us about yourself..." className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors"></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900 mb-6">Appearance Settings</h2>
                                <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-6">Customize the visual appearance of your application</p>

                                <div className="space-y-4">
                                    {/* Theme Toggle */}
                                    <div className="p-6 bg-navy-900 dark:bg-navy-900 bg-gray-50 rounded-xl border border-navy-700 dark:border-navy-700 border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {theme === 'dark' ? (
                                                    <MdDarkMode className="text-2xl text-primary-purple" />
                                                ) : (
                                                    <MdLightMode className="text-2xl text-primary-blue" />
                                                )}
                                                <div>
                                                    <h3 className="text-white dark:text-white text-gray-900 font-semibold text-lg">Theme</h3>
                                                    <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Choose your preferred color scheme</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={theme === 'light'}
                                                    onChange={toggleTheme}
                                                />
                                                <div className="w-14 h-7 bg-navy-700 dark:bg-navy-700 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-purple shadow-inner"></div>
                                            </label>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <button
                                                onClick={() => setTheme('dark')}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${theme === 'dark'
                                                    ? 'border-primary-purple bg-primary-purple/10 text-primary-purple'
                                                    : 'border-gray-300 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-navy-600'
                                                    }`}
                                            >
                                                <MdDarkMode className="text-xl" />
                                                <span className="font-medium">Dark</span>
                                            </button>
                                            <button
                                                onClick={() => setTheme('light')}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${theme === 'light'
                                                    ? 'border-primary-blue bg-primary-blue/10 text-primary-blue'
                                                    : 'border-gray-300 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-navy-600'
                                                    }`}
                                            >
                                                <MdLightMode className="text-xl" />
                                                <span className="font-medium">Light</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900 mb-6">Notification Preferences</h2>
                                <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-6">Manage how you receive notifications</p>
                                <div className="space-y-4">
                                    {['Email Notifications', 'Push Notifications', 'Weekly Digest', 'Meeting Reminders'].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 bg-navy-900 dark:bg-navy-900 bg-gray-50 rounded-xl border border-navy-700 dark:border-navy-700 border-gray-200 hover:border-primary-purple/30 transition-all duration-200">
                                            <div>
                                                <span className="text-white dark:text-white text-gray-900 font-medium block">{item}</span>
                                                <span className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Receive {item.toLowerCase()}</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                                <div className="w-11 h-6 bg-navy-700 dark:bg-navy-700 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900 mb-6">Security Settings</h2>
                                <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-6">Manage your account security preferences</p>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">Current Password</label>
                                        <input type="password" className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">New Password</label>
                                        <input type="password" className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">Confirm New Password</label>
                                        <input type="password" className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'integrations' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900 mb-6">Integration Settings</h2>
                                <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-6">Connect and manage your third-party integrations</p>
                                <div className="text-gray-400 dark:text-gray-400 text-gray-600 text-center py-12">
                                    No integrations configured yet. Visit the Calendar page to add integrations.
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-8 border-t border-navy-700 dark:border-navy-700 border-gray-200 flex justify-end gap-3">
                            <button className="px-6 py-3 bg-navy-700 dark:bg-navy-700 bg-gray-100 text-white dark:text-white text-gray-700 rounded-lg hover:bg-navy-600 dark:hover:bg-navy-600 hover:bg-gray-200 transition-all duration-200 font-medium">
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-blue text-white rounded-lg hover:shadow-lg hover:shadow-primary-purple/30 transition-all duration-200 font-medium shadow-md"
                            >
                                <MdSave className="text-xl" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
=======
        <div className="page-container">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your account preferences and integrations</p>
            </div>

            <div style={{ display: 'flex', gap: '32px', flexDirection: 'row', alignItems: 'flex-start' }} className="settings-layout">
                {/* Left Sub-Navigation Panel */}
                <div style={{ width: '240px', flexShrink: 0, backgroundColor: '#FFFFFF', borderRight: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px 0', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 24px',
                                    backgroundColor: isActive ? '#F0EEFF' : 'transparent',
                                    color: isActive ? '#6C63FF' : '#4B5563',
                                    border: 'none',
                                    borderLeft: isActive ? '3px solid #6C63FF' : '3px solid transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px',
                                    fontWeight: isActive ? '600' : '500',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = '#F8F9FC';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <Icon style={{ fontSize: '18px', color: isActive ? '#6C63FF' : '#9CA3AF' }} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right Content Panel */}
                <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: '32px' }}>
                    
                    {activeTab === 'profile' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '24px' }}>Profile Settings</h2>
                            
                            {/* Avatar Section */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                                <div style={{ width: '80px', height: '80px', backgroundColor: '#6C63FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '28px', fontWeight: 'bold' }}>
                                    {getInitials()}
                                </div>
                                <button style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                                >
                                    Change Avatar
                                </button>
                            </div>

                            {/* Form Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>First Name</label>
                                    <input type="text" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} className="input-field" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>Last Name</label>
                                    <input type="text" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} className="input-field" />
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>Email Address</label>
                                <input type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} className="input-field" />
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>Bio</label>
                                <textarea 
                                    className="input-field" 
                                    style={{ height: 'auto', minHeight: '100px', padding: '12px 16px', resize: 'vertical' }} 
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--card-border)', paddingBottom: '32px', marginBottom: '32px' }}>
                                <button className="btn-primary" onClick={handleSaveChanges}>
                                    Save Changes
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#EF4444', marginBottom: '8px' }}>Danger Zone</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>Permanently unrecoverable actions. Proceed with caution.</p>
                                <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#7F1D1D' }}>Delete Account</h4>
                                        <p style={{ margin: '0', fontSize: '13px', color: '#991B1B' }}>Permanently remove your account and all data</p>
                                    </div>
                                    <button className="btn-outline" style={{ color: '#EF4444', borderColor: '#EF4444' }}>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Appearance</h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>Currently locked to Light Mode standard.</p>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Notifications</h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>Manage how you receive alerts.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {['Email Notifications', 'Push Notifications', 'Weekly Digest', 'Meeting Reminders'].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--card-border)', borderRadius: '12px' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-dark)' }}>{item}</span>
                                            <span style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)' }}>Receive {item.toLowerCase()} alerts</span>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={i < 2} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Security</h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>Update your password.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>Current Password</label>
                                    <input type="password" className="input-field" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>New Password</label>
                                    <input type="password" className="input-field" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>Confirm New Password</label>
                                    <input type="password" className="input-field" />
                                </div>
                                <button className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>Update Password</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Integrations</h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Connect third-party accounts to SmartMeet.</p>

                            <GoogleCalendarIntegration />
                            <WhatsAppIntegration />
                        </div>
                    )}

>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                </div>
            </div>
        </div>
    );
};

export default Settings;
