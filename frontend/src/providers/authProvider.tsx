import React, {useEffect, useState} from 'react';
import {useAuthStore, initializeFromToken} from '../stores/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const {isInitialized} = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeFromToken();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (isLoading || !isInitialized) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p>Loading....</p>
        <p className='ml-2'>Initializing...</p>
      </div>
    );
  }

  return <>{children}</>;
};
