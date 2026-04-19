import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBolt, FaCalendar, FaClock, FaUsers, FaCheckCircle, FaVideo,
    FaCalendarAlt, FaTwitter, FaLinkedin, FaGithub, FaEnvelope,
    FaRobot, FaArrowUp, FaLock, FaBullseye, FaStar, FaCheck
} from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';
import LandingNav from '../components/LandingNav';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

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
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className="landing-page">
            <LandingNav />

            {/* ===== HERO ===== */}
            <section id="hero" className="hero-section">
                <div className="hero-eyebrow">
                    <FaBolt />
                    Simpler, Faster Scheduling
                </div>
                <h1 className="hero-title">
                    Smart Meeting Scheduling Made <span className="gradient-text">Effortless</span>
                </h1>
                <p className="hero-description">
                    Schedule Google Meet, Zoom, and Microsoft Teams meetings automatically.
                    Save hours of back-and-forth emails and focus on what matters.
                </p>
                <div className="hero-actions-group">
                    <button onClick={() => navigate('/signup')} className="btn-hero-primary">
                        Start Free Trial
                        <MdArrowForward />
                    </button>
                    <button className="btn-hero-secondary">
                        Watch Demo
                    </button>
                </div>

                <div className="trust-logos">
                    <span className="trust-logo">TechCorp</span>
                    <span className="trust-logo">InnovateLabs</span>
                    <span className="trust-logo">FutureWorks</span>
                    <span className="trust-logo">DataStream</span>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="section section-bg-muted fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">FEATURES</span>
                        <h2 className="section-title">Everything you need to schedule smarter</h2>
                        <p className="section-description">
                            Powerful features designed to save time, reduce no-shows, and create exceptional experiences.
                        </p>
                    </div>
                    <div className="grid-3">
                        {[
                            { icon: FaBolt, title: 'Instant Scheduling', text: 'Automatically schedule meetings across multiple platforms in seconds with smart calendar sync.', color: '#6C63FF', bg: '#F0EEFF' },
                            { icon: FaClock, title: 'Smart Time Detection', text: 'AI-powered timezone detection and optimal time slot suggestions for all participants.', color: '#3B82F6', bg: '#EFF6FF' },
                            { icon: FaUsers, title: 'Team Collaboration', text: 'Coordinate multiple team members, share feedback, and manage workflows effortlessly.', color: '#10B981', bg: '#F0FDF4' },
                        ].map((f, i) => (
                            <div key={i} className="feature-card">
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

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="section fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">HOW IT WORKS</span>
                        <h2 className="section-title">Get started in minutes</h2>
                        <p className="section-description">
                            Schedule your first meeting in seconds with just 4 simple steps.
                        </p>
                    </div>
                    <div className="steps-grid">
                        {[
                            { num: '01', title: 'Add Participants', text: 'Import contacts or add them manually with availability preferences.' },
                            { num: '02', title: 'Set Preferences', text: 'Define your meeting panel, duration, and preferred platforms.' },
                            { num: '03', title: 'Auto-Schedule', text: 'AI finds the best time slots and creates meetings instantly.' },
                            { num: '04', title: 'Conduct & Track', text: 'Get notifications, reminders, and tracking all in one place.' },
                        ].map((s, i) => (
                            <div key={i} className="step-card">
                                <span className="step-num">{s.num}</span>
                                <h3 className="step-title">{s.title}</h3>
                                <p className="step-text">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== INTEGRATIONS ===== */}
            <section id="integrations" className="section section-bg-muted fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">INTEGRATIONS</span>
                        <h2 className="section-title">Integrates with your tools</h2>
                        <p className="section-description">
                            Connect SmartMeet with the tools you already use every day.
                        </p>
                    </div>
                    <div className="grid-3">
                        {[
                            { icon: FaVideo, title: 'Google Meet', text: 'Seamless integration with Google Workspace. Auto-create meetings and sync calendars.', color: '#34A853', bg: '#E6F4EA' },
                            { icon: FaUsers, title: 'Microsoft Teams', text: 'Native support for Microsoft 365, Teams meetings, and Outlook calendar sync.', color: '#4F46E5', bg: '#EEF2FF' },
                            { icon: FaVideo, title: 'Zoom', text: 'Full Zoom meeting capabilities with instant link generation and waiting rooms.', color: '#0EA5E9', bg: '#E0F2FE' },
                        ].map((item, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon" style={{ backgroundColor: item.bg, color: item.color }}>
                                    <item.icon />
                                </div>
                                <h3 className="feature-title">{item.title}</h3>
                                <p className="feature-text">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="pricing" className="section fade-in-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-label">PRICING</span>
                        <h2 className="section-title">Simple, transparent pricing</h2>
                        <p className="section-description">
                            Start free. Upgrade when you need more power.
                        </p>
                    </div>

                    <div className="pricing-grid">
                        {/* Free */}
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Starter</h3>
                                <div className="pricing-amount"><span className="price">$0</span><span className="per">/month</span></div>
                                <p className="pricing-desc">For individuals getting started</p>
                            </div>
                            <ul className="pricing-features">
                                <li><FaCheck className="pricing-check" /> 5 meetings/month</li>
                                <li><FaCheck className="pricing-check" /> Google Calendar sync</li>
                                <li><FaCheck className="pricing-check" /> Email notifications</li>
                                <li><FaCheck className="pricing-check" /> Basic support</li>
                            </ul>
                            <button onClick={() => navigate('/signup')} className="btn-pricing-outline">Get Started</button>
                        </div>

                        {/* Pro */}
                        <div className="pricing-card pricing-card-popular">
                            <div className="pricing-badge">Most Popular</div>
                            <div className="pricing-header">
                                <h3>Professional</h3>
                                <div className="pricing-amount"><span className="price">$19</span><span className="per">/month</span></div>
                                <p className="pricing-desc">For growing teams</p>
                            </div>
                            <ul className="pricing-features">
                                <li><FaCheck className="pricing-check" /> Unlimited meetings</li>
                                <li><FaCheck className="pricing-check" /> All calendar integrations</li>
                                <li><FaCheck className="pricing-check" /> AI scheduling assistant</li>
                                <li><FaCheck className="pricing-check" /> Priority support</li>
                                <li><FaCheck className="pricing-check" /> Team collaboration</li>
                            </ul>
                            <button onClick={() => navigate('/signup')} className="btn-pricing-solid">Start Free Trial</button>
                        </div>

                        {/* Enterprise */}
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Enterprise</h3>
                                <div className="pricing-amount"><span className="price">$49</span><span className="per">/month</span></div>
                                <p className="pricing-desc">For large organizations</p>
                            </div>
                            <ul className="pricing-features">
                                <li><FaCheck className="pricing-check" /> Everything in Pro</li>
                                <li><FaCheck className="pricing-check" /> SSO & SAML</li>
                                <li><FaCheck className="pricing-check" /> Custom integrations</li>
                                <li><FaCheck className="pricing-check" /> Dedicated account manager</li>
                                <li><FaCheck className="pricing-check" /> SLA guarantee</li>
                            </ul>
                            <button className="btn-pricing-outline">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== ABOUT ===== */}
            <section id="about" className="fade-in-section">

                {/* Part 1 — Mission */}
                <div className="about-mission">
                    <div className="about-mission-inner">
                        <span className="section-label">ABOUT US</span>
                        <h2 className="about-heading">We're on a mission to eliminate scheduling chaos</h2>
                        <div className="about-heading-accent" />
                        <p className="about-body">
                            SmartMeet was built because we believe nobody should waste hours coordinating meeting times. Our AI-powered platform handles the back-and-forth so teams can focus on what actually matters.
                        </p>
                        <p className="about-body">
                            From startups to Fortune 500 companies, over 12,000 teams trust SmartMeet to make their scheduling effortless, intelligent, and reliable.
                        </p>
                    </div>
                </div>

                {/* Part 2 — Stats Row */}
                <div className="about-stats fade-in-section">
                    {[
                        { number: '12,000+', label: 'Teams' },
                        { number: '2.4M', label: 'Meetings Scheduled' },
                        { number: '98%', label: 'Customer Satisfaction' },
                        { number: '40+', label: 'Countries' },
                    ].map((stat, i) => (
                        <div key={i} className="about-stat-item">
                            <span className="about-stat-number">{stat.number}</span>
                            <span className="about-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Part 3 — Our Story */}
                <div className="about-story section-container fade-in-section">
                    <div className="about-story-grid">
                        <div className="about-story-image">
                            <div className="about-story-placeholder">
                                <FaRobot size={64} />
                                <FaCalendarAlt size={48} style={{ marginLeft: '-16px', opacity: 0.7 }} />
                            </div>
                        </div>
                        <div className="about-story-content">
                            <span className="section-label">OUR STORY</span>
                            <h3 className="about-story-heading">Built by a team tired of missed meetings</h3>
                            <p className="about-body">
                                It started with a simple frustration: scheduling a single meeting with five people shouldn't take 14 emails and three days. As engineers and product professionals, we knew there had to be a better way.
                            </p>
                            <p className="about-body">
                                In 2024, we launched SmartMeet — an AI-first scheduling platform that understands natural language, respects timezones, and integrates with every calendar. What began as an internal tool quickly became a product used by thousands of teams worldwide.
                            </p>
                            <a href="#team" className="about-link" onClick={(e) => { e.preventDefault(); document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                Meet the team <MdArrowForward />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Part 4 — Core Values */}
                <div className="about-values-section section-bg-muted fade-in-section">
                    <div className="section-container">
                        <div className="section-header">
                            <h2 className="section-title">What we stand for</h2>
                        </div>
                        <div className="grid-3">
                            {[
                                { emoji: '🎯', title: 'Customer First', text: "Every decision starts with our users' needs. We build what matters most.", color: '#6C63FF', bg: '#F0EEFF' },
                                { emoji: '🔒', title: 'Privacy by Design', text: 'Your data is yours. Always encrypted, never sold. Security is not optional.', color: '#10B981', bg: '#F0FDF4' },
                                { emoji: '⚡', title: 'Speed & Simplicity', text: 'Powerful features that just work, without the learning curve or bloat.', color: '#F59E0B', bg: '#FFFBEB' },
                            ].map((v, i) => (
                                <div key={i} className="value-card">
                                    <div className="value-icon" style={{ backgroundColor: v.bg, color: v.color }}>
                                        {v.emoji}
                                    </div>
                                    <h3 className="value-title">{v.title}</h3>
                                    <p className="value-text">{v.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Part 5 — Team */}
                <div id="team" className="about-team-section fade-in-section">
                    <div className="section-container">
                        <div className="section-header">
                            <h2 className="section-title">Meet the team</h2>
                            <p className="section-description">The people behind SmartMeet</p>
                        </div>
                        <div className="team-grid">
                            {[
                                { name: 'Rahul Rao', role: 'Founder & CEO', initials: 'RR', color: '#6C63FF' },
                                { name: 'Sarah Chen', role: 'CTO', initials: 'SC', color: '#3B82F6' },
                                { name: 'Marcus Webb', role: 'Head of Product', initials: 'MW', color: '#10B981' },
                                { name: 'Priya Patel', role: 'Lead Engineer', initials: 'PP', color: '#F97316' },
                            ].map((member, i) => (
                                <div key={i} className="team-card">
                                    <div className="team-avatar" style={{ backgroundColor: member.color }}>
                                        {member.initials}
                                    </div>
                                    <h4 className="team-name">{member.name}</h4>
                                    <p className="team-role">{member.role}</p>
                                    <a href="#" className="team-social" target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Part 6 — Press / Recognition */}
                <div className="about-press fade-in-section">
                    <p className="press-label">As featured in</p>
                    <div className="press-logos">
                        <span className="press-logo">TechCrunch</span>
                        <span className="press-logo">Product Hunt</span>
                        <span className="press-logo">Forbes</span>
                        <span className="press-logo">Y Combinator</span>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <a href="/" className="logo-text" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                                <FaCalendarAlt className="logo-icon" />
                                SmartMeet
                            </a>
                            <p className="footer-desc">
                                Automate your meeting scheduling with AI-powered smart scheduling for Google Meet, Zoom, and Teams.
                            </p>
                            <div className="footer-socials">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaTwitter /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaLinkedin /></a>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaGithub /></a>
                            </div>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-col-title">Product</h4>
                            <ul className="footer-links-list">
                                <li><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a></li>
                                <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How It Works</a></li>
                                <li><a href="#integrations" onClick={(e) => { e.preventDefault(); document.getElementById('integrations')?.scrollIntoView({ behavior: 'smooth' }); }}>Integrations</a></li>
                                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>Pricing</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-col-title">Company</h4>
                            <ul className="footer-links-list">
                                <li><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a></li>
                                <li><a href="/blog">Blog</a></li>
                                <li><a href="/careers">Careers</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-col-title">Legal</h4>
                            <ul className="footer-links-list">
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2026 SmartMeet. All rights reserved.</p>
                        <button className="back-to-top" onClick={scrollToTop}>
                            Back to top <FaArrowUp />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
