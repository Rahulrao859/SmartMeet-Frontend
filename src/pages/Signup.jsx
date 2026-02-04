import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCalendarAlt, FaUser, FaBuilding, FaArrowRight, FaCheck } from 'react-icons/fa';
import { api, handleApiError } from '../services/api';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        password: '',
        agreeToTerms: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.agreeToTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        setLoading(true);

        try {
            const fullName = `${formData.firstName} ${formData.lastName}`;
            const response = await api.signup(fullName, formData.email, formData.password);

            // Store token and user data
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
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

                            {error && (
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#fee',
                                    border: '1px solid #f88',
                                    borderRadius: '8px',
                                    color: '#c33',
                                    marginBottom: '1rem',
                                    fontSize: '14px'
                                }}>
                                    {error}
                                </div>
                            )}

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
                                            minLength="6"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <p className="password-hint">Must be at least 6 characters long</p>
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

                                <button type="submit" className="auth-submit-button" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
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
        </div>
    );
};

export default Signup;
