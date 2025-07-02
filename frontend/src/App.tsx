import React, {useEffect} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AppRouter} from './routes/AppRouter';
import {jwtDecode} from 'jwt-decode';
import {useAuthStore} from './stores/authStore';

type JwtPayload = {
  id: string;
  username: string;
  role: 'deo' | 'supervisor' | 'ad' | 'secretary';
  committee?: {id: string; name: string};
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        useAuthStore.getState().login({
          username: decoded.username,
          role: decoded.role,
          committee: decoded.committee?.name ?? null,
        });
      } catch (err) {
        console.error('Invalid or expired token');
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
