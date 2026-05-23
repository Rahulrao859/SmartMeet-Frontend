import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdPerson, MdEmail, MdLock, MdLanguage, MdNotifications, MdSave, MdDeleteForever, MdCheckCircle } from 'react-icons/md';

/* ─── IMPLEMENTATION 2.4 — User Profile Management Page ───────
 * Route: /profile  (protected)
 * Sections:
 *   1. Personal Info — name, avatar, timezone
 *   2. Notification Preferences — toggles
 *   3. Change Password
 *   4. Danger Zone — delete account
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// ── Toast component ───────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    const bg = type === 'success' ? '#10b981' : '#ef4444';
    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: bg, color: '#fff',
            padding: '14px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: '500',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
            animation: 'slideIn 0.3s ease' }}>
            {type === 'success' ? '✅' : '❌'} {message}
        </div>
    );
};

// ── Timezone list (abbreviated for profile picker) ────────────
const COMMON_TIMEZONES = [
    'UTC', 'Asia/Kolkata', 'America/New_York', 'America/Chicago',
    'America/Los_Angeles', 'America/Toronto', 'Europe/London',
    'Europe/Paris', 'Europe/Berlin', 'Asia/Dubai', 'Asia/Shanghai',
    'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney', 'Pacific/Auckland',
];

const Profile = () => {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [toast, setToast]     = useState(null);
    const [activeTab, setActiveTab] = useState('info'); // info | password | danger

    // Profile form state
    const [name, setName]         = useState('');
    const [timezone, setTimezone] = useState('UTC');
    const [notifPrefs, setNotifPrefs] = useState({
        emailOnInvite: true, emailOnReminder: true, emailOnCancel: true,
        whatsappOnInvite: false, reminderMinutes: 60,
    });

    // Password form state
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd]         = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    // Delete account
    const [deletePwd, setDeletePwd]         = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // ── Load user on mount ────────────────────────────────────
    useEffect(() => { loadUser(); }, []);

    const loadUser = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/api/auth/me`, getAuthHeader());
            const u = data.user;
            setUser(u);
            setName(u.name || '');
            setTimezone(u.timezone || 'UTC');
            setNotifPrefs(u.notificationPrefs || notifPrefs);
        } catch {
            showToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => setToast({ message, type });

    // ── Save profile info ─────────────────────────────────────
    const handleSaveInfo = async (e) => {
        e.preventDefault();
        if (!name.trim()) { showToast('Name cannot be empty', 'error'); return; }
        setSaving(true);
        try {
            await axios.put(`${API_BASE}/api/auth/profile`,
                { name: name.trim(), timezone, notificationPrefs: notifPrefs },
                getAuthHeader()
            );
            showToast('Profile updated successfully');
        } catch (err) {
            showToast(err.response?.data?.error || 'Update failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Change password ───────────────────────────────────────
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPwd !== confirmPwd) { showToast('Passwords do not match', 'error'); return; }
        if (newPwd.length < 8)     { showToast('Password must be at least 8 characters', 'error'); return; }
        setSaving(true);
        try {
            await axios.patch(`${API_BASE}/api/auth/change-password`,
                { currentPassword: currentPwd, newPassword: newPwd },
                getAuthHeader()
            );
            showToast('Password changed. Please log in again.');
            setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
        } catch (err) {
            showToast(err.response?.data?.error || 'Password change failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete account ────────────────────────────────────────
    const handleDeleteAccount = async () => {
        if (!deleteConfirm) { setDeleteConfirm(true); return; }
        if (!deletePwd.trim()) { showToast('Please enter your password to confirm', 'error'); return; }
        try {
            await axios.delete(`${API_BASE}/api/auth/account`,
                { data: { password: deletePwd }, ...getAuthHeader() }
            );
            localStorage.clear();
            window.location.href = '/';
        } catch (err) {
            showToast(err.response?.data?.error || 'Deletion failed', 'error');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#6366f1', fontSize: '15px' }}>
            Loading profile…
        </div>
    );

    return (
        <div style={styles.page}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.avatarCircle}>
                    {user?.avatar
                        ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        : <span style={{ fontSize: '32px', fontWeight: '700', color: '#6366f1' }}>
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </span>
                    }
                </div>
                <div>
                    <h1 style={styles.headerName}>{user?.name}</h1>
                    <p style={styles.headerEmail}>{user?.email}</p>
                    {user?.isVerified
                        ? <span style={styles.badgeVerified}><MdCheckCircle size={13} /> Verified</span>
                        : <span style={styles.badgeUnverified}>⚠ Email not verified</span>
                    }
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                {[
                    { key: 'info',     label: 'Profile Info',     icon: <MdPerson /> },
                    { key: 'password', label: 'Change Password',  icon: <MdLock /> },
                    { key: 'danger',   label: 'Danger Zone',      icon: <MdDeleteForever /> },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── TAB: Profile Info ─────────────────────────── */}
            {activeTab === 'info' && (
                <form onSubmit={handleSaveInfo} style={styles.card}>
                    <h3 style={styles.sectionTitle}><MdPerson /> Personal Information</h3>

                    <label style={styles.label}>Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                        style={styles.input} placeholder="Your name" />

                    <label style={styles.label}><MdEmail style={{ verticalAlign: 'middle' }} /> Email Address</label>
                    <input value={user?.email || ''} disabled style={{ ...styles.input, background: '#f8fafc', cursor: 'not-allowed' }} />
                    <p style={styles.hint}>Email cannot be changed after registration.</p>

                    <label style={styles.label}><MdLanguage style={{ verticalAlign: 'middle' }} /> Default Timezone</label>
                    <select value={timezone} onChange={e => setTimezone(e.target.value)} style={styles.input}>
                        {COMMON_TIMEZONES.map(tz => (
                            <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                        ))}
                    </select>

                    <h3 style={{ ...styles.sectionTitle, marginTop: '24px' }}><MdNotifications /> Notification Preferences</h3>
                    {[
                        { key: 'emailOnInvite',    label: 'Email when invited to a meeting' },
                        { key: 'emailOnReminder',  label: 'Email reminder before meeting' },
                        { key: 'emailOnCancel',    label: 'Email when meeting is cancelled' },
                        { key: 'whatsappOnInvite', label: 'WhatsApp notification on invite' },
                    ].map(({ key, label }) => (
                        <label key={key} style={styles.toggle}>
                            <span style={styles.toggleLabel}>{label}</span>
                            <div
                                onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                                style={{ ...styles.toggleSwitch, background: notifPrefs[key] ? '#6366f1' : '#e2e8f0' }}
                            >
                                <div style={{ ...styles.toggleThumb, transform: notifPrefs[key] ? 'translateX(20px)' : 'translateX(0)' }} />
                            </div>
                        </label>
                    ))}

                    <button type="submit" disabled={saving} style={{ ...styles.btnPrimary, marginTop: '24px' }}>
                        <MdSave /> {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </form>
            )}

            {/* ── TAB: Change Password ───────────────────────── */}
            {activeTab === 'password' && (
                <form onSubmit={handleChangePassword} style={styles.card}>
                    <h3 style={styles.sectionTitle}><MdLock /> Change Password</h3>
                    <label style={styles.label}>Current Password</label>
                    <input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} style={styles.input} placeholder="Enter current password" />
                    <label style={styles.label}>New Password</label>
                    <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} style={styles.input} placeholder="Min 8 chars, 1 uppercase, 1 number" />
                    <label style={styles.label}>Confirm New Password</label>
                    <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                        style={{ ...styles.input, borderColor: confirmPwd && confirmPwd !== newPwd ? '#ef4444' : '#e2e8f0' }}
                        placeholder="Re-enter new password" />
                    <button type="submit" disabled={saving || !currentPwd || !newPwd || !confirmPwd} style={styles.btnPrimary}>
                        {saving ? 'Updating…' : 'Update Password'}
                    </button>
                </form>
            )}

            {/* ── TAB: Danger Zone ──────────────────────────── */}
            {activeTab === 'danger' && (
                <div style={styles.card}>
                    <h3 style={{ ...styles.sectionTitle, color: '#ef4444' }}><MdDeleteForever /> Danger Zone</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
                        Permanently delete your account and all associated data — meetings, email logs,
                        and calendar events. <strong>This action cannot be undone.</strong>
                    </p>
                    {deleteConfirm && (
                        <>
                            <label style={styles.label}>Enter your password to confirm deletion</label>
                            <input type="password" value={deletePwd} onChange={e => setDeletePwd(e.target.value)}
                                style={{ ...styles.input, borderColor: '#ef4444' }} placeholder="Your password" />
                        </>
                    )}
                    <button onClick={handleDeleteAccount}
                        style={{ ...styles.btnDanger, marginTop: '8px' }}>
                        <MdDeleteForever />
                        {deleteConfirm ? 'Confirm — Delete My Account' : 'Delete My Account'}
                    </button>
                    {deleteConfirm && (
                        <button onClick={() => { setDeleteConfirm(false); setDeletePwd(''); }}
                            style={{ ...styles.btnOutline, marginTop: '12px' }}>
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Styles ────────────────────────────────────────────────────
const styles = {
    page:         { maxWidth: '720px', margin: '0 auto', padding: '32px 24px' },
    header:       { display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', padding: '28px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
    avatarCircle: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#ede9fe,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    headerName:   { margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#1e293b' },
    headerEmail:  { margin: '0 0 8px', fontSize: '14px', color: '#64748b' },
    badgeVerified:   { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' },
    badgeUnverified: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' },
    tabs:         { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    tab:          { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' },
    tabActive:    { borderColor: '#6366f1', color: '#6366f1', background: 'rgba(99,102,241,0.06)' },
    card:         { background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px' },
    label:        { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    hint:         { fontSize: '12px', color: '#94a3b8', marginTop: '-10px', marginBottom: '16px' },
    input:        { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' },
    toggle:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
    toggleLabel:  { fontSize: '14px', color: '#374151' },
    toggleSwitch: { width: '44px', height: '24px', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 },
    toggleThumb:  { position: 'absolute', top: '2px', left: '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'transform 0.3s' },
    btnPrimary:   { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%', padding: '13px', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    btnDanger:    { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%', padding: '13px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    btnOutline:   { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '12px', background: '#fff', color: '#64748b', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
};

export default Profile;
