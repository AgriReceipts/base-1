import React, {useEffect} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AppRouter} from './routes/AppRouter';
import {AuthProvider} from './providers/authProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
