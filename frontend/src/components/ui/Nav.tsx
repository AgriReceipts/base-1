import React from 'react'; // REMOVED: useState, useEffect
import {FiSidebar} from 'react-icons/fi';
import logo from '../../assets/logo-ap.png';
import {useAuthStore} from '@/stores/authStore';

// ADD: Accept `onToggleSidebar` as a prop
interface NavProps {
  onToggleSidebar: () => void;
}

function Nav({onToggleSidebar}: NavProps) {
  // REMOVED: All useState and useEffect hooks for sidebar state
  const committee = useAuthStore((state) => state.committee);

  // REMOVED: The old toggleSidebar function

  return (
    <div>
      {/* The top bar element is now just a plain div, not sticky itself. The parent will handle that. */}
      <div className='flex justify-between items-center'>
        <div className='flex gap-5 item-center justify-center'>
          <div className='flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg pt-3'>
            <img src={logo} alt='Ap logo'></img>
          </div>
          <div className='hidden sm:block'>
            <h1 className='text-lg font-semibold text-neutral-900'>
              AMC Receipt System - {committee && <span>{committee.name}</span>}
            </h1>

            <p className='text-sm text-neutral-500 truncate max-w-xs'>
              Agricultural Market Committee Receipt Management
            </p>
          </div>
        </div>

        <button
          // UPDATE: Call the function from props
          onClick={onToggleSidebar}
          className='text-gray-500 hover:text-blue-600 p-2'>
          <FiSidebar size={20} />
        </button>
      </div>
    </div>
  );
}

export default Nav;
