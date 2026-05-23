import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

/* ─── IMPLEMENTATION 3.2 + 3.3 + 3.5 — Meetings Page ─────────
 * Replaces the static mock-data version with:
 *   - Real API data with pagination (3.5)
 *   - Status filter tabs: All / Upcoming / Cancelled / Rescheduled
 *   - Search bar (debounced, 400ms)
 *   - Edit modal — reschedule date/time/title/platform/notes (3.2)
 *   - Cancel button with confirmation (3.3)
 *   - Hard delete (permanent) button (3.3)
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// ── Status badge colors ───────────────────────────────────────
const STATUS_STYLE = {
    confirmed:   { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', label: '✅ Confirmed' },
    rescheduled: { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', label: '🔄 Rescheduled' },
    cancelled:   { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', label: '❌ Cancelled' },
    pending:     { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1', label: '🕒 Pending' },
};

// ── Platform icon mapping ─────────────────────────────────────
const PLATFORM_ICON = {
    'Zoom':          '🟦',
    'Google Meet':   '🟩',
    'Microsoft Teams':'🟪',
    'default':       '📅',
};

// ── Toast ─────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff', padding: '13px 20px', borderRadius: '10px',
            fontWeight: '500', fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex', gap: '8px', alignItems: 'center',
        }}>
            {type === 'success' ? '✅' : '❌'} {msg}
        </div>
    );
}

// ── Edit Modal ────────────────────────────────────────────────
function EditModal({ meeting, onClose, onSave }) {
    const [form, setForm] = useState({
        title:    meeting.title,
        date:     meeting.date,
        time:     meeting.time,
        duration: meeting.duration,
        platform: meeting.platform,
        notes:    meeting.notes || '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        if (!form.title.trim()) { setError('Title is required'); return; }
        setSaving(true);
        try {
            const { data } = await axios.patch(
                `${API_BASE}/api/v1/meetings/${meeting._id}`,
                form,
                getAuthHeader()
            );
            onSave(data.meeting);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={overlay} onClick={onClose}>
            <div style={modal} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>✏️ Edit Meeting</h3>
                    <button onClick={onClose} style={closeBtnStyle}>✕</button>
                </div>

                {error && <div style={errorBox}>⚠️ {error}</div>}

                {[
                    { key: 'title',    label: 'Title',    type: 'text' },
                    { key: 'date',     label: 'Date',     type: 'date' },
                    { key: 'time',     label: 'Time',     type: 'text', placeholder: 'e.g. 2:00 PM or 14:00' },
                    { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 1 hour, 30 min' },
                ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                        <label style={fieldLabel}>{label}</label>
                        <input type={type} value={form[key]} placeholder={placeholder}
                            onChange={e => set(key, e.target.value)}
                            style={inputStyle} />
                    </div>
                ))}

                <label style={fieldLabel}>Platform</label>
                <select value={form.platform} onChange={e => set('platform', e.target.value)} style={inputStyle}>
                    {['Google Meet', 'Zoom', 'Microsoft Teams', 'Other'].map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                <label style={fieldLabel}>Notes</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                    rows={3} placeholder="Optional notes about this meeting…"
                    style={{ ...inputStyle, resize: 'vertical' }} />

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button onClick={onClose} style={btnOutline}>Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                        style={{ ...btnPrimary, opacity: saving ? 0.7 : 1, flex: 1 }}>
                        {saving ? 'Saving…' : '💾 Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Confirm Modal (for cancel / delete) ───────────────────────
function ConfirmModal({ title, message, confirmLabel, onConfirm, onClose, danger = true }) {
    return (
        <div style={overlay} onClick={onClose}>
            <div style={{ ...modal, maxWidth: '380px' }} onClick={e => e.stopPropagation()}>
                <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>{title}</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>{message}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onClose} style={{ ...btnOutline, flex: 1 }}>Cancel</button>
                    <button onClick={onConfirm}
                        style={{ ...btnPrimary, flex: 1, background: danger ? '#ef4444' : 'linear-gradient(135deg,#6366f1,#3b82f6)' }}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Meeting Card ──────────────────────────────────────────────
function MeetingCard({ meeting, onEdit, onCancel, onDelete, expanded, onToggle }) {
    const statusInfo = STATUS_STYLE[meeting.status] || STATUS_STYLE.confirmed;
    const icon = PLATFORM_ICON[meeting.platform] || PLATFORM_ICON.default;
    const isCancelled = meeting.status === 'cancelled';

    return (
        <div style={{
            background: '#fff', borderRadius: '14px', border: '1.5px solid #f1f5f9',
            boxShadow: expanded ? '0 8px 32px rgba(99,102,241,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'all 0.2s', opacity: isCancelled ? 0.7 : 1,
        }}>
            {/* Card header — clickable to expand */}
            <div onClick={onToggle} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Platform icon */}
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#ede9fe,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                            {meeting.title}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', background: statusInfo.bg, color: statusInfo.color }}>
                            {statusInfo.label}
                        </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span>📅 {meeting.date}</span>
                        <span>🕐 {meeting.time}</span>
                        <span>⏱ {meeting.duration}</span>
                        <span>📍 {meeting.platform}</span>
                    </div>
                </div>

                {/* Chevron */}
                <div style={{ fontSize: '16px', color: '#94a3b8', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>▾</div>
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 20px' }}>
                    {/* Participants */}
                    {meeting.participants?.length > 0 && (
                        <div style={{ marginBottom: '14px' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                Participants ({meeting.participants.length})
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {meeting.participants.map((email, i) => (
                                    <span key={i} style={{ fontSize: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 10px', color: '#374151' }}>
                                        {email}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Meeting link */}
                    {meeting.meetingLink && (
                        <div style={{ marginBottom: '14px' }}>
                            <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                                🔗 Join Meeting
                            </a>
                        </div>
                    )}

                    {/* Notes */}
                    {meeting.notes && (
                        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Notes</p>
                            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' }}>{meeting.notes}</p>
                        </div>
                    )}

                    {/* Action buttons */}
                    {!isCancelled && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button onClick={() => onEdit(meeting)} style={btnEdit}>✏️ Edit</button>
                            <button onClick={() => onCancel(meeting)} style={btnCancel}>🚫 Cancel</button>
                            <button onClick={() => onDelete(meeting)} style={btnDelete}>🗑️ Delete</button>
                        </div>
                    )}
                    {isCancelled && (
                        <button onClick={() => onDelete(meeting)} style={btnDelete}>🗑️ Permanently Delete</button>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function MeetingsPage() {
    const [meetings, setMeetings]       = useState([]);
    const [pagination, setPagination]   = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading]         = useState(true);
    const [expandedId, setExpandedId]   = useState(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchInput, setSearchInput]   = useState('');
    const [search, setSearch]             = useState('');  // debounced value
    const [page, setPage]                 = useState(1);

    // Modals
    const [editTarget, setEditTarget]     = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [toast, setToast] = useState(null);
    const debounceRef       = useRef(null);

    // Debounce search input
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [searchInput]);

    // Fetch meetings
    const fetchMeetings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 10 });
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (search)                 params.set('search', search);

            const { data } = await axios.get(`${API_BASE}/api/v1/meetings?${params}`, getAuthHeader());
            setMeetings(data.meetings);
            setPagination(data.pagination);
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to load meetings', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, search]);

    useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

    const showToast = (msg, type = 'success') => setToast({ msg, type });

    // ── Edit ─────────────────────────────────────────────────
    const handleSaveEdit = (updatedMeeting) => {
        setMeetings(prev => prev.map(m => m._id === updatedMeeting._id ? updatedMeeting : m));
        showToast('Meeting updated successfully');
    };

    // ── Cancel ───────────────────────────────────────────────
    const handleConfirmCancel = async () => {
        try {
            const { data } = await axios.delete(
                `${API_BASE}/api/v1/meetings/${cancelTarget._id}`,
                getAuthHeader()
            );
            setMeetings(prev => prev.map(m => m._id === data.meeting._id ? data.meeting : m));
            showToast('Meeting cancelled');
        } catch (err) {
            showToast(err.response?.data?.error || 'Cancel failed', 'error');
        } finally {
            setCancelTarget(null);
        }
    };

    // ── Hard Delete ───────────────────────────────────────────
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(
                `${API_BASE}/api/v1/meetings/${deleteTarget._id}?permanent=true`,
                getAuthHeader()
            );
            setMeetings(prev => prev.filter(m => m._id !== deleteTarget._id));
            setPagination(p => ({ ...p, total: p.total - 1 }));
            showToast('Meeting permanently deleted');
        } catch (err) {
            showToast(err.response?.data?.error || 'Delete failed', 'error');
        } finally {
            setDeleteTarget(null);
        }
    };

    const STATUS_TABS = [
        { value: 'all',         label: 'All' },
        { value: 'confirmed',   label: '✅ Confirmed' },
        { value: 'rescheduled', label: '🔄 Rescheduled' },
        { value: 'cancelled',   label: '❌ Cancelled' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            {editTarget   && <EditModal meeting={editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} />}
            {cancelTarget && (
                <ConfirmModal
                    title="Cancel Meeting?"
                    message={`Cancel "${cancelTarget.title}" on ${cancelTarget.date}? Participants will be notified by email.`}
                    confirmLabel="🚫 Yes, Cancel It"
                    onConfirm={handleConfirmCancel}
                    onClose={() => setCancelTarget(null)}
                />
            )}
            {deleteTarget && (
                <ConfirmModal
                    title="Permanently Delete?"
                    message={`This will permanently remove "${deleteTarget.title}" and all its email logs. This cannot be undone.`}
                    confirmLabel="🗑️ Delete Forever"
                    onConfirm={handleConfirmDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            )}

            {/* Header */}
            <header style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>Meetings</h1>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                        {loading ? 'Loading…' : `${pagination.total} meeting${pagination.total !== 1 ? 's' : ''}`}
                    </p>
                </div>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        placeholder="Search meetings…"
                        style={{ paddingLeft: '34px', padding: '9px 14px 9px 34px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', width: '220px', fontFamily: 'inherit' }}
                    />
                </div>
            </header>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>
                {/* Status filter tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {STATUS_TABS.map(tab => (
                        <button key={tab.value} onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                            style={{
                                padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                                background: statusFilter === tab.value ? 'linear-gradient(135deg,#6366f1,#3b82f6)' : '#fff',
                                color:      statusFilter === tab.value ? '#fff' : '#64748b',
                                boxShadow:  statusFilter === tab.value ? '0 2px 8px rgba(99,102,241,0.3)' : '0 1px 4px rgba(0,0,0,0.07)',
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Meeting list */}
                {loading ? (
                    // Skeleton loader
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #f1f5f9', animation: 'pulse 1.5s ease-in-out infinite' }}>
                                <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '6px', width: '40%', marginBottom: '10px' }} />
                                <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', width: '60%' }} />
                            </div>
                        ))}
                    </div>
                ) : meetings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#64748b', margin: '0 0 8px' }}>No meetings found</p>
                        <p style={{ fontSize: '14px', margin: 0 }}>
                            {search ? `No results for "${search}"` : 'Schedule your first meeting using the AI Scheduler'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {meetings.map(m => (
                            <MeetingCard
                                key={m._id}
                                meeting={m}
                                expanded={expandedId === m._id}
                                onToggle={() => setExpandedId(prev => prev === m._id ? null : m._id)}
                                onEdit={setEditTarget}
                                onCancel={setCancelTarget}
                                onDelete={setDeleteTarget}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    onPageChange={setPage}
                    disabled={loading}
                />
            </div>
        </div>
    );
}

// ── Shared style constants ────────────────────────────────────
const overlay    = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modal      = { background: '#fff', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' };
const fieldLabel = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', marginBottom: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' };
const btnPrimary = { padding: '11px 20px', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const btnOutline = { padding: '11px 20px', background: '#fff', color: '#64748b', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' };
const closeBtnStyle = { background: 'none', border: 'none', fontSize: '18px', color: '#94a3b8', cursor: 'pointer', padding: '4px' };
const errorBox   = { background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px' };
const btnEdit    = { padding: '7px 14px', background: '#eff6ff', color: '#3b82f6', border: '1.5px solid #bfdbfe', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
const btnCancel  = { padding: '7px 14px', background: '#fff7ed', color: '#f59e0b', border: '1.5px solid #fcd34d', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
const btnDelete  = { padding: '7px 14px', background: '#fef2f2', color: '#ef4444', border: '1.5px solid #fecaca', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
