import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { MdEmail, MdSearch, MdFilterList } from 'react-icons/md';
=======
import { MdEmail, MdSearch, MdFilterList, MdOutlineVisibility } from 'react-icons/md';
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
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
<<<<<<< HEAD
            setLogs(data.logs);
        } catch (error) {
            console.error('Error loading email logs:', error);
=======
            setLogs(data?.logs || []);
        } catch (error) {
            console.error('Error loading email logs:', error);
            setLogs([]);
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    const getStatusColor = (status) => {
        switch (status) {
            case 'Sent': return 'text-blue-400 bg-blue-400/10';
            case 'Delivered': return 'text-green-400 bg-green-400/10';
            case 'Opened': return 'text-purple-400 bg-purple-400/10';
            case 'Failed': return 'text-red-400 bg-red-400/10';
            case 'Bounced': return 'text-red-400 bg-red-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
=======
    const getStatusPill = (status) => {
        switch (status) {
            case 'Sent': return <span className="pill-success">Sent</span>;
            case 'Delivered': return <span className="pill-success">Delivered</span>;
            case 'Failed': return <span className="pill-danger">Failed</span>;
            case 'Bounced': return <span className="pill-danger">Bounced</span>;
            case 'Pending': return <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>Pending</span>;
            default: return <span style={{ backgroundColor: '#F3F4F6', color: '#6B7280', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>{status}</span>;
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        }
    };

    const filteredLogs = logs.filter(log =>
<<<<<<< HEAD
        log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Email Logs</h1>
                    <p className="text-gray-400">Track and monitor all automated email communications</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadEmailLogs}
                        className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-gray-300 rounded-lg hover:bg-navy-700 transition-colors"
                    >
                        <MdFilterList />
                        <span>Refresh</span>
=======
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
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                    </button>
                </div>
            </div>

            {/* Search Bar */}
<<<<<<< HEAD
            <div className="mb-6 relative">
                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
=======
            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <MdSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '20px' }} />
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logs by recipient, subject, or status..."
<<<<<<< HEAD
                    className="w-full bg-navy-800 text-white pl-12 pr-4 py-3 rounded-xl border border-navy-700 focus:border-primary-purple focus:outline-none transition-colors"
                />
            </div>

            {/* Logs Table */}
            {loading ? (
                <div className="bg-navy-800 rounded-xl border border-navy-700 p-8 text-center">
                    <p className="text-gray-400">Loading email logs...</p>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="bg-navy-800 rounded-xl border border-navy-700 p-8 text-center">
                    <p className="text-gray-400">No email logs found</p>
                </div>
            ) : (
                <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-navy-900 border-b border-navy-700">
                            <tr>
                                <th className="px-6 py-4 text-gray-400 font-medium">Recipient</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">Subject</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">Time</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-700">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-navy-700/50 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{log.recipient}</td>
                                    <td className="px-6 py-4 text-gray-300">{log.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{log.time}</td>
                                    <td className="px-6 py-4 text-gray-400">{log.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
=======
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
                    <div style={{ display: 'inline-flex', padding: '24px', borderRadius: '50%', backgroundColor: 'rgba(108, 99, 255, 0.05)', marginBottom: '24px' }}>
                        <MdEmail size={48} style={{ color: '#6C63FF', opacity: 0.8 }} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>No email logs found</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>Email logs will appear here once meetings are scheduled</p>
                    <button className="btn-primary" style={{ margin: '0 auto' }}>Schedule a Meeting</button>
                </div>
            ) : (
                <div className="card-clean" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="clean-table">
                            <thead style={{ backgroundColor: '#FAFBFC' }}>
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
                                        <td style={{ color: '#6B7280' }}>{log.subject}</td>
                                        <td>{getStatusPill(log.status)}</td>
                                        <td style={{ color: '#6B7280' }}>{log.date} {log.time}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button style={{ background: 'none', border: 'none', color: '#6C63FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', width: '100%', fontSize: '13px', fontWeight: '500' }}>
                                                <MdOutlineVisibility size={16} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
                </div>
            )}
        </div>
    );
};

export default EmailLogs;
