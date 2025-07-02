import React from "react";
import { FiPlus, FiFileText, FiHome, FiBarChart2, FiSettings } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sidebarVisible: boolean;
  isMobile: boolean;
  setSidebarVisible: (visible: boolean) => void;
  activeNav: string;
  onNavClick: (nav: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarVisible,
  isMobile,
  setSidebarVisible,
  activeNav,
  onNavClick,
}) => {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <FiHome size={20} /> },
    { id: 'addReceipt', label: 'Add Receipt', icon: <FiPlus size={20} /> },
    { id: 'viewReceipts', label: 'View Receipts', icon: <FiFileText size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FiBarChart2 size={20} /> },
  ];

  const handleNavClick = (navId: string) => {
    onNavClick(navId);
    if (isMobile) setSidebarVisible(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && sidebarVisible && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-40"
          onClick={() => setSidebarVisible(false)}
        />
      )}
      
      <aside
        className={cn(
          "bg-white border-r border-neutral-200 flex flex-col z-50 transition-all duration-300",
          "fixed md:relative h-full",
          {
            'w-64 left-0': sidebarVisible,
            '-left-64 w-0': !sidebarVisible,
          },
          isMobile && "shadow-lg"
        )}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Navigation</h2>
            <p className="text-sm text-neutral-500 mt-1">DEO Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "text-left font-medium text-sm",
                  {
                    'bg-primary-50 text-primary-700 border border-primary-200': activeNav === item.id,
                    'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50': activeNav !== item.id,
                  }
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings at bottom */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={() => handleNavClick('settings')}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
              "text-left font-medium text-sm",
              {
                'bg-primary-50 text-primary-700 border border-primary-200': activeNav === 'settings',
                'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50': activeNav !== 'settings',
              }
            )}
          >
            <span className="flex-shrink-0"><FiSettings size={20} /></span>
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;