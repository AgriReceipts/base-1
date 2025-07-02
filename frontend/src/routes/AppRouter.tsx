import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import DashboardRouter from '../pages/DashboardRouter';
import {useAuthStore} from '../stores/authStore';
import {LoadingScreen} from '../components/ui/LoadingScreen';

import {ReceiptProvider} from '../contexts/ReceiptContext';
import {Toaster} from 'react-hot-toast';

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
              <Navigate to='/dashboard' replace={true} />
            ) : (
              <Navigate to='/login' replace={true} />
            )
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/dashboard'
          element={
            <ReceiptProvider>
              <DashboardRouter />
            </ReceiptProvider>
          }
        />
        <Route
          path='/ad'
          element={<Navigate to='/dashboard' replace={true} />}
        />
        <Route
          path='/deo'
          element={<Navigate to='/dashboard' replace={true} />}
        />
        <Route
          path='/supervisor'
          element={<Navigate to='/dashboard' replace={true} />}
        />
      </Routes>
    </div>
  );
};
