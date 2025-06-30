import React from 'react';
import {Navigate} from 'react-router-dom';
import DeoDashboard from './Deo/Dashboard';
import SupervisorDashboard from './Supervisor/Dashboard';
import AdDashboard from './Ad/Dashboard';
import {useAuthStore} from '../stores/authStore';
import NavBar from '@/components/ui/NavBar';

const DashboardRouter: React.FC = () => {
  const {role} = useAuthStore();

  if (!role) {
    return <Navigate to='/login' replace={true} />;
  }

  let DashboardComponent: React.ReactNode;

  switch (role) {
    case 'deo':
      DashboardComponent = <DeoDashboard />;
      break;
    case 'supervisor':
      DashboardComponent = <SupervisorDashboard />;
      break;
    case 'ad':
      DashboardComponent = <AdDashboard />;
      break;
    default:
      return <Navigate to='/login' replace={true} />;
  }

  return (
    <div className='max-w-screen-2xl mx-auto bg-gray-50'>
      <NavBar />
      {DashboardComponent}
    </div>
  );
};

export default DashboardRouter;
