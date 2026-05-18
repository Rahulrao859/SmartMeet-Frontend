import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBolt,
    FaCalendarAlt,
    FaBell,
    FaUsers,
    FaChartBar,
    FaVideo,
    FaCheck,
    FaShieldAlt,
} from 'react-icons/fa';
import LandingNav from '../components/LandingNav';
import './LandingPage.css';

const ChevronDown = () => (
    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const features = [
    { icon: FaBolt, title: 'AI time finder', text: "Automatically detects the best slot across attendees' calendars so teams stop trading availability messages.", bg: '#EAF2FF', color: '#2563EB' },
    { icon: FaCalendarAlt, title: 'Calendar sync', text: 'Connect calendar workflows and keep every scheduled meeting visible in one reliable place.', bg: '#ECFDF5', color: '#059669' },
    { icon: FaBell, title: 'Smart reminders', text: 'Send timely meeting nudges and invitation emails without manually chasing participants.', bg: '#FFF7ED', color: '#EA580C' },
    { icon: FaUsers, title: 'Team scheduling', text: 'Coordinate group meetings with conflict-aware planning and participant tracking built in.', bg: '#F0F9FF', color: '#0284C7' },
    { icon: FaChartBar, title: 'Analytics dashboard', text: 'Monitor meetings, emails, participants, and success rate from a clean operational dashboard.', bg: '#F5F3FF', color: '#7C3AED' },
    { icon: FaVideo, title: 'Video ready', text: 'Prepare meeting details for virtual calls and keep context attached to every scheduled session.', bg: '#FEF2F2', color: '#DC2626' },
];

const faqData = [
    { q: 'Is SmartMeet free to use?', a: 'Yes. The starter workflow is designed for students, small teams, and early product demos.' },
    { q: 'Which calendars does it support?', a: 'SmartMeet is built around calendar-connected scheduling workflows and can be extended for Google Calendar, Outlook, and custom integrations.' },
    { q: 'How does the AI scheduling work?', a: 'The AI reads the meeting request, extracts date and time intent, and helps create structured meeting details with participant emails.' },
    { q: 'Is my calendar data kept private?', a: 'Calendar and account data should be protected at the API and database layers. The interface is designed to make security expectations clear and enterprise-ready.' },
    { q: 'Can teams use it together?', a: 'Yes. The dashboard, activity, calendar, email logs, and settings pages are built around team scheduling workflows.' },
];

const stats = [
    { number: '8 hrs', label: 'Saved weekly per team' },
    { number: '3 min', label: 'Average schedule time' },
    { number: '99%', label: 'Invite visibility' },
];

const pricingFeatures = [
    'AI-assisted meeting requests',
    'Calendar and email workflow tracking',
    'Dashboard analytics and activity history',
    'Professional team-ready interface',
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);
    const [formStatus, setFormStatus] = useState('idle');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('fade-in-visible');
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
                headers: { Accept: 'application/json' },
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

    return (
        <div className="landing-page">
            <LandingNav />

            <section id="hero" className="hero-section">
                <div className="hero-copy">
                    <div className="hero-pill">
                        <span className="hero-pill-dot" />
                        AI meeting operations platform
                    </div>

                    <h1 className="hero-title">
                        SmartMeet for teams that schedule with less friction.
                    </h1>

                    <p className="hero-description">
                        Plan meetings, collect participant emails, sync schedules, and track activity from a calm,
                        professional workspace built for modern teams.
                    </p>

                    <div className="hero-actions">
                        <button onClick={() => navigate('/signup')} className="btn-hero-primary">
                            Start free
                        </button>
                        <button onClick={() => navigate('/login')} className="btn-hero-secondary">
                            Sign in
                        </button>
                    </div>

                    <div className="hero-trust">
                        <span className="hero-trust-dot" />
                        Secure scheduling workflow, email logs, and team activity in one app
                    </div>
                </div>

                <div className="hero-visual" aria-label="SmartMeet dashboard preview">
                    <img src="/hero-meeting.png" alt="Professional meeting workspace" />
                    <div className="hero-preview-panel">
                        <div className="preview-header">
                            <span>AI Scheduler</span>
                            <strong>Ready</strong>
                        </div>
                        <div className="preview-row">
                            <FaCalendarAlt />
                            <span>Product sync meeting</span>
                            <strong>02:00 PM</strong>
                        </div>
                        <div className="preview-row">
                            <FaUsers />
                            <span>5 participants</span>
                            <strong>Confirmed</strong>
                        </div>
                        <div className="preview-row">
                            <FaShieldAlt />
                            <span>Email invites</span>
                            <strong>Tracked</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-bar fade-in-section">
                <div className="stats-bar-inner">
                    {stats.map((s) => (
                        <div key={s.label} className="stat-card">
                            <span className="stat-number">{s.number}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section id="features" className="section fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">Features</span>
                        <h2 className="section-title">Everything you need to meet smarter</h2>
                        <p className="section-description">
                            From AI scheduling to activity tracking, SmartMeet handles meeting logistics so your team can stay focused.
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((f) => (
                            <div key={f.title} className="feature-card">
                                <div className="feature-icon" style={{ backgroundColor: f.bg, color: f.color }}>
                                    <f.icon />
                                </div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-text">{f.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" className="section pricing-section fade-in-section">
                <div className="section-container pricing-layout">
                    <div className="pricing-copy">
                        <span className="section-label">Pricing</span>
                        <h2 className="section-title">Simple enough for a project. Polished enough for a company.</h2>
                        <p className="section-description">
                            SmartMeet starts with one focused workspace for scheduling, calendar activity, and email visibility.
                        </p>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-top">
                            <span>Starter</span>
                            <strong>Free</strong>
                        </div>
                        <p>Everything needed to run the core scheduling workflow.</p>
                        <ul>
                            {pricingFeatures.map(item => (
                                <li key={item}><FaCheck /> {item}</li>
                            ))}
                        </ul>
                        <button onClick={() => navigate('/signup')} className="btn-hero-primary">
                            Create workspace
                        </button>
                    </div>
                </div>
            </section>

            <section id="faq" className="section section-bg-subtle fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">FAQ</span>
                        <h2 className="section-title">Common questions</h2>
                    </div>
                    <div className="faq-list">
                        {faqData.map((item, i) => (
                            <div key={item.q} className={`faq-item ${openFaq === i ? 'faq-item-open' : ''}`}>
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

            <section id="contact" className="section fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">Contact</span>
                        <h2 className="section-title">Get in touch</h2>
                        <p className="section-description">
                            Have a question, partnership idea, or product suggestion? Send the SmartMeet team a note.
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
                                <p className="contact-success">Message sent successfully. We will get back to you soon.</p>
                            )}
                            {formStatus === 'error' && (
                                <p className="contact-error">Something went wrong. Please try again.</p>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-inner">
                    <span className="footer-left">SmartMeet - AI Meeting Scheduler</span>
                    <div className="footer-links">
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
