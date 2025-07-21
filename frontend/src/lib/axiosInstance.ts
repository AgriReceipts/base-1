import axios, {isAxiosError} from 'axios';
import {useAuthStore} from '@/stores/authStore';
import {toast} from 'react-hot-toast';
import type {Target, TargetType} from '@/types/targets';

// Create the axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for HttpOnly cookies (both session and CSRF secret)
});

/**
 * Initializes the API client by fetching the CSRF token from the health endpoint.
 * This token is then set as a default header for all subsequent requests.
 *
 * This function should be called once when the application starts up.
 * For example, in your main App component's useEffect hook.
 */
export const initializeApi = async () => {
  try {
    // Make a request to the public health endpoint to get the CSRF token
    const {data} = await api.get('/health');
    const csrfToken = data.csrfToken;

    if (csrfToken) {
      console.log('CSRF token received and set.');
      // Set the CSRF token as a default header for the axios instance.
      // Axios will now automatically send this header with every request.
      api.defaults.headers.common['x-csrf-token'] = csrfToken;
    } else {
      console.error('CSRF token was not provided by the server.');
    }
  } catch (error) {
    console.error('Failed to initialize API and fetch CSRF token:', error);
    toast.error(
      'Could not establish a secure connection. Please refresh the page.'
    );
  }
};

// The response interceptor remains the same. It handles session expiration.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginPage = window.location.pathname === '/login';

    if (err.response?.status === 401 && !isLoginPage) {
      toast.error('Session expired. Please log in again.');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    // Also handle CSRF failure specifically if you want a custom message
    if (err.response?.status === 403) {
      toast.error('Security token mismatch. Please refresh and try again.');
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
