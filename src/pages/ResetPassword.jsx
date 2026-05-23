import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/* ─── IMPLEMENTATION 2.3 — Reset Password Page ────────────────
 * Route: /reset-password/:token
 * User arrives from email link, enters new password.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const passwordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8)           score++;
    if (/[A-Z]/.test(pwd))         score++;
    if (/[0-9]/.test(pwd))         score++;
    if (/[^A-Za-z0-9]/.test(pwd))  score++;
    return score; // 0-4
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const ResetPassword = () => {
    const { token }     = useParams();
    const navigate      = useNavigate();
    const [password, setPassword]     = useState('');
    const [confirm, setConfirm]       = useState('');
    const [showPwd, setShowPwd]       = useState(false);
    const [loading, setLoading]       = useState(false);
    const [success, setSuccess]       = useState(false);
    const [error, setError]           = useState('');

    const strength = passwordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        if (strength < 2)         { setError('Please choose a stronger password.'); return; }
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/api/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.logo}>📅 SmartMeet</div>

                {!success ? (
                    <>
                        <div style={{ ...styles.icon, background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>🔐</div>
                        <h2 style={styles.title}>Set New Password</h2>
                        <p style={styles.sub}>Choose a strong password for your account.</p>

                        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                            {/* New password */}
                            <label style={styles.label}>New Password</label>
                            <div style={{ position: 'relative', marginBottom: '6px' }}>
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Min 8 chars, uppercase, number"
                                    style={{ ...styles.input, marginBottom: 0, paddingRight: '44px' }}
                                    disabled={loading}
                                    autoFocus
                                />
                                <button type="button" onClick={() => setShowPwd(p => !p)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                             background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                                    {showPwd ? '🙈' : '👁️'}
                                </button>
                            </div>

                            {/* Strength bar */}
                            {password && (
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                        {[1,2,3,4].map(i => (
                                            <div key={i} style={{
                                                flex: 1, height: '4px', borderRadius: '2px',
                                                background: i <= strength ? strengthColor[strength] : '#e2e8f0',
                                                transition: 'background 0.3s',
                                            }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '12px', color: strengthColor[strength], fontWeight: '600' }}>
                                        {strengthLabel[strength]}
                                    </span>
                                </div>
                            )}

                            {/* Confirm password */}
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                placeholder="Re-enter new password"
                                style={{ ...styles.input, borderColor: confirm && confirm !== password ? '#ef4444' : '#e2e8f0' }}
                                disabled={loading}
                            />
                            {confirm && confirm !== password && (
                                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '-10px', marginBottom: '12px' }}>
                                    Passwords don't match
                                </p>
                            )}

                            <button type="submit" disabled={loading || !password || !confirm}
                                style={{ ...styles.btnPrimary, opacity: (loading || !password || !confirm) ? 0.6 : 1 }}>
                                {loading ? 'Resetting…' : 'Reset Password'}
                            </button>
                        </form>
                        <Link to="/login" style={styles.backLink}>← Back to Login</Link>
                    </>
                ) : (
                    <>
                        <div style={{ ...styles.icon, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>✅</div>
                        <h2 style={styles.title}>Password Reset!</h2>
                        <p style={styles.sub}>
                            Your password has been updated. Redirecting you to login in 3 seconds…
                        </p>
                        <Link to="/login" style={styles.btnPrimary}>Go to Login Now</Link>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' },
    card:  { background: '#fff', borderRadius: '20px', padding: '48px 40px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
    logo:  { fontSize: '22px', fontWeight: '700', color: '#6366f1', marginBottom: '28px' },
    icon:  { width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px' },
    title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px' },
    sub:   { fontSize: '15px', color: '#64748b', lineHeight: '1.6', margin: '0 0 24px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
    btnPrimary: { display: 'block', width: '100%', padding: '14px', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', textAlign: 'center', marginBottom: '16px' },
    errorBox: { background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', marginBottom: '16px', textAlign: 'left' },
    backLink: { display: 'block', color: '#6366f1', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
};

export default ResetPassword;
