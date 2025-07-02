import React, { useState, useEffect } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import NavBar from '../../components/ui/NavBar';
import Sidebar from '../../components/deocomponents/Sidebar';
import Overview from '../../components/deocomponents/Overview';
import AddReceipt from '../../components/deocomponents/AddReceipt';
import ViewReceipts from '../../components/deocomponents/ViewReceipts';
import Reports from '../../components/deocomponents/Reports';
import { MetricCards } from '../../components/deocomponents/metric-cards';
import Button from '../../components/ui/Button';

export default function DeoDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeNav, setActiveNav] = useState(() => {
    return localStorage.getItem('activeNav') ?? 'overview';
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeNav', activeNav);
  }, [activeNav]);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const renderContent = () => {
    switch (activeNav) {
      case 'overview':
        return <Overview onNavigate={setActiveNav} />;
      case 'addReceipt':
        return <AddReceipt />;
      case 'viewReceipts':
        return <ViewReceipts />;
      case 'reports':
        return <Reports />;
      default:
        return <Overview onNavigate={setActiveNav} />;
    }
  };

  const getPageTitle = () => {
    switch (activeNav) {
      case 'overview': return 'Dashboard Overview';
      case 'addReceipt': return 'Add New Receipt';
      case 'viewReceipts': return 'Receipt Management';
      case 'reports': return 'Reports & Analytics';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-50 overflow-hidden">
      <NavBar />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          sidebarVisible={sidebarVisible}
          isMobile={isMobile}
          setSidebarVisible={setSidebarVisible}
          activeNav={activeNav}
          onNavClick={setActiveNav}
        />

        <main className="flex flex-col flex-1 overflow-auto h-full">
          {/* Header bar */}
          <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                {sidebarVisible ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
              </Button>
              <h1 className="text-xl font-semibold text-neutral-900">
                {getPageTitle()}
              </h1>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hidden md:flex"
            >
              <HiOutlineMenu size={20} />
            </Button>
          </div>

          {/* Metrics for overview page */}
          {activeNav === 'overview' && (
            <div className="bg-white border-b border-neutral-200 px-6 py-6">
              <MetricCards />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <div className="h-full bg-white">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}