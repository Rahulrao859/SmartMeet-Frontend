import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
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
                    <FaCalendarAlt className="logo-icon" />
                    <span>SmartMeet</span>
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
                    <button onClick={() => navigate('/login')} className="btn-secondary">
                        Sign In
                    </button>
                    <button onClick={() => navigate('/signup')} className="btn-primary">
                        Get Started
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
                        <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="btn-secondary">
                            Sign In
                        </button>
                        <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="btn-primary">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default LandingNav;
