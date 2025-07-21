import api from '@/lib/axiosInstance';
import toast from 'react-hot-toast';
import {create} from 'zustand';

// ------------------ Types (UNCHANGED) ------------------

interface User {
  name: string;
  designation: string;
}

interface Committee {
  id: string;
  name: string;
}

type UserRole = 'deo' | 'supervisor' | 'ad' | 'secretary' | null;

type AuthState = {
  user: User | null;
  role: UserRole;
  committee: Committee | null;
  isInitialized: boolean;
  login: (payload: {
    user: User;
    role: UserRole;
    committee: Committee | null;
  }) => void;
  logout: () => void;
  initialize: () => Promise<void>;
};
interface AppState {
  isApiInitialized: boolean;
  initializeApi: () => Promise<void>;
}
// ------------------ API Helper (REMOVED) ------------------
// We now use the central axios instance from `api.ts`

// ------------------ Zustand Store (UPDATED) ------------------

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  committee: null,
  isInitialized: false,

  login: ({user, role, committee}) => {
    set({user, role, committee});
  },

  logout: () => {
    // Use the central api instance to call the logout endpoint
    api.post('auth/logout').catch(console.error);
    set({user: null, role: null, committee: null});
  },

  initialize: async () => {
    try {
      // The CSRF token is handled automatically by the axios instance now.
      // We just need to check the user's session status.
      const response = await api.get('auth/me');
      const userData = response.data;

      set({
        user: userData.user,
        role: userData.role,
        committee: userData.committee,
        isInitialized: true,
      });
    } catch (error) {
      // The axios interceptor will handle 401s, but we catch other errors here.
      console.error('[AuthStore] Failed to initialize from server.', error);
      set({
        user: null,
        role: null,
        committee: null,
        isInitialized: true,
      });
    }
  },
}));

// ------------------ Updated Login Helper ------------------

export const handleJwtLogin = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    // Use the central api instance for login
    const response = await api.post('auth/login', credentials);

    if (!response.data) {
      return {success: false, error: 'Login failed'};
    }

    const data = response.data;

    useAuthStore.getState().login({
      user: {
        name: data.user.name,
        designation: data.user.designation,
      },
      role: data.user.role,
      committee: data.user.committee || null,
    });

    // No need to call initialize() again here unless you want to re-fetch
    // after login, which is generally a good pattern.
    await useAuthStore.getState().initialize();

    return {success: true, data};
  } catch (error: any) {
    console.error('Failed to process login:', error);
    const errorMessage =
      error.response?.data?.message || 'Login failed due to a network error.';
    return {success: false, error: errorMessage};
  }
};

// ------------------ Initialize from Server ------------------

export const initializeFromServer = async () => {
  await useAuthStore.getState().initialize();
};

export const initializeFromToken = initializeFromServer;

export const useAppStore = create<AppState>((set) => ({
  isApiInitialized: false,
  initializeApi: async () => {
    try {
      // Use the raw axios instance before the default is set
      const {data} = await api.get('/health', {withCredentials: true});
      const csrfToken = data.csrfToken;

      if (csrfToken) {
        api.defaults.headers.common['x-csrf-token'] = csrfToken;
        set({isApiInitialized: true});
        console.log('✅ API Initialized Successfully.');
      } else {
        throw new Error('CSRF token not received from server.');
      }
    } catch (error) {
      console.error('Failed to initialize API:', error);
      toast.error('Could not establish a secure connection.');
      // Keep isApiInitialized as false
    }
  },
}));
