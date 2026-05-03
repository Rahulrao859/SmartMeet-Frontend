<<<<<<< HEAD
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

const LandingNav = () => {
    const navigate = useNavigate();

    return (
        <nav className="landing-nav">
            <div className="nav-container">
                <div className="nav-content">
                    {/* Logo */}
                    <div className="nav-logo">
                        <FaCalendarAlt className="logo-icon" />
                        <span className="logo-text">SmartMeet</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="nav-links">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How It Works</a>
                        <a href="#integrations" className="nav-link">Integrations</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                    </div>

                    {/* Action Buttons */}
                    <div className="nav-actions">
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-sign-in"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn-get-started"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
];

const LandingNav = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Scroll shadow effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Intersection Observer for active section highlighting
    useEffect(() => {
        const sectionIds = navLinks.map(l => l.href.replace('#', ''));
        const observers = [];

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMobileMenuOpen(false);
    };

    // Close drawer on outside click
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const handleClick = (e) => {
            if (!e.target.closest('.mobile-nav-overlay') && !e.target.closest('.mobile-menu-btn')) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [isMobileMenuOpen]);

    return (
        <nav className={`landing-nav ${scrolled ? 'nav-scrolled' : ''}`}>
            <div className="nav-container">
                <a href="/" className="nav-logo" onClick={scrollToTop}>
                    <svg className="nav-logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="16" height="16" rx="3" stroke="#7F77DD" strokeWidth="1.8"/>
                        <path d="M2 9h16" stroke="#7F77DD" strokeWidth="1.8"/>
                        <circle cx="18" cy="17" r="5" fill="#1D9E75"/>
                        <path d="M18 15v2.5l1.5 1" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 4V2M13 4V2" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    <span className="nav-logo-accent">Smart</span>Meet
                </a>

                <div className="nav-links">
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${activeSection === link.href.replace('#', '') ? 'nav-link-active' : ''}`}
                            onClick={(e) => handleNavClick(e, link.href)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="nav-actions">
                    <button onClick={() => navigate('/signup')} className="btn-nav-cta">
                        Get started free
                    </button>
                </div>

                <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-nav-overlay">
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${activeSection === link.href.replace('#', '') ? 'nav-link-active' : ''}`}
                            onClick={(e) => handleNavClick(e, link.href)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="nav-actions">
                        <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="btn-nav-cta">
                            Get started free
                        </button>
                    </div>
                </div>
            )}
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        </nav>
    );
};

export default LandingNav;
