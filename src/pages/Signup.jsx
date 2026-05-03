<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCalendarAlt, FaUser, FaBuilding, FaArrowRight, FaCheck } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsLinkedin } from 'react-icons/bs';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        password: '',
        agreeToTerms: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.agreeToTerms) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        console.log('Signup attempt:', formData);
        navigate('/dashboard');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSocialSignup = (provider) => {
        console.log(`Signup with ${provider}`);
        navigate('/dashboard');
    };

    return (
        <div className="auth-page">
            <nav className="auth-nav">
                <Link to="/" className="auth-nav-logo">
                    <div className="auth-nav-logo-icon">
                        <FaCalendarAlt />
                    </div>
                    <span>SmartMeet</span>
                </Link>
                <div className="auth-nav-actions">
                    <Link to="/login" className="auth-nav-link">Sign In</Link>
                    <button
                        onClick={() => navigate('/signup')}
                        className="auth-nav-btn"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            <main className="auth-main">
                <div className="auth-container-new">
                    <div className="auth-right">
                        <div className="auth-form-card">
                            <div className="auth-form-header">
                                <h1 className="auth-form-title">Create your account</h1>
                                <p className="auth-form-subtitle">Start scheduling interviews smarter today.</p>
                            </div>

                            <div className="social-buttons">
                                <button
                                    className="social-button"
                                    onClick={() => handleSocialSignup('Google')}
                                >
                                    <FcGoogle className="social-button-icon" />
                                    Sign up with Google
                                </button>
                                <button
                                    className="social-button"
                                    onClick={() => handleSocialSignup('LinkedIn')}
                                >
                                    <BsLinkedin className="social-button-icon" style={{ color: '#0077b5' }} />
                                    Sign up with LinkedIn
                                </button>
                            </div>

                            <div className="auth-divider">
                                <span className="auth-divider-text">Or sign up with email</span>
                            </div>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-row">
                                    <div className="form-field">
                                        <label htmlFor="firstName" className="form-field-label">First Name</label>
                                        <div className="form-field-input-wrapper">
                                            <FaUser className="form-field-icon" />
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                className="form-field-input"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="lastName" className="form-field-label">Last Name</label>
                                        <div className="form-field-input-wrapper">
                                            <FaUser className="form-field-icon" />
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                className="form-field-input"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="email" className="form-field-label">Work Email</label>
                                    <div className="form-field-input-wrapper">
                                        <FaEnvelope className="form-field-icon" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-field-input"
                                            placeholder="john@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="company" className="form-field-label">Company Name</label>
                                    <div className="form-field-input-wrapper">
                                        <FaBuilding className="form-field-icon" />
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            className="form-field-input"
                                            placeholder="Your Company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="password" className="form-field-label">Password</label>
                                    <div className="form-field-input-wrapper">
                                        <FaLock className="form-field-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            className="form-field-input"
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength="8"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <p className="password-hint">Must be at least 8 characters long</p>
                                </div>

                                <div className="terms-checkbox">
                                    <input
                                        type="checkbox"
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="agreeToTerms">
                                        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                                    </label>
                                </div>

                                <button type="submit" className="auth-submit-button">
                                    Create Account
                                    <FaArrowRight />
                                </button>
                            </form>

                            <div className="auth-footer-link">
                                Already have an account? <Link to="/login">Sign in</Link>
                            </div>
                        </div>
                    </div>

                    <div className="auth-left">
                        <div className="auth-image-card">
                            <div className="auth-image-wrapper">
                                <img
                                    src="/signup-office.png"
                                    alt="Modern office workspace"
                                />
                            </div>
                            <h2 className="auth-left-title">Join 500+ companies already using SmartMeet</h2>

                            <div className="benefits-list">
                                <div className="benefit-item">
                                    <FaCheck className="benefit-icon" />
                                    <div className="benefit-content">
                                        <div className="benefit-title">14-day free trial</div>
                                        <div className="benefit-description">
                                            No credit card required. Cancel anytime.
                                        </div>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <FaCheck className="benefit-icon" />
                                    <div className="benefit-content">
                                        <div className="benefit-title">Save 10+ hours per week</div>
                                        <div className="benefit-description">
                                            Automate scheduling and eliminate back-and-forth emails.
                                        </div>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <FaCheck className="benefit-icon" />
                                    <div className="benefit-content">
                                        <div className="benefit-title">Reduce no-shows by 80%</div>
                                        <div className="benefit-description">
                                            Automated reminders keep everyone on track.
                                        </div>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <FaCheck className="benefit-icon" />
                                    <div className="benefit-content">
                                        <div className="benefit-title">Enterprise-grade security</div>
                                        <div className="benefit-description">
                                            SOC 2 certified with bank-level encryption.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
=======
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaRobot, FaCalendarAlt, FaEnvelope, FaCheck, FaTimes, FaChartLine, FaStar, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { api, handleApiError } from '../services/api';
import './Auth.css';

const COMMON_PASSWORDS = ['password', '12345678', 'qwerty123', 'password123', 'smartmeet123', 'abcdefgh', 'letmein123'];

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pwFocused, setPwFocused] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Password validation rules
    const rules = useMemo(() => {
        const pw = formData.password;
        return [
            { label: 'At least 8 characters', met: pw.length >= 8 },
            { label: 'One uppercase letter (A–Z)', met: /[A-Z]/.test(pw) },
            { label: 'One lowercase letter (a–z)', met: /[a-z]/.test(pw) },
            { label: 'One number (0–9)', met: /[0-9]/.test(pw) },
            { label: 'One special character (!@#$%…)', met: /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?\/\\]/.test(pw) },
            { label: 'No spaces', met: pw.length > 0 && !/\s/.test(pw) },
        ];
    }, [formData.password]);

    const metCount = rules.filter(r => r.met).length;

    const isCommon = formData.password.length > 0 && COMMON_PASSWORDS.includes(formData.password.toLowerCase());

    const strength = useMemo(() => {
        if (isCommon) return { level: 0, label: 'Too common', color: '#EF4444' };
        if (metCount <= 1) return { level: 1, label: 'Weak', color: '#EF4444' };
        if (metCount <= 3) return { level: 2, label: 'Fair', color: '#F59E0B' };
        if (metCount <= 4) return { level: 3, label: 'Good', color: '#3B82F6' };
        return { level: 4, label: 'Strong', color: '#10B981' };
    }, [metCount, isCommon]);

    const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
    const passwordsMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

    const allValid = metCount === 6 && !isCommon && passwordsMatch;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!allValid) {
            setError('Please fix the password requirements above.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.signup(formData.fullName, formData.email, formData.password);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
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
                        <h2 className="auth-title">Create an account</h2>
                        <div className="auth-title-accent" />
                        <p className="auth-subtitle">Get started with SmartMeet today</p>
                    </div>

                    {error && (
                        <div className="auth-error-banner">
                            <span>{error}</span>
                            <button onClick={() => setError('')} className="auth-error-dismiss"><FaTimes size={14} /></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Jane Doe" required autoComplete="name" />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="s-email">Email address</label>
                            <input type="email" id="s-email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@company.com" required autoComplete="email" />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="s-password">Password</label>
                            <div className="auth-input-wrap">
                                <FaLock className="auth-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="s-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setPwFocused(true)}
                                    placeholder="Create a strong password"
                                    required
                                    autoComplete="new-password"
                                    className="has-icons"
                                />
                                <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {/* Password Validation Checklist */}
                            {(pwFocused || formData.password.length > 0) && (
                                <div className="pw-checklist">
                                    {rules.map((rule, i) => (
                                        <div key={i} className={`pw-rule ${rule.met ? 'pw-rule-met' : ''}`}>
                                            <span className="pw-rule-icon">
                                                {rule.met ? <FaCheck size={10} /> : <span className="pw-rule-dot" />}
                                            </span>
                                            <span>{rule.label}</span>
                                        </div>
                                    ))}
                                    {isCommon && (
                                        <div className="pw-rule pw-rule-warn">
                                            <span className="pw-rule-icon"><FaTimes size={10} /></span>
                                            <span>This password is too common</span>
                                        </div>
                                    )}

                                    {/* Strength Meter */}
                                    <div className="pw-strength">
                                        <div className="pw-strength-bar">
                                            {[1, 2, 3, 4].map(seg => (
                                                <div
                                                    key={seg}
                                                    className="pw-strength-seg"
                                                    style={{ backgroundColor: seg <= strength.level ? strength.color : '#E5E7EB' }}
                                                />
                                            ))}
                                        </div>
                                        <span className="pw-strength-label" style={{ color: strength.color }}>{formData.password.length > 0 ? strength.label : ''}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="auth-input-wrap">
                                <FaLock className="auth-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    autoComplete="new-password"
                                    className={`has-icons ${passwordsMatch ? 'input-valid' : ''} ${passwordsMismatch ? 'input-invalid' : ''}`}
                                />
                                {passwordsMatch && <FaCheck className="auth-input-status-icon valid" />}
                                {passwordsMismatch && <FaTimes className="auth-input-status-icon invalid" />}
                            </div>
                            {passwordsMatch && <span className="auth-field-msg valid">Passwords match</span>}
                            {passwordsMismatch && <span className="auth-field-msg invalid">Passwords do not match</span>}
                        </div>

                        <button type="submit" className={`btn-auth-submit ${allValid ? '' : 'btn-disabled'}`} disabled={loading || !allValid}>
                            {loading ? (
                                <span className="btn-loading">
                                    <svg className="spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" /></svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-divider"><span>or sign up with</span></div>

                    <button type="button" className="btn-google">
                        <FcGoogle size={20} />
                        Sign up with Google
                    </button>

                    <div className="auth-footer-text">
                        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                    </div>
                </div>
            </div>
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        </div>
    );
};

export default Signup;
