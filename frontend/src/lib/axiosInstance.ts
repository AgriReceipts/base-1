import axios, {isAxiosError} from 'axios';
import {useAuthStore} from '@/stores/authStore';
import {toast} from 'react-hot-toast';
import type {Target, TargetType} from '@/types/targets';

// Create the axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for HttpOnly cookies (both session and CSRF secret)
});

// Updated response interceptor - only show session expired for authenticated users
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const isLoginPage = window.location.pathname === '/login';
    const authStore = useAuthStore.getState();

    if (err.response?.status === 401 && !isLoginPage) {
      // Only show "session expired" if user was previously authenticated
      // Check if user has any auth data (was logged in before)
      if (authStore.user || authStore.role) {
        toast.error('Session expired. Please log in again.');
        await authStore.logout();
        window.location.href = '/';
      }
      // For users who were never logged in, silently fail - no toast needed
    }

    return Promise.reject(err);
  }
);

// Your other services can now use the 'api' instance without any changes.
// The CSRF token will be attached automatically.

export const targetService = {
  // Get targets for a specific year and committee
  async getTargets({
    year,
    committeeId,
    type,
  }: {
    year: number;
    committeeId?: string;
    type: TargetType;
  }): Promise<Target[]> {
    const response = await api.get('/targets/getTargets', {
      params: {year, committeeId, type},
    });
    return response.data;
  },

  // Set targets (can handle single or multiple targets)
  async setTargets(targets: Omit<Target, 'id'>[]): Promise<Target[]> {
    const response = await api.post(`/targets/setTarget`, targets);
    return response.data.data;
  },

  // Update a specific target
  async updateTarget(id: string, updateData: Partial<Target>): Promise<Target> {
    const response = await api.put(`/targets/updateTarget/${id}`, updateData);
    return response.data.data;
  },

  // Delete a target
  async deleteTarget(id: string): Promise<void> {
    await api.delete(`/targets/deleteTarget/${id}`);
  },
};

export default api;
export {isAxiosError};
