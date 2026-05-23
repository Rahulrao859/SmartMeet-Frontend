import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// ── Eagerly loaded (always needed) ───────────────────────────
import LandingPage   from './pages/LandingPage';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import Dashboard     from './pages/Dashboard';
import './pages/Dashboard.css';

// ── Lazily loaded (only when route is visited) ────────────────
const AIScheduler   = lazy(() => import('./pages/AIScheduler'));
const Calendar      = lazy(() => import('./pages/Calendar'));
const EmailLogs     = lazy(() => import('./pages/EmailLogs'));
const Activity      = lazy(() => import('./pages/Activity'));
const Settings      = lazy(() => import('./pages/Settings'));
const Meetings      = lazy(() => import('./pages/Meetings'));

// ── Phase 2 — Auth flow pages (no sidebar, no auth required) ──
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail    = lazy(() => import('./pages/VerifyEmail'));

// ── Phase 2 — Profile page (auth required) ───────────────────
const Profile        = lazy(() => import('./pages/Profile'));

// Public paths where sidebar should be hidden
const NO_SIDEBAR_PATHS = ['/', '/login', '/signup', '/forgot-password'];
const isNoSidebarPath  = (path) =>
    NO_SIDEBAR_PATHS.includes(path) ||
    path.startsWith('/reset-password/') ||
    path.startsWith('/verify-email/');

function AppContent() {
  const location  = useLocation();
  const isAuthPage = isNoSidebarPath(location.pathname);

  return (
    <div className={isAuthPage ? '' : 'app-dashboard-wrapper'}>
      {!isAuthPage && <Sidebar />}

      <div className={isAuthPage ? '' : 'app-dashboard-content'}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6366f1', fontSize: '14px' }}>
            Loading…
          </div>
        }>
          <Routes>
            {/* ── Public ──────────────────────────────────── */}
            <Route path="/"                        element={<LandingPage />} />
            <Route path="/login"                   element={<Login />} />
            <Route path="/signup"                  element={<Signup />} />
            <Route path="/forgot-password"         element={<ForgotPassword />} />
            <Route path="/reset-password/:token"   element={<ResetPassword />} />
            <Route path="/verify-email/:token"     element={<VerifyEmail />} />

            {/* ── Protected ───────────────────────────────── */}
            <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ai-scheduler" element={<ProtectedRoute><AIScheduler /></ProtectedRoute>} />
            <Route path="/meetings"    element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
            <Route path="/calendar"    element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/email-logs"  element={<ProtectedRoute><EmailLogs /></ProtectedRoute>} />
            <Route path="/activity"    element={<ProtectedRoute><Activity /></ProtectedRoute>} />
            <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
