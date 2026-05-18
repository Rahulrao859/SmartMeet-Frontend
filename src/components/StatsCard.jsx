import React, { useState, useEffect } from 'react';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';

const StatsCard = ({ icon: Icon, title, value, change, positive, gradient, accentColor }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const numericTarget = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
        const suffix = value.toString().replace(/[0-9.]/g, '');

        if (isNaN(numericTarget)) {
            setDisplayValue(value);
            return;
        }

        let current = 0;
        const duration = 1500;
        const steps = 60;
        const increment = numericTarget / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericTarget) {
                setDisplayValue(numericTarget + suffix);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current) + suffix);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="stat-card">
            <div style={{ borderBottom: `3px solid ${accentColor || '#2563EB'}`, position: 'absolute', bottom: 0, left: '20px', right: '20px', borderRadius: '0 0 2px 2px' }} />
            <div className="stat-card-top">
                <div className="stat-icon-box" style={{ background: gradient || 'linear-gradient(135deg, #2563EB, #60A5FA)' }}>
                    <Icon />
                </div>
                <div className="stat-badge-green">
                    {positive ? <TiArrowSortedUp size={14} /> : <TiArrowSortedDown size={14} />}
                    <span>{change}</span>
                </div>
            </div>
            <div className="stat-number">{displayValue}</div>
            <div className="stat-label">{title}</div>
        </div>
    );
};

export default StatsCard;
