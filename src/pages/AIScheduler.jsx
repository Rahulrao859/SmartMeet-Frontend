import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaPaperPlane, FaCalendarAlt, FaClock, FaUsers, FaEnvelope, FaRobot, FaGlobeAmericas, FaChevronDown, FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import { api, handleApiError } from '../services/api';

/* ─── Timezone Utilities ────────────────────────────────────── */
const TIMEZONE_LIST = Intl.supportedValuesOf
    ? Intl.supportedValuesOf('timeZone')
    : [
        'UTC',
        'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
        'America/Toronto', 'America/Vancouver', 'America/Sao_Paulo', 'America/Argentina/Buenos_Aires',
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow', 'Europe/Istanbul',
        'Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Singapore',
        'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland', 'Pacific/Honolulu',
        'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos',
      ];

const getUtcOffset = (tz) => {
    try {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'shortOffset',
        }).formatToParts(now);
        const offsetPart = parts.find(p => p.type === 'timeZoneName');
        return offsetPart ? offsetPart.value : '';
    } catch {
        return '';
    }
};

const getLocalTimezone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return 'UTC';
    }
};

const formatTimeInTimezone = (dateStr, timeStr, tz) => {
    try {
        const dateTime = new Date(`${dateStr}T${timeStr}`);
        if (isNaN(dateTime.getTime())) return timeStr;
        return dateTime.toLocaleTimeString('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return timeStr;
    }
};

const groupTimezonesByRegion = (tzList) => {
    const groups = {};
    tzList.forEach(tz => {
        const parts = tz.split('/');
        const region = parts.length > 1 ? parts[0] : 'Other';
        if (!groups[region]) groups[region] = [];
        groups[region].push(tz);
    });
    // Sort regions and zones within each
    const sortedRegions = Object.keys(groups).sort();
    const result = {};
    sortedRegions.forEach(region => {
        result[region] = groups[region].sort();
    });
    return result;
};

/* ─── Timezone Picker Component ─────────────────────────────── */
const TimezonePicker = ({ value, onChange, disabled }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const grouped = useMemo(() => groupTimezonesByRegion(TIMEZONE_LIST), []);
    const offset = useMemo(() => getUtcOffset(value), [value]);

    const filteredGroups = useMemo(() => {
        if (!search.trim()) return grouped;
        const q = search.toLowerCase();
        const result = {};
        Object.entries(grouped).forEach(([region, zones]) => {
            const filtered = zones.filter(tz =>
                tz.toLowerCase().includes(q) ||
                region.toLowerCase().includes(q) ||
                getUtcOffset(tz).toLowerCase().includes(q)
            );
            if (filtered.length) result[region] = filtered;
        });
        return result;
    }, [search, grouped]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open && searchRef.current) searchRef.current.focus();
    }, [open]);

    const displayName = value.replace(/_/g, ' ').split('/').pop();

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(prev => !prev)}
                id="timezone-picker-btn"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--card-border)',
                    backgroundColor: open ? '#F0EEFF' : 'var(--card-bg)',
                    color: 'var(--text-dark)',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Inter', sans-serif",
                    whiteSpace: 'nowrap',
                    opacity: disabled ? 0.5 : 1,
                    outline: 'none',
                    boxShadow: open ? '0 0 0 3px rgba(108, 99, 255, 0.1)' : 'none',
                }}
            >
                <FaGlobeAmericas style={{ color: '#6C63FF', fontSize: '14px', flexShrink: 0 }} />
                <span>{displayName}</span>
                <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{offset}</span>
                <FaChevronDown style={{ fontSize: '10px', color: '#9CA3AF', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0',
                        marginBottom: '8px',
                        width: '320px',
                        maxHeight: '360px',
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '14px',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'tzDropdownIn 0.2s ease',
                    }}
                >
                    {/* Search */}
                    <div style={{ padding: '12px', borderBottom: '1px solid var(--card-border)', position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '12px' }} />
                        <input
                            ref={searchRef}
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search timezone..."
                            style={{
                                width: '100%',
                                padding: '8px 32px 8px 32px',
                                border: '1px solid var(--card-border)',
                                borderRadius: '8px',
                                fontSize: '13px',
                                outline: 'none',
                                fontFamily: "'Inter', sans-serif",
                                color: 'var(--text-dark)',
                                backgroundColor: '#FAFBFC',
                                boxSizing: 'border-box',
                            }}
                        />
                        {search && (
                            <FaTimes
                                onClick={() => setSearch('')}
                                style={{ position: 'absolute', right: '22px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '11px', cursor: 'pointer' }}
                            />
                        )}
                    </div>
                    {/* List */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {Object.keys(filteredGroups).length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>No timezones found</div>
                        ) : (
                            Object.entries(filteredGroups).map(([region, zones]) => (
                                <div key={region}>
                                    <div style={{
                                        padding: '8px 16px',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        color: '#9CA3AF',
                                        backgroundColor: '#FAFBFC',
                                        borderBottom: '1px solid var(--card-border)',
                                        position: 'sticky',
                                        top: 0,
                                    }}>
                                        {region}
                                    </div>
                                    {zones.map(tz => {
                                        const isSelected = tz === value;
                                        const label = tz.split('/').slice(1).join('/').replace(/_/g, ' ');
                                        const tzOffset = getUtcOffset(tz);
                                        return (
                                            <button
                                                key={tz}
                                                type="button"
                                                onClick={() => { onChange(tz); setOpen(false); setSearch(''); }}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 16px',
                                                    border: 'none',
                                                    backgroundColor: isSelected ? '#F0EEFF' : 'transparent',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    fontFamily: "'Inter', sans-serif",
                                                    color: isSelected ? '#6C63FF' : 'var(--text-dark)',
                                                    fontWeight: isSelected ? '600' : '400',
                                                    transition: 'background-color 0.15s ease',
                                                    textAlign: 'left',
                                                }}
                                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F4F6FB'; }}
                                                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
                                                    {label || tz}
                                                </span>
                                                <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>{tzOffset}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                    {/* Current selection footer */}
                    <div style={{
                        padding: '10px 16px',
                        borderTop: '1px solid var(--card-border)',
                        backgroundColor: '#FAFBFC',
                        fontSize: '11px',
                        color: '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}>
                        <FaGlobeAmericas style={{ fontSize: '10px' }} />
                        Selected: <strong style={{ color: 'var(--text-dark)' }}>{value.replace(/_/g, ' ')}</strong>
                    </div>
                </div>
            )}

            {/* Dropdown animation keyframes */}
            <style>{`
                @keyframes tzDropdownIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

/* ─── Main AIScheduler Component ────────────────────────────── */
const AIScheduler = () => {
    const [message, setMessage] = useState('');
    const [emails, setEmails] = useState('');
    const [selectedTimezone, setSelectedTimezone] = useState(getLocalTimezone());
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            text: 'Hello! I\'m your AI meeting scheduler. Tell me about the meeting you\'d like to schedule, provide the participant emails, and select your timezone for accurate scheduling across regions. 🌍',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [scheduledMeetings, setScheduledMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const data = await api.getMeetings();
            const formattedMeetings = data.meetings.map(meeting => ({
                id: meeting.id,
                title: meeting.title,
                date: formatDate(meeting.date),
                rawDate: meeting.date,
                rawTime: meeting.time,
                time: `${meeting.time} (${meeting.duration})`,
                participants: Array.isArray(meeting.participants) ? meeting.participants.length : 0,
                status: meeting.status,
                timezone: meeting.timezone || null,
            }));
            setScheduledMeetings(formattedMeetings);
        } catch (err) {
            console.error('Error loading meetings:', err);
        }
    };

    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            setError('Please enter a meeting request');
            return;
        }

        if (!emails.trim()) {
            setError('Please enter at least one email address');
            return;
        }

        setError(null);
        setLoading(true);

        const tzLabel = selectedTimezone.replace(/_/g, ' ');
        const tzOffset = getUtcOffset(selectedTimezone);

        const userMessage = {
            type: 'user',
            text: `${message}\n📧 Emails: ${emails}\n🌍 Timezone: ${tzLabel} (${tzOffset})`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const queryWithTz = `${message} [Timezone: ${selectedTimezone}, ${tzOffset}]`;
            const response = await api.scheduleMeeting(queryWithTz, emails);
            const aiResponse = {
                type: 'ai',
                text: `✅ Meeting "${response.meeting.title}" has been scheduled!\n\n` +
                    `📅 Date: ${response.meeting.date}\n` +
                    `🕐 Time: ${response.meeting.time}\n` +
                    `⏱️ Duration: ${response.meeting.duration}\n` +
                    `💻 Platform: ${response.meeting.platform}\n` +
                    `🌍 Timezone: ${tzLabel} (${tzOffset})\n\n` +
                    `📧 Emails sent: ${response.successful_emails}/${response.total_emails}\n\n` +
                    response.email_results.map(result =>
                        `${result.status === 'Sent' ? '✅' : '❌'} ${result.email}`
                    ).join('\n'),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiResponse]);
            await loadMeetings();
            setMessage('');
            setEmails('');
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            const aiErrorResponse = {
                type: 'ai',
                text: `❌ Error: ${errorMessage}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiErrorResponse]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>AI Scheduler</h1>
                <p>Schedule meetings effortlessly with AI assistance</p>
            </div>

            {error && (
                <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', marginBottom: '24px', fontSize: '14px' }}>
                    ⚠️ {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                
                {/* Chat Interface (Left - Wider) */}
                <div className="card-clean" style={{ gridColumn: '1 / span 2', display: 'flex', flexDirection: 'column', height: '700px', padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(108, 99, 255, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C63FF' }}>
                            <FaRobot size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)' }}>AI Assistant</h3>
                            <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)' }}>Ask me to schedule a meeting. You can use phrases like "tomorrow at 2 PM".</p>
                        </div>
                        {/* Timezone indicator badge in header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(108, 99, 255, 0.06)',
                                border: '1px solid rgba(108, 99, 255, 0.1)',
                                fontSize: '12px',
                                color: '#6C63FF',
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                            }}
                            title={`Current timezone: ${selectedTimezone}`}
                        >
                            <FaGlobeAmericas style={{ fontSize: '11px' }} />
                            {getUtcOffset(selectedTimezone)}
                        </div>
                    </div>

                    <div style={{ flex: '1', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div>
                                    <div className={msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ whiteSpace: 'pre-line' }}>
                                        {msg.text}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div className="chat-bubble-ai">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing request...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '20px', borderTop: '1px solid var(--card-border)', backgroundColor: '#FAFBFC' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <FaEnvelope style={{ color: '#9CA3AF', flexShrink: 0 }} />
                            <input
                                type="text"
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                                placeholder="Participant emails (comma-separated)"
                                className="input-field"
                                style={{ height: '40px' }}
                                disabled={loading}
                            />
                        </div>
                        {/* Timezone selector row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <TimezonePicker
                                value={selectedTimezone}
                                onChange={setSelectedTimezone}
                                disabled={loading}
                            />
                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                {new Date().toLocaleTimeString('en-US', { timeZone: selectedTimezone, hour: '2-digit', minute: '2-digit', hour12: true })} local time
                            </span>
                        </div>
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your meeting request here..."
                                className="input-field"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Scheduled Meetings (Right) */}
                <div className="card-clean" style={{ gridColumn: '3 / span 1', height: '700px', padding: '0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(108, 99, 255, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C63FF' }}>
                            <FaCalendarAlt size={18} />
                        </div>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)' }}>Scheduled Meetings</h3>
                    </div>

                    <div style={{ flex: '1', overflowY: 'auto', padding: '24px' }}>
                        {scheduledMeetings.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                                <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: '#F4F6FB', marginBottom: '16px' }}>
                                    <FaCalendarAlt size={32} style={{ color: '#D1D5DB' }} />
                                </div>
                                <p style={{ fontSize: '14px' }}>No meetings scheduled yet</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {scheduledMeetings.map((meeting) => (
                                    <div
                                        key={meeting.id}
                                        style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', backgroundColor: '#FAFBFC' }}
                                    >
                                        <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: 'var(--text-dark)' }}>{meeting.title}</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaCalendarAlt style={{ color: '#3b82f6' }} />
                                                {meeting.date}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaClock style={{ color: '#6C63FF' }} />
                                                {meeting.time}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaUsers style={{ color: '#10B981' }} />
                                                {meeting.participants} participants
                                            </div>
                                            {/* Timezone info row */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaGlobeAmericas style={{ color: '#F59E0B' }} />
                                                <span>
                                                    {meeting.timezone
                                                        ? meeting.timezone.replace(/_/g, ' ')
                                                        : selectedTimezone.replace(/_/g, ' ')
                                                    }
                                                </span>
                                            </div>
                                            {/* Show converted time in user's local timezone if different */}
                                            {meeting.timezone && meeting.timezone !== selectedTimezone && meeting.rawDate && meeting.rawTime && (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        marginTop: '4px',
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                                                        border: '1px solid rgba(245, 158, 11, 0.15)',
                                                        fontSize: '12px',
                                                        color: '#B45309',
                                                    }}
                                                >
                                                    <FaClock style={{ fontSize: '10px' }} />
                                                    Your time ({selectedTimezone.split('/').pop().replace(/_/g, ' ')}): {formatTimeInTimezone(meeting.rawDate, meeting.rawTime, selectedTimezone)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIScheduler;
