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
<<<<<<< HEAD
import Newcalender from './pages/Newcalender';
import Meetings from './pages/Meetings';
=======
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/signup'].includes(location.pathname);

  return (
<<<<<<< HEAD
    <div className={isAuthPage ? "" : "flex h-screen bg-navy-900 dark:bg-navy-900 bg-gray-50 overflow-hidden"}>
=======
    <div className={isAuthPage ? "" : "app-dashboard-wrapper"}>
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
      {/* Sidebar - only show on authenticated pages */}
      {!isAuthPage && <Sidebar />}

      {/* Main Content */}
<<<<<<< HEAD
      <div className={isAuthPage ? "" : "flex-1 overflow-y-auto"}>
=======
      <div className={isAuthPage ? "" : "app-dashboard-content"}>
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-scheduler" element={<AIScheduler />} />
<<<<<<< HEAD
          <Route path="/calendar" element={<Newcalender />} />
          <Route path="/email-logs" element={<EmailLogs />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/meetings" element={<Meetings />} />
=======
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/email-logs" element={<EmailLogs />} />
          <Route path="/activity" element={<Activity />} />
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
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
