import {create} from 'zustand';

type UserRole = 'deo' | 'supervisor' | 'ad' | 'secretary' | null;

type AuthState = {
  user: string | null;
  role: UserRole;
  committee: string | null;
  isInitialized: boolean;
  login: (payload: {
    username: string;
    role: UserRole;
    committee: string | null;
  }) => void;
  logout: () => void;
  initialize: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  committee: null,
  isInitialized: false,

  login: ({username, role, committee}) => {
    localStorage.setItem('user', username);
    localStorage.setItem('role', role ?? '');
    if (committee) localStorage.setItem('committee', committee);
    else localStorage.removeItem('committee');
    set({user: username, role, committee});
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('committee');
    set({user: null, role: null, committee: null});
  },

  initialize: () => {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role') as UserRole;
    const committee = localStorage.getItem('committee');
    set({user, role, committee, isInitialized: true});
  },
}));
