import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AIScheduler from './pages/AIScheduler';
import Calendar from './pages/Calendar';
import EmailLogs from './pages/EmailLogs';
import Activity from './pages/Activity';
import Settings from './pages/Settings';

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-scheduler" element={<AIScheduler />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/email-logs" element={<EmailLogs />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/settings" element={<Settings />} />
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
