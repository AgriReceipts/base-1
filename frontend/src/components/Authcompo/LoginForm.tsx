import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {handleJwtLogin} from '../../stores/authStore';
import AuthCard from './AuthCard';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) setError(null);
  }, [username, password]);

  interface LoginResult {
    success: boolean;
    error?: string;
  }

  interface LoginCredentials {
    username: string;
    password: string;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const credentials: LoginCredentials = {username, password};
      const result: LoginResult = await handleJwtLogin(credentials);

      if (result.success) {
        localStorage.removeItem('activeNav');

        // ✅ FIX: Always navigate to '/dashboard' after a successful login.
        // The DashboardPage component will handle rendering the correct view.
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Login failed:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-light text-gray-800 mb-2'>Welcome back</h2>
        <p className='text-gray-500'>Enter your demo credentials to continue</p>
      </div>

      {error && (
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6 text-sm'
          role='alert'>
          <span className='block sm:inline break-words'>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700 mb-1'>
            Username
          </label>
          <input
            id='username'
            type='text'
            className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition duration-200'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='demo_deo, demo_supervisor, or demo_ad'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 mb-1'>
            Password <span className='text-gray-400'>(optional)</span>
          </label>
          <input
            id='password'
            type='password'
            className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition duration-200'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='••••••••'
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 ${
            isSubmitting
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:from-blue-600 hover:to-cyan-600'
          }`}>
          {isSubmitting ? (
            <span className='flex items-center justify-center'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </AuthCard>
  );
};

export default LoginForm;
