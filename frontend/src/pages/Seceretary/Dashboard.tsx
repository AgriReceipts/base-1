import {useState, useEffect} from 'react';
import TraderAnalysis from '../../components/common/analytics/TraderAnalysis';
import CommitteeAnalysis from '../../components/common/analytics/CommiteeAnalysis';
import Reports from '../../components/supervisorcomponents/Reports';

import {MetricCards} from '../../components/supervisorcomponents/metric-cards';
import ViewReceipts from '@/components/common/viewReceipt/ViewReceipts';
import ReceiptEntry from '../../components/common/newReceipt/ReceiptEntry';
import Overview from '@/components/common/overview/Overview';
import Sidebar from '@/components/common/Sidebar';
import Nav from '@/components/ui/Nav';
import {TargetManager} from '@/components/AdCompo/TargetManager';
import useInitialData from '@/hooks/useInititalData';
import {useAuthStore} from '@/stores/authStore';

export default function SecretaryDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeNav, setActiveNav] = useState(
    () => localStorage.getItem('activeNav') || 'overview'
  );

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
  const {detailedCommittee} = useInitialData();
  const {user} = useAuthStore();

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const renderContent = () => {
    switch (activeNav) {
      case 'overview':
        return <Overview onNavigate={setActiveNav} />;
      case 'addReceipt':
        return <ReceiptEntry />;
      case 'viewReceipts':
        return <ViewReceipts />;
      case 'targetManagement':
        return (
          <TargetManager
            committees={detailedCommittee}
            currentUser={user?.name || 'secretary'}
          />
        );
      case 'reports':
        return <Reports />;
      default:
        return <Overview onNavigate={setActiveNav} />;
    }
  };

  const navItems = [
    {key: 'overview', label: 'Overview'},
    {key: 'addReceipt', label: 'Add Receipt'},
    {key: 'viewReceipts', label: 'View Receipts'},
    {key: 'targetManagement', label: 'Target Management'},
    {key: 'reports', label: 'Reports'},
  ];

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
