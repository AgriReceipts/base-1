import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {handleJwtLogin} from '../../stores/authStore';
import AuthCard from './AuthCard';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import api from '@/lib/axiosInstance';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const navigate = useNavigate();

  // Reset error when user types again
  useEffect(() => {
    if (error) setError(null);
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic client-side validation
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await api.post('auth/login', {
        username,
        password,
      });
      const result = handleJwtLogin(res.data.token);
      if (result.success) {
        // Login successful
      } else {
        // Handle login error
        // Do not leak error details in production
        setError('Invalid username or password.');
        return;
      }
      localStorage.removeItem('activeNav');

      switch (result.decoded?.role) {
        case 'deo':
          navigate('/deo');
          break;
        case 'supervisor':
          navigate('/supervisor');
          break;
        case 'ad':
          navigate('/ad');
          break;
        case 'secretary':
          navigate('/secretary');
          break;

        default:
          navigate('/');
          break;
      }
    } catch (err: any) {
      // Always show a generic error message in production
      setError('Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 border border-green-100 shadow-lg rounded-xl p-8 sm:p-10 max-w-md w-full mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-500 text-base">Sign in to your account</p>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6 text-sm"
          role="alert">
          <span className="block sm:inline break-words">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition text-base"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
            autoComplete="username"
          />
        </div>

        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition text-base pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute top-9 right-4 text-gray-400 hover:text-green-700 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
          <div className="flex justify-end mt-1">
            <button
              type="button"
              className="text-xs text-green-600 hover:underline focus:outline-none"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition text-lg ${
            isSubmitting
              ? "opacity-70 cursor-not-allowed"
              : "hover:from-green-600 hover:to-emerald-600"
          }`}>
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center relative border border-green-100">
            <h3 className="text-xl font-bold mb-4 text-green-700">Forgot Password?</h3>
            <p className="text-gray-700 mb-6">Please contact the <span className="font-semibold text-green-700">AD office</span> for password related issues.</p>
            <button
              className="mt-2 px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition focus:outline-none shadow"
              onClick={() => setShowForgotModal(false)}
            >
              Close
            </button>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-green-700 text-2xl focus:outline-none"
              onClick={() => setShowForgotModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
