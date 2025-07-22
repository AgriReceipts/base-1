import api from '@/lib/axiosInstance';
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

  logout: async () => {
    try {
      await api.post('auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    set({user: null, role: null, committee: null});
  },

  initialize: async () => {
    try {
      const response = await api.get('auth/me');
      const userData = response.data;

      set({
        user: userData.user,
        role: userData.role,
        committee: userData.committee,
        isInitialized: true,
      });
    } catch (error: any) {
      // Only log errors that aren't 401s, as 401s are expected for non-authenticated users
      if (error.response?.status !== 401) {
        console.error('[AuthStore] Failed to initialize from server.', error);
      }

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
