import React from 'react';
import {
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiFileText,
  FiPlusSquare,
  FiEye,
  FiSettings
} from 'react-icons/fi';

export default function Sidebar({
  sidebarVisible,
  isMobile,
  setSidebarVisible,
  activeNav,
  onNavClick,
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <FiHome /> },
     { id: 'addReceipt', label: 'Add Receipt', icon: <FiPlusSquare /> },
    { id: 'viewReceipts', label: 'View Receipts', icon: <FiEye /> },
    { id: 'traderAnalysis', label: 'Trader Analysis', icon: <FiTrendingUp /> },
    { id: 'committeeAnalysis', label: 'Committee Analysis', icon: <FiUsers /> },
    
    { id: 'reports', label: 'Reports', icon: <FiFileText /> },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 fixed md:relative h-full ${
        sidebarVisible ? 'w-64 left-0' : '-left-64 w-0'
      } ${isMobile ? 'shadow-lg' : ''}`}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Supervisor Panel</h2>
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
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
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            onNavClick('settings');
            if (isMobile) setSidebarVisible(false);
          }}
          className={`w-full flex items-center p-3 rounded-lg transition-colors ${
            activeNav === 'settings'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="mr-3"><FiSettings /></span>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
