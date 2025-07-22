import React, {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useAuthStore} from '../stores/authStore';
import {Toaster} from 'react-hot-toast';

// Import all page components
import LandingPage from '@/pages/LandingPage/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import VerifyReceipt from '../components/global/verifyReceipt';
import {LoadingScreen} from '../components/ui/LoadingScreen';
import DeoDashboard from '../pages/Deo/Dashboard';
import SupervisorDashboard from '../pages/Supervisor/Dashboard';
import AdDashboard from '../pages/Ad/Dashboard';
import SecretaryDashboard from '../pages/Seceretary/Dashboard';

/**
 * This component is the single source of truth for the dashboard.
 * It waits for authentication to be initialized, then renders the
 * correct dashboard based on the user's role, or redirects to login.
 */
const DashboardPage = () => {
  const {role, isInitialized} = useAuthStore();

  // 1. While we check for a session, show a loading screen.
  // This is the key to preventing incorrect redirects.
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // // 2. After checking, if there is no role, redirect to the login page.
  if (!role) {
    return <Navigate to='/' replace />;
  }

  // 3. If a role exists, render the correct dashboard component.
  switch (role) {
    case 'deo':
      return <DeoDashboard />;
    case 'supervisor':
      return <SupervisorDashboard />;
    case 'ad':
      return <AdDashboard />;
    case 'secretary':
      return <SecretaryDashboard />;
    default:
      // As a fallback for an invalid role, redirect to login.
      return <Navigate to='/' replace />;
  }
};

/**
 * The main application router, now radically simplified.
 */
export const AppRouter: React.FC = () => {
  const {isInitialized, initialize} = useAuthStore();

  // This effect runs once on app load to check for an existing session.
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />
      <Routes>
        {/* --- Unprotected Routes --- */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verifyReceipt' element={<VerifyReceipt />} />

        {/* --- The Single Protected Route --- */}
        {/* All protection and rendering logic is now inside the DashboardPage component. */}
        <Route path='/dashboard' element={<DashboardPage />} />

        {/* --- Redirects for old URLs --- */}
        {/* This ensures any old bookmarks like /deo still work. */}
        <Route path='/deo' element={<Navigate to='/dashboard' replace />} />
        <Route
          path='/supervisor'
          element={<Navigate to='/dashboard' replace />}
        />
        <Route path='/ad' element={<Navigate to='/dashboard' replace />} />
        <Route
          path='/secretary'
          element={<Navigate to='/dashboard' replace />}
        />

        {/* --- Fallback Route --- */}
        {/* Any URL not matched above will redirect to the landing page. */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  );
};
