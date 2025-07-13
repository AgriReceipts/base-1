import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import DashboardRouter from '../pages/DashboardRouter';
import {useAuthStore} from '../stores/authStore';
import {LoadingScreen} from '../components/ui/LoadingScreen';
import {Toaster} from 'react-hot-toast';
import VerifyReceipt from '../components/global/verifyReceipt';

export const AppRouter: React.FC = () => {
  const {role, isInitialized, initialize} = useAuthStore();

  useEffect(() => {
    initialize(); // restores user & role from localStorage
  }, []);

  if (!isInitialized) return <LoadingScreen />;

  return (
    <div>
      <Toaster position='top-right' reverseOrder={false} />
      <Routes>
        <Route
          path='/'
          element={
            role ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardRouter />} />

        {/* Role-specific redirect aliases */}
        <Route path='/ad' element={<Navigate to='/dashboard' replace />} />
        <Route path='/deo' element={<Navigate to='/dashboard' replace />} />
        <Route
          path='/supervisor'
          element={<Navigate to='/dashboard' replace />}
        />
        <Route
          path='/secretary'
          element={<Navigate to='/dashboard' replace />}
        />

        {/* Public route */}
        <Route path='/verifyReceipt' element={<VerifyReceipt />} />
      </Routes>
    </div>
  );
};
