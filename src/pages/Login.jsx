import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaRobot, FaCalendarAlt, FaEnvelope, FaChartLine, FaStar, FaTimes, FaLock, FaCheck } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { api, handleApiError } from '../services/api';

import './Auth.css';

const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [failCount, setFailCount] = useState(0);
    const [lockout, setLockout] = useState(0);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const lockInterval = useRef(null);

    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    };

    // Lockout countdown
    useEffect(() => {
        if (lockout > 0) {
            lockInterval.current = setInterval(() => {
                setLockout(prev => {
                    if (prev <= 1) { clearInterval(lockInterval.current); return 0; }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(lockInterval.current);
        }
    }, [lockout]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!formData.email) errs.email = 'Email is required';
        if (!formData.password) errs.password = 'Password is required';
        if (Object.keys(errs).length) { setFieldErrors(errs); return; }
        if (lockout > 0) return;

        setError('');
        setLoading(true);

        try {
            const response = await api.login(formData.email, formData.password);
            if (response.token) {
                setSuccess(true);
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                setTimeout(() => navigate('/dashboard'), 600);
            }
        } catch (err) {
            const newFails = failCount + 1;
            setFailCount(newFails);
            if (newFails >= 3) {
                setLockout(30);
                setError('Too many attempts. Please wait 30 seconds.');
            } else {
                setError('Incorrect email or password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        setForgotSent(true);
    };

    return (
        <div className="auth-split-layout">
            {/* Left Branded Panel */}
            <div className="auth-sidebar">
                <div className="auth-glow auth-glow-1" />
                <div className="auth-glow auth-glow-2" />
                <div className="auth-sidebar-inner">
                    <div className="auth-sidebar-brand">
                        <h1>
                            <div className="auth-logo-icon"><FaRobot size={28} /></div>
                            SmartMeet
                        </h1>
                        <p className="auth-tagline">Schedule smarter with AI</p>
                    </div>

                    <div className="auth-features">
                        {[
                            { icon: FaRobot, title: 'AI Scheduling', desc: 'Let AI handle the back-and-forth' },
                            { icon: FaCalendarAlt, title: 'Calendar Sync', desc: 'Connect Google, Outlook, and more' },
                            { icon: FaEnvelope, title: 'Email Automation', desc: 'Track sent invites and responses' },
                            { icon: FaChartLine, title: 'Smart Analytics', desc: 'Insights into your scheduling flow' },
                        ].map((f, i) => (
                            <div key={i} className="auth-feature-item">
                                <div className="auth-feature-icon"><f.icon /></div>
                                <div className="auth-feature-text">
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="auth-testimonial">
                        <div className="auth-stars">
                            {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                        </div>
                        <p className="auth-quote">"SmartMeet saved our team 8 hours a week on scheduling alone."</p>
                        <div className="auth-quoter">
                            <div className="auth-quoter-avatar">SC</div>
                            <span>Sarah Chen, CTO at InnovateLabs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-container">
                <div className="auth-card-premium">
                    <div className="auth-mobile-brand">
                        <div className="auth-logo-icon-sm"><FaRobot size={18} /></div>
                        SmartMeet
                    </div>

                    <div className="auth-header">
                        <h2 className="auth-title">Welcome back</h2>
                        <div className="auth-title-accent" />
                        <p className="auth-subtitle">Sign in to your account to continue</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="auth-error-banner">
                            <span>{error}</span>
                            {lockout > 0 && <span className="lockout-timer">{lockout}s</span>}
                            <button onClick={() => setError('')} className="auth-error-dismiss"><FaTimes size={14} /></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label htmlFor="l-email">Email address</label>
                            <div className="auth-input-wrap">
                                <MdEmail className="auth-input-icon" />
                                <input
                                    type="email"
                                    id="l-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="jane@company.com"
                                    autoComplete="email"
                                    className={`has-icons ${fieldErrors.email ? 'input-invalid' : ''}`}
                                />
                            </div>
                            {fieldErrors.email && <span className="auth-field-msg invalid">{fieldErrors.email}</span>}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="l-password">Password</label>
                            <div className="auth-input-wrap">
                                <FaLock className="auth-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="l-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className={`has-icons ${fieldErrors.password ? 'input-invalid' : ''}`}
                                />
                                <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {fieldErrors.password && <span className="auth-field-msg invalid">{fieldErrors.password}</span>}

                            <div className="auth-field-row">
                                <label className="auth-checkbox-wrap">
                                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                    <span className="auth-checkbox-custom" />
                                    <span className="auth-checkbox-label">Keep me signed in</span>
                                </label>
                                <button type="button" className="auth-forgot-btn" onClick={() => { setShowForgot(!showForgot); setForgotSent(false); }}>
                                    Forgot password?
                                </button>
                            </div>

                            {/* Inline Forgot Password Panel */}
                            {showForgot && (
                                <div className="forgot-panel">
                                    {forgotSent ? (
                                        <div className="forgot-success">
                                            <FaCheck size={14} />
                                            <span>Reset link sent to your email</span>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleForgotSubmit} className="forgot-form">
                                            <input
                                                type="email"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                placeholder="Enter your email address"
                                                required
                                            />
                                            <button type="submit" className="forgot-submit">Send reset link</button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`btn-auth-submit ${success ? 'btn-success' : ''}`}
                            disabled={loading || lockout > 0}
                        >
                            {success ? (
                                <span className="btn-loading"><FaCheck /> Signed in!</span>
                            ) : loading ? (
                                <span className="btn-loading">
                                    <svg className="spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" /></svg>
                                    Signing in...
                                </span>
                            ) : lockout > 0 ? `Wait ${lockout}s...` : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-divider"><span>or continue with</span></div>

                    <button type="button" className="btn-google">
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <div className="auth-footer-text">
                        Don't have an account? <Link to="/signup" className="auth-link">Sign up free</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
