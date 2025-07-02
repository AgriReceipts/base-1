import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { HiOutlineLogout, HiOutlineUser, HiMenu } from 'react-icons/hi';
import { FiBuilding } from 'react-icons/fi';
import Button from './Button';

interface AuthState {
  logout: () => void;
  role?: string | null;
  committee?: string | null;
  user?: string | null;
}

const NavBar: React.FC = () => {
  const logout = useAuthStore((state: AuthState) => state.logout);
  const role = useAuthStore((state: AuthState) => state.role);
  const committee = useAuthStore((state: AuthState) => state.committee);
  const user = useAuthStore((state: AuthState) => state.user);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role: string | null | undefined) => {
    switch (role) {
      case 'deo': return 'Data Entry Operator';
      case 'supervisor': return 'Supervisor';
      case 'ad': return 'Assistant Director';
      default: return role || 'User';
    }
  };

  return (
    <nav className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Committee */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <FiBuilding className="w-5 h-5 text-primary-600" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-neutral-900">
                  AMC Receipt System
                </h1>
                {committee && (
                  <p className="text-sm text-neutral-500 truncate max-w-xs">
                    {committee}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop view */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-3 py-2 bg-neutral-50 rounded-lg">
                <HiOutlineUser className="w-5 h-5 text-neutral-400" />
                <div className="text-sm">
                  <p className="font-medium text-neutral-900">{user}</p>
                  <p className="text-neutral-500">{getRoleDisplay(role)}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <HiOutlineLogout className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <HiMenu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 px-3 py-2 bg-neutral-50 rounded-lg">
                <HiOutlineUser className="w-5 h-5 text-neutral-400" />
                <div className="text-sm">
                  <p className="font-medium text-neutral-900">{user}</p>
                  <p className="text-neutral-500">{getRoleDisplay(role)}</p>
                </div>
              </div>
              
              {committee && (
                <div className="px-3 py-2">
                  <p className="text-sm text-neutral-500">Committee</p>
                  <p className="text-sm font-medium text-neutral-900">{committee}</p>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                fullWidth
                className="flex items-center justify-center space-x-2"
              >
                <HiOutlineLogout className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;