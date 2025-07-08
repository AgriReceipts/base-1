import {useState, useEffect} from 'react';

import Reports from '../../components/supervisorcomponents/Reports';
import {MetricCards} from '../../components/supervisorcomponents/metric-cards';
import ViewReceipts from '@/components/common/viewReceipt/ViewReceipts';
import Overview from '@/components/common/overview/Overview';
import Sidebar from '@/components/common/Sidebar';
import Nav from '@/components/ui/Nav';
import {
  FiHome,
  FiBarChart2,
  FiFileText,
  FiTarget,
  FiUsers,
  FiBarChart,
} from 'react-icons/fi';

import Usermanage from '../../components/AdCompo/Usermanage';
import TargetManagement from './TargetManagement';
import {TargetManager} from '@/components/AdCompo/TargetManager';
import {committees} from './utils/data/committees';
import useInitialData from '@/hooks/useMetadata';

// Placeholder components for new pages
const DistrictAnalysis = () => (
  <div className='p-8 w-full text-center text-xl text-gray-600'>
    District Analysis (Coming Soon)
  </div>
);

export default function SupervisorDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
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
    {key: 'overview', label: 'Overview', icon: <FiHome />},
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
  const {detailedCommittee} = useInitialData();

  const renderContent = () => {
    switch (activeNav) {
      case 'overview':
        return <Overview onNavigate={setActiveNav} />;
      case 'districtAnalysis':
        return <DistrictAnalysis />;
      case 'allReceipts':
        return <ViewReceipts />;
      case 'targetManagement':
        return (
          <TargetManager committees={detailedCommittee} currentUser='ad' />
        );
      case 'userManagement':
        return <Usermanage />;
      case 'viewReports':
        return <Reports />;
      default:
        return <Overview onNavigate={setActiveNav} />;
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

          {activeNav === 'overview' && (
            <div className='p-4'>
              <MetricCards />
            </div>
          )}

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
