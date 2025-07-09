import axios, {isAxiosError} from 'axios';
import {useAuthStore} from '@/stores/authStore';
import {toast} from 'react-hot-toast';
import type {Target} from '@/types/targets';

//this automatically sets the jwt in the auth header for each request, and also checks for session expiration in each response and logsout the user if the session is expired

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // This should point to backend
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginPage = window.location.pathname === '/login';
    if (err.response?.status === 401 && !isLoginPage) {
      toast.error('Session expired. Please log in again.');
      useAuthStore.getState().logout();
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
  }: {
    year: number;
    committeeId?: string;
  }): Promise<Target[]> {
    const response = await api.get('/targets/getTargets', {
      params: {year, committeeId},
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
