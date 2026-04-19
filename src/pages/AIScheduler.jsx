import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaCalendarAlt, FaClock, FaUsers, FaEnvelope, FaRobot } from 'react-icons/fa';
import { api, handleApiError } from '../services/api';

const AIScheduler = () => {
    const [message, setMessage] = useState('');
    const [emails, setEmails] = useState('');
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            text: 'Hello! I\'m your AI meeting scheduler. Tell me about the meeting you\'d like to schedule, and provide the participant emails.',
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
                time: `${meeting.time} (${meeting.duration})`,
                participants: Array.isArray(meeting.participants) ? meeting.participants.length : 0,
                status: meeting.status,
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

        const userMessage = {
            type: 'user',
            text: `${message}\n📧 Emails: ${emails}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await api.scheduleMeeting(message, emails);
            const aiResponse = {
                type: 'ai',
                text: `✅ Meeting "${response.meeting.title}" has been scheduled!\n\n` +
                    `📅 Date: ${response.meeting.date}\n` +
                    `🕐 Time: ${response.meeting.time}\n` +
                    `⏱️ Duration: ${response.meeting.duration}\n` +
                    `💻 Platform: ${response.meeting.platform}\n\n` +
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
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)' }}>AI Assistant</h3>
                            <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)' }}>Ask me to schedule a meeting. You can use phrases like "tomorrow at 2 PM".</p>
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
                            <FaEnvelope style={{ color: '#9CA3AF' }} />
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
