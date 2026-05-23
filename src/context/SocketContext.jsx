import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const connectSocket = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // If already connected, do nothing
        if (socket?.connected) return;

        const newSocket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('[SOCKET] Connected to real-time server:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('[SOCKET] Connection failed:', err.message);
        });

        // Real-time Event Listeners
        newSocket.on('meeting:created', (data) => {
            showToast(`📅 New meeting scheduled: "${data.meeting.title}"`, 'success');
        });

        newSocket.on('meeting:updated', (data) => {
            showToast(`🔄 Meeting rescheduled: "${data.meeting.title}"`, 'info');
        });

        newSocket.on('meeting:cancelled', (data) => {
            showToast(`❌ Meeting cancelled: "${data.meeting.title}"`, 'error');
        });

        newSocket.on('email:log', (data) => {
            const { log } = data;
            const isSent = log.status === 'Sent';
            if (isSent) {
                showToast(`📧 Email delivered to ${log.recipient}`, 'success');
            } else {
                showToast(`⚠️ Email delivery failed to ${log.recipient}`, 'error');
            }
        });

        setSocket(newSocket);
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
            console.log('[SOCKET] Disconnected from server');
        }
    };

    // Auto-connect socket if token is present on mount
    useEffect(() => {
        connectSocket();
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    // Listen for storage changes to sync token login/logout across tabs
    useEffect(() => {
        const handleAuthChange = () => {
            const token = localStorage.getItem('token');
            if (token) {
                connectSocket();
            } else {
                disconnectSocket();
            }
        };

        window.addEventListener('storage', handleAuthChange);
        return () => window.removeEventListener('storage', handleAuthChange);
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket, showToast }}>
            {children}
            
            {/* Real-Time Toast Notification Banner */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 99999,
                    background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                toast.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                                'linear-gradient(135deg, #6366f1, #3b82f6)',
                    color: '#fff',
                    padding: '14px 22px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateY(30px) scale(0.9); opacity: 0; }
                            to { transform: translateY(0) scale(1); opacity: 1; }
                        }
                    `}</style>
                    <span>{toast.msg}</span>
                </div>
            )}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
