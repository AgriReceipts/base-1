import {useAuthStore} from '@/stores/authStore';
import {useNavigate} from 'react-router-dom';
import {useMemo} from 'react';

// Lucide and React Icons
import {LogOut, User} from 'lucide-react';
import {
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiFileText,
  FiPlusSquare,
  FiEye,
  FiPlus,
  FiTarget,
  FiBarChart2,
} from 'react-icons/fi';

// --- Navigation Configuration ---
// All navigation items are defined here, mapped by role.
// To add or change navigation for a role, you only need to edit this object.

const roleNavItems = {
  supervisor: [
    {id: 'overview', label: 'Overview', icon: <FiHome />},
    {id: 'addReceipt', label: 'Add Receipt', icon: <FiPlusSquare />},
    {id: 'viewReceipts', label: 'View Receipts', icon: <FiEye />},
    {id: 'traderAnalysis', label: 'Trader Analysis', icon: <FiTrendingUp />},
    {id: 'committeeAnalysis', label: 'Committee Analysis', icon: <FiUsers />},
    {id: 'reports', label: 'Reports', icon: <FiFileText />},
  ],
   secretary: [
    {id: 'overview', label: 'Overview', icon: <FiHome />},
    {id: 'addReceipt', label: 'Add Receipt', icon: <FiPlusSquare />},
    {id: 'viewReceipts', label: 'View Receipts', icon: <FiEye />},
    {id: 'traderAnalysis', label: 'Trader Analysis', icon: <FiTrendingUp />},
    {id: 'targetManagement', label: 'Target Management', icon: <FiTarget />},
    
    {id: 'committeeAnalysis', label: 'Committee Analysis', icon: <FiUsers />},
    {id: 'reports', label: 'Reports', icon: <FiFileText />},
  ],
  deo: [
    {id: 'overview', label: 'Overview', icon: <FiHome />},
    {id: 'addReceipt', label: 'Add Receipt', icon: <FiPlus />},
    {id: 'viewReceipts', label: 'View Receipts', icon: <FiFileText />},
    {id: 'reports', label: 'Reports', icon: <FiBarChart2 />},
  ],
 
  
  // Add more roles as needed
};

// --- Component Props ---
interface SidebarProps {
  sidebarVisible: boolean;
  isMobile: boolean;
  setSidebarVisible: (visible: boolean) => void;
  activeNav: string;
  onNavClick: (navId: string) => void;
  navItems?: {key: string; label: string; icon?: React.ReactNode}[];
}

// --- Sidebar Component ---
export default function Sidebar({
  sidebarVisible,
  isMobile,
  setSidebarVisible,
  activeNav,
  onNavClick,
  navItems: customNavItems,
}: SidebarProps) {
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);
  const committee = useAuthStore((state) => state.committee);
  const navigate = useNavigate();

  // Dynamically get the navigation items based on the user's role
  // useMemo ensures this is only re-calculated when the 'role' changes.
  const navItems = customNavItems
    ? customNavItems.map((item) => ({
        ...item,
        id: item.key,
        icon: item.icon || null,
      }))
    : useMemo(() => {
        // Fallback to an empty array if the role is not found in our config
        return role ? roleNavItems[role] || [] : [];
      }, [role]);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role: string | null | undefined) => {
    switch (role) {
      case 'deo':
        return 'Data Entry Operator';
      case 'supervisor':
        return 'Supervisor';
      case 'ad':
        return 'Assistant Director';
      case 'secretary':
        return 'Secretary';
      default:
        return role || 'User';
    }
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 z-50 transition-all duration-300 fixed md:relative h-full min-h-screen flex flex-col ${
        sidebarVisible ? 'w-64 left-0' : '-left-64 w-0'
      } ${isMobile ? 'shadow-lg' : ''}`}>
      {/* Header */}
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {getRoleDisplay(role)} 
        </h2>
      </div>

      {/* Scrollable Nav */}
      <div className='flex-1 overflow-y-auto'>
        <nav className='p-2'>
          <ul className='space-y-1'>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavClick(item.id);
                    if (isMobile) setSidebarVisible(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeNav === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                  <span className='mr-3'>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Fixed User Info + Logout */}
      <div className='p-4 border-t border-gray-200 text-sm text-gray-700'>
        <div className='flex items-start gap-3 mb-4'>
          <div className='p-2 bg-gray-100 rounded-full'>
            <User className='w-5 h-5 text-gray-600' />
          </div>
          <div>
            <p className='font-semibold text-gray-800'>
              {getRoleDisplay(role) || 'User'}
            </p>
            <p className='text-xs text-gray-500'>
              {committee?.name ? `${committee.name} -` : ''} AMC
            </p>
          </div>
        </div>
        <div
          onClick={handleLogout}
          className='flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer text-sm p-3 rounded-lg font-medium shadow-sm'>
          <LogOut className='w-4 h-4' />
          Logout
        </div>
      </div>
    </aside>
  );
}
