<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBolt,
    FaCalendar,
    FaClock,
    FaUsers,
    FaUserPlus,
    FaCog,
    FaCheckCircle,
    FaTwitter,
    FaLinkedin,
    FaGithub,
    FaEnvelope,
    FaCalendarAlt,
    FaVideo
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBolt, FaCalendarAlt, FaBell, FaUsers, FaChartBar, FaVideo
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
} from 'react-icons/fa';
import LandingNav from '../components/LandingNav';
import './LandingPage.css';

<<<<<<< HEAD
const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Smooth scroll effect
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

=======
/* ── chevron SVG for FAQ ── */
const ChevronDown = () => (
    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

/* ── data ── */
const features = [
    { icon: FaBolt, title: 'AI time finder', text: 'Automatically detects the best slot across all attendees\u2019 calendars so you never waste time proposing options.', bg: '#EEEDFE', color: '#7F77DD' },
    { icon: FaCalendarAlt, title: 'Calendar sync', text: 'Integrates with Google Calendar, Outlook, and Apple Calendar instantly \u2014 no import/export needed.', bg: '#E1F5EE', color: '#1D9E75' },
    { icon: FaBell, title: 'Smart reminders', text: 'Sends personalized nudges so no one misses a meeting, with escalation rules you can customize.', bg: '#EEEDFE', color: '#7F77DD' },
    { icon: FaUsers, title: 'Team scheduling', text: 'Coordinate group meetings across entire teams with one shared link and automatic conflict resolution.', bg: '#E1F5EE', color: '#1D9E75' },
    { icon: FaChartBar, title: 'Analytics dashboard', text: 'Track meeting frequency, no-shows, and time-saved metrics each week to optimize your schedule.', bg: '#EEEDFE', color: '#7F77DD' },
    { icon: FaVideo, title: 'Video integrations', text: 'Auto-generates Zoom, Meet, or Teams links for every scheduled call \u2014 zero manual steps.', bg: '#E1F5EE', color: '#1D9E75' },
];

const faqData = [
    { q: 'Is SmartMeet free to use?', a: 'Yes \u2014 our free plan lets you schedule up to 10 meetings per month with full calendar sync. Paid plans unlock unlimited scheduling, team features, and priority support.' },
    { q: 'Which calendars does it support?', a: 'SmartMeet integrates natively with Google Calendar, Microsoft Outlook (including Office 365), and Apple Calendar. We also offer a CalDAV connector for any custom calendar.' },
    { q: 'How does the AI scheduling work?', a: 'Our AI analyzes every participant\u2019s calendar, time zone, and meeting preferences to find optimal slots. It factors in buffer times, focus hours, and recurring patterns to suggest the best options.' },
    { q: 'Is my calendar data kept private?', a: 'Absolutely. We use end-to-end encryption for all calendar data in transit and at rest. We never sell or share your data, and you can delete your account and all associated data at any time.' },
    { q: 'Can I embed a booking page on my website?', a: 'Yes, SmartMeet provides an embeddable booking widget you can add to any website with a single line of code. It\u2019s fully customizable to match your brand colors and style.' },
];

const stats = [
    { number: '10x', label: 'Faster scheduling' },
    { number: '98%', label: 'User satisfaction' },
    { number: '50k+', label: 'Meetings booked' },
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);
    const [formStatus, setFormStatus] = useState('idle');

    // Scroll-triggered fade-in animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');

        const formData = new FormData(e.target);

        try {
            const response = await fetch('https://formsubmit.co/ajax/rahulrao1849@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData,
            });

            if (response.ok) {
                setFormStatus('sent');
                e.target.reset();
                setTimeout(() => setFormStatus('idle'), 4000);
            } else {
                setFormStatus('error');
                setTimeout(() => setFormStatus('idle'), 3000);
            }
        } catch {
            setFormStatus('error');
            setTimeout(() => setFormStatus('idle'), 3000);
        }
    };

>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
    return (
        <div className="landing-page">
            <LandingNav />

<<<<<<< HEAD
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content animate-on-scroll">
                        <div className="hero-eyebrow">
                            <FaBolt className="eyebrow-icon" />
                            <span>Automate Your Interview Scheduling</span>
                        </div>

                        <h1 className="hero-title">
                            Smart Interview Scheduling Made{' '}
                            <span className="gradient-text">Effortless</span>
                        </h1>

                        <p className="hero-description">
                            Schedule Google Meet, Zoom, and Microsoft Teams interviews automatically.
                            Save hours of back-and-forth emails and focus on finding the best talent.
                        </p>

                        <div className="hero-actions">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn-primary"
                            >
                                Start Free Trial
                                <span className="btn-arrow">→</span>
                            </button>
                            <button className="btn-secondary">
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    <div className="hero-image animate-on-scroll">
                        <img
                            src="/hero-meeting.png"
                            alt="Modern meeting room"
                            className="hero-img"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <div className="section-header animate-on-scroll">
                        <h2 className="section-title">
                            Everything You Need to <span className="gradient-text">Streamline Interviews</span>
                        </h2>
                        <p className="section-description">
                            Powerful features designed to save time, reduce no-shows, and create exceptional
                            candidate experiences.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card animate-on-scroll">
                            <div className="feature-icon orange">
                                <FaBolt />
                            </div>
                            <h3 className="feature-title">Instant Scheduling</h3>
                            <p className="feature-description">
                                Automatically schedule interviews across multiple platforms in seconds with
                                smart calendar sync.
                            </p>
                        </div>

                        <div className="feature-card animate-on-scroll">
                            <div className="feature-icon blue">
                                <FaCalendar />
                            </div>
                            <h3 className="feature-title">Multi-Platform Integration</h3>
                            <p className="feature-description">
                                Seamlessly integrate with Google Meet, Zoom, and Microsoft Teams - all in one place.
                            </p>
                        </div>

                        <div className="feature-card animate-on-scroll">
                            <div className="feature-icon purple">
                                <FaClock />
                            </div>
                            <h3 className="feature-title">Smart Time Detection</h3>
                            <p className="feature-description">
                                AI-powered timezone detection and optimal time slot suggestions for all participants.
                            </p>
                        </div>

                        <div className="feature-card animate-on-scroll">
                            <div className="feature-icon green">
                                <FaUsers />
                            </div>
                            <h3 className="feature-title">Team Collaboration</h3>
                            <p className="feature-description">
                                Coordinate multiple interviewers, share feedback, and manage hiring pipelines effortlessly.
                            </p>
                        </div>
=======
            {/* ===== HERO ===== */}
            <section id="hero" className="hero-section">
                <div className="hero-pill">
                    <span className="hero-pill-dot" />
                    Now in public beta
                </div>

                <h1 className="hero-title">
                    The smarter way to{' '}
                    <span className="hero-highlight">schedule meetings</span>{' '}
                    without the back-and-forth
                </h1>

                <p className="hero-description">
                    SmartMeet uses AI to find the best meeting times for everyone,
                    sync across calendars, and send smart reminders — so you can
                    focus on what actually matters.
                </p>

                <div className="hero-actions">
                    <button onClick={() => navigate('/signup')} className="btn-hero-primary">
                        Start for free
                    </button>
                    <button className="btn-hero-secondary">
                        See how it works
                    </button>
                </div>

                <div className="hero-trust">
                    <span className="hero-trust-dot" />
                    No credit card required · Setup in under 2 minutes
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section className="stats-bar fade-in-section">
                <div className="stats-bar-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-card">
                            <span className="stat-number">{s.number}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="section fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">Features</span>
                        <h2 className="section-title">Everything you need to meet smarter</h2>
                        <p className="section-description">
                            From AI scheduling to seamless integrations, SmartMeet handles the
                            logistics so your team doesn't have to.
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon" style={{ backgroundColor: f.bg, color: f.color }}>
                                    <f.icon />
                                </div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-text">{f.text}</p>
                            </div>
                        ))}
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="section-container">
                    <div className="section-header animate-on-scroll">
                        <h2 className="section-title">How SmartMeet Works</h2>
                        <p className="section-description">
                            Get started in minutes and schedule your first interview in seconds
                        </p>
                    </div>

                    <div className="steps-grid">
                        <div className="step-card animate-on-scroll">
                            <div className="step-number">01</div>
                            <div className="step-icon">
                                <FaUserPlus />
                            </div>
                            <h3 className="step-title">Add Candidates</h3>
                            <p className="step-description">
                                Import candidates from your ATS or add them manually with their availability preferences.
                            </p>
                        </div>

                        <div className="step-card animate-on-scroll">
                            <div className="step-number">02</div>
                            <div className="step-icon">
                                <FaCog />
                            </div>
                            <h3 className="step-title">Set Preferences</h3>
                            <p className="step-description">
                                Define your interview panel, duration, and preferred meeting platforms.
                            </p>
                        </div>

                        <div className="step-card animate-on-scroll">
                            <div className="step-number">03</div>
                            <div className="step-icon">
                                <FaCalendar />
                            </div>
                            <h3 className="step-title">Auto-Schedule</h3>
                            <p className="step-description">
                                SmartMeet finds the best time slots and automatically creates meetings on your chosen platform.
                            </p>
                        </div>

                        <div className="step-card animate-on-scroll">
                            <div className="step-number">04</div>
                            <div className="step-icon">
                                <FaCheckCircle />
                            </div>
                            <h3 className="step-title">Conduct & Track</h3>
                            <p className="step-description">
                                Everyone gets notifications, reminders, and you can track the entire interview pipeline.
                            </p>
                        </div>
=======
            {/* ===== FAQ ===== */}
            <section id="faq" className="section section-bg-subtle fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">FAQ</span>
                        <h2 className="section-title">Common questions</h2>
                    </div>
                    <div className="faq-list">
                        {faqData.map((item, i) => (
                            <div key={i} className={`faq-item ${openFaq === i ? 'faq-item-open' : ''}`}>
                                <button className="faq-question" onClick={() => toggleFaq(i)}>
                                    {item.q}
                                    <ChevronDown />
                                </button>
                                <div className="faq-answer">
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CONTACT ===== */}
            <section id="contact" className="section fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">Contact</span>
                        <h2 className="section-title">Get in touch</h2>
                        <p className="section-description">
                            Have a question, partnership idea, or just want to say hello? We'd love to
                            hear from you.
                        </p>
                    </div>

                    <div className="contact-form-card">
                        <form onSubmit={handleContactSubmit}>
                            <input type="hidden" name="_subject" value="New message from SmartMeet contact form" />
                            <input type="hidden" name="_captcha" value="false" />
                            <input type="hidden" name="_template" value="table" />

                            <div className="contact-row">
                                <div className="contact-field">
                                    <label htmlFor="contact-name">Name</label>
                                    <input id="contact-name" name="name" type="text" placeholder="Your name" required />
                                </div>
                                <div className="contact-field">
                                    <label htmlFor="contact-email">Email</label>
                                    <input id="contact-email" name="email" type="email" placeholder="Email address" required />
                                </div>
                            </div>
                            <div className="contact-field">
                                <label htmlFor="contact-subject">Subject</label>
                                <input id="contact-subject" name="subject" type="text" placeholder="Subject" required />
                            </div>
                            <div className="contact-field">
                                <label htmlFor="contact-message">Message</label>
                                <textarea id="contact-message" name="message" placeholder="Your message..." required />
                            </div>

                            <button type="submit" className="btn-contact-submit" disabled={formStatus === 'sending'}>
                                {formStatus === 'sending' ? 'Sending...' : formStatus === 'sent' ? 'Sent!' : 'Send message'}
                            </button>

                            {formStatus === 'sent' && (
                                <p className="contact-success">Message sent successfully! We'll get back to you soon.</p>
                            )}
                            {formStatus === 'error' && (
                                <p className="contact-error">Something went wrong. Please try again.</p>
                            )}
                        </form>
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* Integrations Section */}
            <section id="integrations" className="integrations-section">
                <div className="section-container">
                    <div className="section-header animate-on-scroll">
                        <h2 className="section-title">
                            Integrates with Your <span className="gradient-text">Favorite Tools</span>
                        </h2>
                        <p className="section-description">
                            Connect SmartMeet with the tools you already use every day
                        </p>
                    </div>

                    <div className="integrations-grid">
                        <div className="integration-card animate-on-scroll">
                            <div className="integration-icon google">
                                <FaVideo />
                            </div>
                            <h3 className="integration-title">Google Meet</h3>
                            <p className="integration-subtitle">Seamless integration with Google Workspace</p>
                            <ul className="integration-features">
                                <li><FaCheckCircle /> Auto-create meetings</li>
                                <li><FaCheckCircle /> Calendar sync</li>
                                <li><FaCheckCircle /> Gmail notifications</li>
                            </ul>
                        </div>

                        <div className="integration-card animate-on-scroll">
                            <div className="integration-icon microsoft">
                                <FaUsers />
                            </div>
                            <h3 className="integration-title">Microsoft Teams</h3>
                            <p className="integration-subtitle">Native support for Microsoft 365</p>
                            <ul className="integration-features">
                                <li><FaCheckCircle /> Teams meetings</li>
                                <li><FaCheckCircle /> Outlook sync</li>
                                <li><FaCheckCircle /> Azure AD integration</li>
                            </ul>
                        </div>

                        <div className="integration-card animate-on-scroll">
                            <div className="integration-icon zoom">
                                <FaVideo />
                            </div>
                            <h3 className="integration-title">Zoom</h3>
                            <p className="integration-subtitle">Full Zoom meeting capabilities</p>
                            <ul className="integration-features">
                                <li><FaCheckCircle /> Instant meetings</li>
                                <li><FaCheckCircle /> Recording options</li>
                                <li><FaCheckCircle /> Waiting rooms</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="trust-section">
                <div className="section-container">
                    <p className="trust-text">Trusted by leading companies worldwide</p>
                    <div className="trust-logos">
                        <span className="trust-logo">TechCorp</span>
                        <span className="trust-logo">InnovateLabs</span>
                        <span className="trust-logo">FutureWorks</span>
                        <span className="trust-logo">DataStream</span>
                        <span className="trust-logo">CloudNine</span>
                        <span className="trust-logo">NextGen</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <FaCalendarAlt className="logo-icon" />
                                <span className="logo-text">SmartMeet</span>
                            </div>
                            <p className="footer-description">
                                Automate your interview scheduling with AI-powered smart scheduling for
                                Google Meet, Zoom, and Microsoft Teams.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-icon"><FaTwitter /></a>
                                <a href="#" className="social-icon"><FaLinkedin /></a>
                                <a href="#" className="social-icon"><FaGithub /></a>
                                <a href="#" className="social-icon"><FaEnvelope /></a>
                            </div>
                        </div>

                        <div className="footer-links">
                            <div className="footer-column">
                                <h4 className="footer-heading">Product</h4>
                                <a href="#features" className="footer-link">Features</a>
                                <a href="#integrations" className="footer-link">Integrations</a>
                                <a href="#pricing" className="footer-link">Pricing</a>
                                <a href="#" className="footer-link">API</a>
                                <a href="#" className="footer-link">Changelog</a>
                            </div>

                            <div className="footer-column">
                                <h4 className="footer-heading">Company</h4>
                                <a href="#" className="footer-link">About</a>
                                <a href="#" className="footer-link">Blog</a>
                                <a href="#" className="footer-link">Careers</a>
                                <a href="#" className="footer-link">Press</a>
                                <a href="#" className="footer-link">Contact</a>
                            </div>

                            <div className="footer-column">
                                <h4 className="footer-heading">Resources</h4>
                                <a href="#" className="footer-link">Documentation</a>
                                <a href="#" className="footer-link">Help Center</a>
                                <a href="#" className="footer-link">Community</a>
                                <a href="#" className="footer-link">Templates</a>
                                <a href="#" className="footer-link">Status</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="footer-copyright">© 2025 SmartMeet. All rights reserved.</p>
                        <div className="footer-legal">
                            <a href="#" className="footer-legal-link">Privacy Policy</a>
                            <a href="#" className="footer-legal-link">Terms of Service</a>
                            <a href="#" className="footer-legal-link">Cookie Policy</a>
                        </div>
=======
            {/* ===== FOOTER ===== */}
            <footer className="footer">
                <div className="footer-inner">
                    <span className="footer-left">SmartMeet · Built with care</span>
                    <div className="footer-links">
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">Twitter</a>
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
