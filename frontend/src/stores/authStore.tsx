import {create} from 'zustand';

// Define types for user and committee for better type safety
interface User {
  name: string;
  designation: string;
}

interface Committee {
  id: string;
  name: string;
  // Add other committee properties as needed
}

type UserRole = 'deo' | 'supervisor' | 'ad' | 'secretary' | null;

type AuthState = {
  user: User | null;
  role: UserRole;
  committee: Committee | null;
  isInitialized: boolean;
  login: (payload: {user: User; role: UserRole; committee: Committee | null}) => void;
  logout: () => void;
  initialize: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  committee: null,
  isInitialized: false,

  login: ({user, role, committee}) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role ?? '');
    if (committee) {
      localStorage.setItem('committee', JSON.stringify(committee));
    } else {
      // If a user logs in without a committee (e.g., a supervisor),
      // ensure any existing committee data is cleared from storage.
      localStorage.removeItem('committee');
    }
    set({user, role, committee});
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('committee');
    set({user: null, role: null, committee: null});
  },

  initialize: () => {
    try {
      const userStr = localStorage.getItem('user');
      const committeeStr = localStorage.getItem('committee');

      // Helper to safely parse JSON from localStorage
      const safeParse = (str: string | null) => {
        // Check if the string is valid and looks like a JSON object before parsing
        if (str && str.startsWith('{')) {
          return JSON.parse(str);
        }
        return null;
      };

      const user = safeParse(userStr);
      const committee = safeParse(committeeStr);
      const role = localStorage.getItem('role') as UserRole;

      set({user, role, committee, isInitialized: true});
    } catch (error) {
      console.error(
        'Failed to initialize auth store from localStorage. Clearing auth state.',
        error,
      );
      // If parsing fails for any reason, logout to clear corrupted data
      useAuthStore.getState().logout();
    }
  },
}));
