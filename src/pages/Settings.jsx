import React, { useState, useEffect } from 'react';
import { MdPerson, MdNotifications, MdSecurity, MdIntegrationInstructions, MdSave, MdPalette, MdDarkMode, MdLightMode, MdCheckCircle } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

// Google Calendar Integration Component
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
                // Open OAuth flow in new window
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
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Connected Calendars</h3>

            <div className="p-6 bg-navy-900 dark:bg-navy-900 bg-gray-50 rounded-xl border border-navy-700 dark:border-navy-700 border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
                            <FaGoogle className="text-3xl text-red-500" />
                        </div>
                        <div>
                            <h4 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                                Google Calendar
                                {calendarStatus.connected && (
                                    <MdCheckCircle className="text-green-400" />
                                )}
                            </h4>
                            <p className="text-gray-600 text-sm">
                                {calendarStatus.connected
                                    ? calendarStatus.email || 'Connected'
                                    : 'Not connected'}
                            </p>
                            {calendarStatus.connected && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                    <MdCheckCircle className="text-sm" />
                                    Synced
                                </span>
                            )}
                        </div>
                    </div>

                    {calendarStatus.connected ? (
                        <button
                            onClick={handleDisconnect}
                            disabled={loading}
                            className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-200 font-medium disabled:opacity-50"
                        >
                            {loading ? 'Disconnecting...' : 'Disconnect'}
                        </button>
                    ) : (
                        <button
                            onClick={handleConnect}
                            disabled={loading}
                            className="px-5 py-2.5 bg-gradient-to-r from-primary-purple to-primary-blue text-white rounded-lg hover:shadow-lg hover:shadow-primary-purple/30 transition-all duration-200 font-medium disabled:opacity-50"
                        >
                            {loading ? 'Connecting...' : 'Connect'}
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                    <strong>ℹ️ Info:</strong> Connecting Google Calendar will automatically create calendar events when you schedule meetings through SmartMeet.
                </p>
            </div>
        </div>
    );
};

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { theme, setTheme, toggleTheme } = useTheme();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        fullName: ''
    });

    // Load user data from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                // Extract first and last name from full name
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

    // Generate initials from user name
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

    const tabs = [
        { id: 'profile', label: 'Profile', icon: MdPerson },
        { id: 'appearance', label: 'Appearance', icon: MdPalette },
        { id: 'notifications', label: 'Notifications', icon: MdNotifications },
        { id: 'security', label: 'Security', icon: MdSecurity },
        { id: 'integrations', label: 'Integrations', icon: MdIntegrationInstructions },
    ];

    const handleSaveChanges = () => {
        // Show success message
        alert('Settings saved successfully!');
    };

    return (
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
                                        {getInitials()}
                                    </div>
                                    <button className="px-6 py-3 bg-navy-700 dark:bg-navy-700 bg-gray-100 text-white dark:text-white text-gray-700 rounded-lg hover:bg-navy-600 dark:hover:bg-navy-600 hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm">
                                        Change Avatar
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">First Name</label>
                                        <input type="text" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">Last Name</label>
                                        <input type="text" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-2">Email Address</label>
                                        <input type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} className="w-full bg-navy-900 dark:bg-navy-900 bg-gray-50 border border-navy-700 dark:border-navy-700 border-gray-300 rounded-lg px-4 py-3 text-white dark:text-white text-gray-900 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20 transition-colors" />
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
                                <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-6">Manage your connected calendars and meeting platforms</p>

                                <GoogleCalendarIntegration />
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
                </div>
            </div>
        </div>
    );
};

export default Settings;
