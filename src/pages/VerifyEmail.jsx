import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/* ─── IMPLEMENTATION 2.2 — Verify Email Page ───────────────────
 * Route: /verify-email/:token
 * Triggered when user clicks the link from their verification email.
 * Calls GET /api/auth/verify-email/:token and shows result.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const VerifyEmail = () => {
    const { token }    = useParams();
    const navigate     = useNavigate();
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }
        verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/api/auth/verify-email/${token}`);
            setStatus('success');
            setMessage(data.message || 'Email verified successfully!');
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Verification failed. The link may have expired.');
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logo}>📅 SmartMeet</div>

                {/* State: Loading */}
                {status === 'loading' && (
                    <>
                        <div style={styles.spinner} />
                        <h2 style={styles.title}>Verifying your email…</h2>
                        <p style={styles.sub}>Please wait a moment.</p>
                    </>
                )}

                {/* State: Success */}
                {status === 'success' && (
                    <>
                        <div style={{ ...styles.icon, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>✅</div>
                        <h2 style={styles.title}>Email Verified!</h2>
                        <p style={styles.sub}>{message}</p>
                        <button style={styles.btnPrimary} onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </button>
                    </>
                )}

                {/* State: Error */}
                {status === 'error' && (
                    <>
                        <div style={{ ...styles.icon, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>❌</div>
                        <h2 style={styles.title}>Verification Failed</h2>
                        <p style={styles.sub}>{message}</p>
                        <Link to="/login" style={styles.link}>Back to Login</Link>
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
    logo: { fontSize: '22px', fontWeight: '700', color: '#6366f1', marginBottom: '28px' },
    spinner: {
        width: '48px', height: '48px', border: '4px solid #e2e8f0',
        borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 24px',
        animation: 'spin 0.8s linear infinite',
    },
    icon: {
        width: '64px', height: '64px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '28px', margin: '0 auto 20px',
    },
    title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px' },
    sub:   { fontSize: '15px', color: '#64748b', lineHeight: '1.6', margin: '0 0 28px' },
    btnPrimary: {
        width: '100%', padding: '14px', background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
        color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px',
        fontWeight: '600', cursor: 'pointer',
    },
    link: { color: '#6366f1', textDecoration: 'none', fontWeight: '600' },
};

export default VerifyEmail;
