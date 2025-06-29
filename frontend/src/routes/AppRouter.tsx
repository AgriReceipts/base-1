import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import DeoDashboard from '../pages/Deo/Dashboard';
import SupervisorDashboard from '../pages/Supervisor/Dashboard';
import AdDashboard from '../pages/Ad/Dashboard';
import { useAuthStore } from '../stores/authStore';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export const AppRouter: React.FC = () => {
  const { role, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize(); // restores user & role from localStorage
  }, []);

  if (!isInitialized) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/deo"
        element={role === 'deo' ? <DeoDashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/supervisor"
        element={role === 'supervisor' ? <SupervisorDashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/ad"
        element={role === 'ad' ? <AdDashboard /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};
