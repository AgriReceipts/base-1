import React from "react";
import { FiPlus, FiFileText, FiHome, FiBarChart2, FiSettings } from "react-icons/fi";

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
  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 fixed md:relative h-full ${
        sidebarVisible ? 'w-64 left-0' : '-left-64 w-0'
      } ${isMobile ? 'shadow-lg' : ''}`}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Admin Menu</h2>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  onNavClick("overview");
                  if (isMobile) setSidebarVisible(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeNav === "overview"
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3"><FiHome /></span>
                <span>Overview</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  onNavClick("addReceipt");
                  if (isMobile) setSidebarVisible(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeNav === "addReceipt"
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3"><FiPlus /></span>
                <span>Add Receipt</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  onNavClick("viewReceipts");
                  if (isMobile) setSidebarVisible(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeNav === "viewReceipts"
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3"><FiFileText /></span>
                <span>View Receipts</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  onNavClick("reports");
                  if (isMobile) setSidebarVisible(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeNav === "reports"
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3"><FiBarChart2 /></span>
                <span>Reports</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Settings Button at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            onNavClick("settings");
            if (isMobile) setSidebarVisible(false);
          }}
          className={`w-full flex items-center p-3 rounded-lg transition-colors ${
            activeNav === "settings"
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
};

export default Sidebar;