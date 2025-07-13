import {z} from 'zod';
import {create} from 'zustand';
import {jwtDecode} from 'jwt-decode';

// ------------------ Types ------------------

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
  initialize: () => void;
};

// JWT Payload interface to match your actual JWT structure
interface JwtPayload {
  id: string;
  role: UserRole;
  username: string;
  committee?: Committee;
  iat: number;
  exp: number;
}

// ------------------ Zod Schemas ------------------

const UserSchema = z.object({
  name: z.string(),
  designation: z.string(),
});

const CommitteeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// ------------------ Safe Parser ------------------

const safeParseWithSchema = <T,>(
  str: string | null,
  schema: z.ZodSchema<T>,
  label: string
): T | null => {
  try {
    const json = JSON.parse(str || '');
    const result = schema.safeParse(json);
    if (!result.success) {
      console.warn(
        `[AuthStore] ${label} failed schema validation:`,
        result.error.format()
      );
      return null;
    }
    return result.data;
  } catch (err) {
    console.error(`[AuthStore] Failed to parse ${label}:`, str, err);
    return null;
  }
};

// ------------------ Zustand Store ------------------

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  committee: null,
  isInitialized: false,

  login: ({user, role, committee}) => {
    // Note: Storing user data in localStorage for persistence
    // In a real app, you might want to only store the token
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role ?? '');
    if (committee) {
      localStorage.setItem('committee', JSON.stringify(committee));
    } else {
      localStorage.removeItem('committee');
    }
    set({user, role, committee});
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('committee');
    localStorage.removeItem('token'); // Also remove token on logout
    set({user: null, role: null, committee: null});
  },

  initialize: () => {
    try {
      const userStr = localStorage.getItem('user');
      const committeeStr = localStorage.getItem('committee');
      const roleStr = localStorage.getItem('role');

      const user = userStr
        ? safeParseWithSchema(userStr, UserSchema, 'user')
        : null;
      const committee = committeeStr
        ? safeParseWithSchema(committeeStr, CommitteeSchema, 'committee')
        : null;
      const role = (roleStr ?? null) as UserRole;

      set({user, role, committee, isInitialized: true});
    } catch (error) {
      console.error(
        '[AuthStore] Failed to initialize from localStorage. Logging out.',
        error
      );
      useAuthStore.getState().logout();
    }
  },
}));

// ------------------ JWT Login Helper ------------------

export const handleJwtLogin = (token: string) => {
  try {
    // Store the token
    localStorage.setItem('token', token);

    // Decode the JWT
    const decoded = jwtDecode<JwtPayload>(token);

    // Use the store's login method with corrected mapping
    useAuthStore.getState().login({
      user: {
        name: decoded.username, // JWT has 'username'
        designation: decoded.role || 'unknown', // JWT has 'role'
      },
      role: decoded.role,
      committee: decoded.committee ?? null,
    });

    return {success: true, decoded};
  } catch (error) {
    console.error('Failed to process JWT login:', error);
    localStorage.removeItem('token');
    return {success: false, error};
  }
};

// ------------------ Token Validation Helper ------------------

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

// ------------------ Initialize from Token ------------------

export const initializeFromToken = () => {
  const token = localStorage.getItem('token');

  if (token && isTokenValid(token)) {
    handleJwtLogin(token);
  } else {
    // Token is invalid or expired, clean up
    useAuthStore.getState().logout();
  }

  // Mark as initialized regardless
  useAuthStore.setState({isInitialized: true});
};
