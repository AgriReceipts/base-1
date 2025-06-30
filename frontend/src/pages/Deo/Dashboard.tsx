import React, {useState, useEffect} from 'react';
import {FiSidebar, FiX, FiMenu} from 'react-icons/fi';
import NavBar from '../../components/ui/NavBar';
import Sidebar from '../../components/deocomponents/Sidebar';
import Overview from '../../components/deocomponents/Overview';
import AddReceipt from '../../components/deocomponents/AddReceipt';
import ViewReceipts from '../../components/deocomponents/ViewReceipts';
import Reports from '../../components/deocomponents/Reports';
import {MetricCards} from '../../components/deocomponents/metric-cards';

export default function DeoDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <div className='flex flex-col h-screen overflow-hidden '>
      <div className='flex flex-1 overflow-hidden relative'>
        <Sidebar
          sidebarVisible={sidebarVisible}
          isMobile={isMobile}
          setSidebarVisible={setSidebarVisible}
          activeNav={activeNav}
          onNavClick={setActiveNav}
        />

        <main
          className={`flex flex-col flex-1 overflow-auto h-full transition-all duration-300 ${
            isMobile && sidebarVisible ? 'ml-0 opacity-50' : 'ml-0'
          }`}>
          <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-3 flex justify-between items-center'>
            <h1 className='text-xl font-bold'>Dashboard</h1>
            <button
              onClick={toggleSidebar}
              className='text-gray-500 hover:text-blue-600 p-2'>
              <FiSidebar size={20} />
            </button>
          </div>

          <div className='p-4'>
            <MetricCards />
          </div>
          <div className='m-5 flex-1 flex bg-white/50 rounded-2xl'>
            {renderContent()}
          </div>
        </main>

        {isMobile && sidebarVisible && (
          <div
            className='fixed inset-0 bg-black/10 z-40 md:hidden'
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
}
