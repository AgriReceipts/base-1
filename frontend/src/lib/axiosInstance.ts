import axios, {isAxiosError} from 'axios';
import {useAuthStore} from '@/stores/authStore';
import {toast} from 'react-hot-toast';
import type {Target, TargetType} from '@/types/targets';

// Updated to work with HttpOnly cookies instead of localStorage tokens
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL, // This should point to backend
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is crucial for HttpOnly cookies
});

// Remove the request interceptor since we no longer need to set Authorization headers
// The browser will automatically include HttpOnly cookies with each request

// Updated response interceptor to handle session expiration
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginPage = window.location.pathname === '/login';

    // Handle 401 Unauthorized responses (session expired or invalid)
    if (err.response?.status === 401 && !isLoginPage) {
      toast.error('Session expired. Please log in again.');

      // Call the store's logout method which will clear cookies on the server
      useAuthStore.getState().logout();

      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

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
