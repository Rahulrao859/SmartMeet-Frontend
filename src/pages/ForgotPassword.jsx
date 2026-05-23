import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/* ─── IMPLEMENTATION 2.3 — Forgot Password Page ───────────────
 * Route: /forgot-password
 * User enters email → backend sends reset link → show confirmation.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
    const [email, setEmail]     = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent]       = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError('Please enter your email address.'); return; }
        setError(''); setLoading(true);
        try {
            await axios.post(`${API_BASE}/api/auth/forgot-password`, { email: email.trim() });
            setSent(true);
        } catch (err) {
            // Backend always returns 200 to prevent email enumeration;
            // but handle network errors gracefully
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.logo}>📅 SmartMeet</div>

                {!sent ? (
                    <>
                        <div style={{ ...styles.icon, background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>🔑</div>
                        <h2 style={styles.title}>Forgot Password?</h2>
                        <p style={styles.sub}>
                            Enter your account email and we'll send you a reset link.
                        </p>

                        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={styles.input}
                                disabled={loading}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Sending…' : 'Send Reset Link'}
                            </button>
                        </form>

                        <Link to="/login" style={styles.backLink}>← Back to Login</Link>
                    </>
                ) : (
                    <>
                        <div style={{ ...styles.icon, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>📬</div>
                        <h2 style={styles.title}>Check Your Email</h2>
                        <p style={styles.sub}>
                            If an account with <strong>{email}</strong> exists, a password
                            reset link has been sent. Check your inbox and spam folder.
                        </p>
                        <p style={{ ...styles.sub, fontSize: '13px' }}>
                            The link expires in <strong>1 hour</strong>.
                        </p>
                        <Link to="/login" style={styles.btnOutline}>Back to Login</Link>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px',
    },
    card: {
        background: '#fff', borderRadius: '20px', padding: '48px 40px', maxWidth: '440px',
        width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    },
    logo:  { fontSize: '22px', fontWeight: '700', color: '#6366f1', marginBottom: '28px' },
    icon:  { width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px' },
    title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px' },
    sub:   { fontSize: '15px', color: '#64748b', lineHeight: '1.6', margin: '0 0 24px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: {
        width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px',
        fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box',
        fontFamily: 'inherit', transition: 'border-color 0.2s',
    },
    btnPrimary: {
        width: '100%', padding: '14px', background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
        color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px',
        fontWeight: '600', cursor: 'pointer', marginBottom: '20px',
    },
    btnOutline: {
        display: 'inline-block', padding: '12px 28px', border: '2px solid #6366f1',
        color: '#6366f1', borderRadius: '10px', textDecoration: 'none', fontWeight: '600',
    },
    errorBox: {
        background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '8px', padding: '12px 14px', fontSize: '14px', marginBottom: '16px', textAlign: 'left',
    },
    backLink: { display: 'block', marginTop: '8px', color: '#6366f1', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
};

export default ForgotPassword;
