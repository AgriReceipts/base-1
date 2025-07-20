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

// ------------------ API Helper ------------------
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  return fetch(`/api/${endpoint}`, {
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};

// ------------------ Zustand Store (MINIMAL CHANGES) ------------------

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  committee: null,
  isInitialized: false,

  login: ({user, role, committee}) => {
    // Remove localStorage usage, just set state
    set({user, role, committee});
  },

  logout: () => {
    // Call logout API to clear HttpOnly cookies
    apiRequest('auth/logout', {method: 'POST'}).catch(console.error);
    set({user: null, role: null, committee: null});
  },

  initialize: async () => {
    try {
      // Check auth status from server instead of localStorage
      const response = await apiRequest('auth/me');

      if (response.ok) {
        const userData = await response.json();
        set({
          user: userData.user,
          role: userData.role,
          committee: userData.committee,
          isInitialized: true,
        });
      } else {
        set({
          user: null,
          role: null,
          committee: null,
          isInitialized: true,
        });
      }
    } catch (error) {
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
    const response = await apiRequest('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {success: false, error: errorData.message || 'Login failed'};
    }

    const data = await response.json();

    // Use the store's login method to set the state immediately
    useAuthStore.getState().login({
      user: {
        name: data.user.name,
        designation: data.user.designation,
      },
      role: data.user.role,
      committee: data.user.committee || null,
    });

    // Also refresh from server to ensure consistency
    await useAuthStore.getState().initialize();

    return {success: true, data};
  } catch (error) {
    console.error('Failed to process login:', error);
    return {success: false, error};
  }
};

// ------------------ Initialize from Server (replaces initializeFromToken) ------------------

export const initializeFromServer = async () => {
  await useAuthStore.getState().initialize();
};

// Keep the old function name for compatibility
export const initializeFromToken = initializeFromServer;
