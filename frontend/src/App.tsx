//App.tsx
import {BrowserRouter} from 'react-router-dom';
import {AppRouter} from './routes/AppRouter';
import {useEffect} from 'react';
import {useAppStore} from './stores/authStore';
import NotFound from './pages/NotFound';

function App() {
  const {isApiInitialized, initializeApi} = useAppStore();

  useEffect(() => {
    // This runs only once when the app mounts
    initializeApi();
  }, [initializeApi]);
  if (!isApiInitialized) {
    return <NotFound />;
  }
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
