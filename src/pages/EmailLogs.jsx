import React, { useState, useEffect } from 'react';
import { MdEmail, MdSearch, MdFilterList, MdOutlineVisibility } from 'react-icons/md';
import { api } from '../services/api';

const EmailLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadEmailLogs();
    }, []);

    const loadEmailLogs = async () => {
        try {
            setLoading(true);
            const data = await api.getEmailLogs();
            setLogs(data?.logs || []);
        } catch (error) {
            console.error('Error loading email logs:', error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusPill = (status) => {
        switch (status) {
            case 'Sent': return <span className="pill-success">Sent</span>;
            case 'Delivered': return <span className="pill-success">Delivered</span>;
            case 'Failed': return <span className="pill-danger">Failed</span>;
            case 'Bounced': return <span className="pill-danger">Bounced</span>;
            case 'Pending': return <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>Pending</span>;
            default: return <span style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>{status}</span>;
        }
    };

    const filteredLogs = logs.filter(log =>
        log?.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log?.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Email Logs</h1>
                    <p>Track and monitor all automated email communications</p>
                </div>
                <div>
                    <button onClick={loadEmailLogs} className="btn-outline">
                        <MdFilterList style={{ marginRight: '6px', fontSize: '16px' }} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <MdSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '20px' }} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logs by recipient, subject, or status..."
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                />
            </div>

            {/* Logs Data Table / Empty States */}
            {loading ? (
                <div className="card-clean" style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading email logs...
                    </div>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="card-clean" style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <div style={{ display: 'inline-flex', padding: '24px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.05)', marginBottom: '24px' }}>
                        <MdEmail size={48} style={{ color: '#2563EB', opacity: 0.8 }} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>No email logs found</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>Email logs will appear here once meetings are scheduled</p>
                    <button className="btn-primary" style={{ margin: '0 auto' }}>Schedule a Meeting</button>
                </div>
            ) : (
                <div className="card-clean" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="clean-table">
                            <thead style={{ backgroundColor: 'var(--table-header-bg)' }}>
                                <tr>
                                    <th>Recipient</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Date Sent</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td style={{ fontWeight: '600' }}>{log.recipient}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{log.subject}</td>
                                        <td>{getStatusPill(log.status)}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{log.date} {log.time}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', width: '100%', fontSize: '13px', fontWeight: '500' }}>
                                                <MdOutlineVisibility size={16} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailLogs;
