import React from "react";
import { FiPlus, FiFileText, FiHome, FiBarChart2 } from "react-icons/fi";

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
      className={
        "bg-white/95 backdrop-blur-sm h-full transition-all duration-300 ease-in-out " +
        (sidebarVisible ? "w-64" : "w-0") +
        " " +
        (isMobile ? "fixed md:relative z-50 shadow-xl" : "relative") +
        " flex-shrink-0 overflow-hidden border-r border-gray-100/50"
      }
      style={{
        marginTop: 0,
        willChange: "transform, width",
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-blue-50/30 pointer-events-none" />

      {/* Sidebar Header */}
      <div className="p-5 pb-3 text-xl font-semibold text-blue-600/90 border-b border-gray-100/50 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-blue-100/30 blur-xl" />
        <span className="relative z-10">Admin Menu</span>
      </div>

      {/* Sidebar Navigation */}
      <nav className="p-3 space-y-2 relative z-10">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
            activeNav === "overview"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-700/90 hover:bg-white hover:shadow-soft-lg hover:translate-x-2 hover:text-blue-600"
          } cursor-pointer group`}
          onClick={() => {
            onNavClick("overview");
            if (isMobile) setSidebarVisible(false);
          }}
        >
          <div
            className={
              "p-2 rounded-lg " +
              (activeNav === "overview"
                ? "bg-white text-blue-500 shadow-md"
                : "bg-blue-100/50 text-blue-500/90 group-hover:bg-blue-500 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 shadow-sm group-hover:shadow-md")
            }
          >
            <FiHome className="transition-transform duration-300 group-hover:scale-125" />
          </div>
          <span
            className={`font-medium transition-all duration-300 ${
              activeNav !== "overview" && "group-hover:font-semibold"
            }`}
            style={{ whiteSpace: "nowrap" }}
          >
            Overview
          </span>
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
            activeNav === "addReceipt"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-700/90 hover:bg-white hover:shadow-soft-lg hover:translate-x-2 hover:text-blue-600"
          } cursor-pointer group`}
          onClick={() => {
            onNavClick("addReceipt");
            if (isMobile) setSidebarVisible(false);
          }}
        >
          <div
            className={
              "p-2 rounded-lg " +
              (activeNav === "addReceipt"
                ? "bg-white text-blue-500 shadow-md"
                : "bg-blue-100/50 text-blue-500/90 group-hover:bg-blue-500 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 shadow-sm group-hover:shadow-md")
            }
          >
            <FiPlus className="transition-transform duration-300 group-hover:scale-125" />
          </div>
          <span
            className={`font-medium transition-all duration-300 ${
              activeNav !== "addReceipt" && "group-hover:font-semibold"
            }`}
            style={{ whiteSpace: "nowrap" }}
          >
            Add Receipt
          </span>
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
            activeNav === "viewReceipts"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-700/90 hover:bg-white hover:shadow-soft-lg hover:translate-x-2 hover:text-blue-600"
          } cursor-pointer group`}
          onClick={() => {
            onNavClick("viewReceipts");
            if (isMobile) setSidebarVisible(false);
          }}
        >
          <div
            className={
              "p-2 rounded-lg " +
              (activeNav === "viewReceipts"
                ? "bg-white text-blue-500 shadow-md"
                : "bg-blue-100/50 text-blue-500/90 group-hover:bg-blue-500 group-hover:text-white group-hover:-rotate-12 group-hover:scale-110 shadow-sm group-hover:shadow-md")
            }
          >
            <FiFileText className="transition-transform duration-300 group-hover:scale-125" />
          </div>
          <span
            className={`font-medium transition-all duration-300 ${
              activeNav !== "viewReceipts" && "group-hover:font-semibold"
            }`}
            style={{ whiteSpace: "nowrap" }}
          >
            View Receipts
          </span>
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
            activeNav === "reports"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-700/90 hover:bg-white hover:shadow-soft-lg hover:translate-x-2 hover:text-blue-600"
          } cursor-pointer group`}
          onClick={() => {
            onNavClick("reports");
            if (isMobile) setSidebarVisible(false);
          }}
        >
          <div
            className={
              "p-2 rounded-lg " +
              (activeNav === "reports"
                ? "bg-white text-blue-500 shadow-md"
                : "bg-blue-100/50 text-blue-500/90 group-hover:bg-blue-500 group-hover:text-white group-hover:-rotate-12 group-hover:scale-110 shadow-sm group-hover:shadow-md")
            }
          >
            <FiBarChart2 className="transition-transform duration-300 group-hover:scale-125" />
          </div>
          <span
            className={`font-medium transition-all duration-300 ${
              activeNav !== "reports" && "group-hover:font-semibold"
            }`}
            style={{ whiteSpace: "nowrap" }}
          >
            Reports
          </span>
        </div>
      </nav>

      {/* Sidebar Dots Decoration */}
      <div className="absolute bottom-4 left-4 flex space-x-2 opacity-30">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;