import { create } from 'zustand';

type UserRole = 'deo' | 'supervisor' | 'ad' | null;

type AuthState = {
  user: string | null;
  role: UserRole;
  isInitialized: boolean;
  login: (username: string) => void;
  logout: () => void;
  initialize: () => void;
};

const ROLE_MAP: Record<string, UserRole> = {
  demo_deo: 'deo',
  demo_supervisor: 'supervisor',
  demo_ad: 'ad',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isInitialized: false,

  login: (username: string) => {
    const role = ROLE_MAP[username] ?? null;
    if (role) {
      localStorage.setItem('user', username);
      localStorage.setItem('role', role);
      set({ user: username, role });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    set({ user: null, role: null });
  },

  initialize: () => {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role') as UserRole;
    set({ user, role, isInitialized: true });
  },
}));
