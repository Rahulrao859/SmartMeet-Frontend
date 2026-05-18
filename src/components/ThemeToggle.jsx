import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            className={`theme-toggle ${className}`}
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? <FaSun /> : <FaMoon />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
    );
};

export default ThemeToggle;
