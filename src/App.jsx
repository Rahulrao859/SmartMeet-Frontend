import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AIScheduler from './pages/AIScheduler';
import Calendar from './pages/Calendar';
import EmailLogs from './pages/EmailLogs';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import './pages/Dashboard.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className={isAuthPage ? "" : "app-dashboard-wrapper"}>
      {/* Sidebar - only show on authenticated pages */}
      {!isAuthPage && <Sidebar />}

      {/* Main Content */}
      <div className={isAuthPage ? "" : "app-dashboard-content"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ai-scheduler" element={<ProtectedRoute><AIScheduler /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/email-logs" element={<ProtectedRoute><EmailLogs /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
