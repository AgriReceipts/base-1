import {useState, useEffect} from 'react';
import ViewReceipts from '@/components/common/viewReceipt/ViewReceipts';
import Sidebar from '@/components/common/Sidebar';
import Nav from '@/components/ui/Nav';
import {
  FiBarChart2,
  FiFileText,
  FiTarget,
  FiUsers,
  FiBarChart,
} from 'react-icons/fi';

import {TargetManager} from '@/components/AdCompo/TargetManager';
import {useAuthStore} from '@/stores/authStore';
import DistrictAnalysis from '@/components/AdCompo/Districtanalysis.tsx';
import UserPage from '@/components/AdCompo/UserManagement/UserPage.tsx';
import ComingSoon from '@/components/common/Reports';

export default function SupervisorDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const {user} = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const [activeNav, setActiveNav] = useState(() => {
    return localStorage.getItem('activeNav') || 'overview';
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

  // New navigation fields for AD with icons
  const navItems = [
    {
      key: 'districtAnalysis',
      label: 'District Analysis',
      icon: <FiBarChart2 />,
    },
    {key: 'allReceipts', label: 'All Receipts', icon: <FiFileText />},
    {key: 'targetManagement', label: 'Target Management', icon: <FiTarget />},
    {key: 'userManagement', label: 'User Management', icon: <FiUsers />},
    {key: 'viewReports', label: 'View Reports', icon: <FiBarChart />},
  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'districtAnalysis':
        return <DistrictAnalysis />;
      case 'allReceipts':
        return <ViewReceipts />;
      case 'targetManagement':
        return <TargetManager currentUser={user?.name || 'ad'} />;
      case 'userManagement':
        return <UserPage />;
      case 'viewReports':
        return <ComingSoon />;
      default:
        return <DistrictAnalysis />;
    }
  };

  return (
    <div className='flex flex-col h-screen bg-gray-50 overflow-hidden'>
      <div className='flex flex-1 overflow-hidden relative'>
        <Sidebar
          sidebarVisible={sidebarVisible}
          isMobile={isMobile}
          setSidebarVisible={setSidebarVisible}
          activeNav={activeNav}
          onNavClick={setActiveNav}
          navItems={navItems}
        />

        <main
          className={`flex flex-col flex-1 overflow-auto h-full transition-all duration-300 ${
            isMobile && sidebarVisible ? 'ml-0 opacity-50' : 'ml-0'
          }`}>
          <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-3'>
            <Nav onToggleSidebar={toggleSidebar} />
          </div>

          <div className='m-2 my-0 flex-1 flex bg-white/50 rounded-2xl'>
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
