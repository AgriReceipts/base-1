import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';

interface AuthState {
  logout: () => void;
  role?: string | null;
  committee?: string | null;
}

const NavBar: React.FC = () => {
  const logout = useAuthStore((state: AuthState) => state.logout);
  const role = useAuthStore((state: AuthState) => state.role);
  const committee = useAuthStore((state: AuthState) => state.committee);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white shadow-sm px-4 sm:px-6 md:px-8 py-4 border-b border-slate-200 relative z-50">
      <div className="flex items-center justify-between">
        {/* Committee Info */}
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-blue-50 shadow-inner flex items-center justify-center">
            <FaBuilding className="text-blue-600 w-8 h-8" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-blue-600 tracking-tight uppercase">
              {(committee || 'Committee').toUpperCase()}
            </div>
            <div className="text-sm text-gray-500">
              Agricultural Market Committee Receipt Management
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Role Badge */}
          <div
            className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm shadow-sm hover:bg-blue-200 transition"
            title="Your current user role"
          >
            👤 {role || 'Role'}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-md transition-all duration-200 text-sm font-medium"
            aria-label="Logout"
            title="Logout"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Dropdown Toggle */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Menu"
          >
            <HiDotsVertical className="w-6 h-6 text-gray-700" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md py-2">
              <div className="px-4 py-2 text-sm text-gray-700 font-semibold">
                👤 {role || 'Role'}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
