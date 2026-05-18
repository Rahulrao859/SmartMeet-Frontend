import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

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
                    <img src="/smartmeet-logo.svg" alt="" className="nav-logo-icon" />
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
                    <ThemeToggle />
                    <button onClick={() => navigate('/login')} className="btn-nav-login">
                        Log in
                    </button>
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
                        <ThemeToggle />
                        <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="btn-nav-login">
                            Log in
                        </button>
                        <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="btn-nav-cta">
                            Get started free
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default LandingNav;
