import React, { useState } from 'react';
import axios from 'axios';
import { FiUser, FiLock, FiMail, FiBriefcase, FiUsers, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'deo',
    designation: '',
    committeeName: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const roles = [
    { value: 'deo', label: 'Data Entry Operator' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'ad', label: 'Administrator' },
  ];

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token missing');

      const payload = { ...formData };
      if (payload.role === 'ad') delete payload.committeeName;

      await axios.post('http://localhost:3000/api/auth/register', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ text: 'User registered successfully!', type: 'success' });
      setFormData({
        username: '',
        password: '',
        name: '',
        role: 'deo',
        designation: '',
        committeeName: '',
      });
      setTouched({});
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const isFormValid = () => {
    return (
      formData.username.trim() !== '' &&
      formData.password.length >= 6 &&
      formData.name.trim() !== '' &&
      formData.designation.trim() !== '' &&
      (formData.role === 'ad' || formData.committeeName.trim() !== '')
    );
  };

  return (
    <div className="w-full mx-8 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">User Registration</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Create new system accounts with appropriate permissions
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <FiCheckCircle className="mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="mt-0.5 mr-3 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  Username
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => handleBlur('username')}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  required
                />
              </div>
              {touched.username && !formData.username && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <FiInfo className="mr-1" /> Username is required
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  Password
                  <span className="text-red-500 ml-1">*</span>
                  <span className="text-xs text-gray-500 ml-auto">(min 6 characters)</span>
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  minLength={6}
                  required
                />
              </div>
              {touched.password && formData.password.length < 6 && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <FiInfo className="mr-1" /> Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  required
                />
              </div>
              {touched.name && !formData.name && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <FiInfo className="mr-1" /> Full name is required
                </p>
              )}
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  Designation
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase className="text-gray-400" />
                </div>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  onBlur={() => handleBlur('designation')}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  required
                />
              </div>
              {touched.designation && !formData.designation && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <FiInfo className="mr-1" /> Designation is required
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  Role
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Committee Name (conditionally rendered) */}
            {formData.role !== 'ad' && (
              <div className="space-y-2">
                <label htmlFor="committeeName" className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center">
                    Committee Name
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="text-gray-400" />
                  </div>
                  <input
                    id="committeeName"
                    type="text"
                    name="committeeName"
                    value={formData.committeeName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('committeeName')}
                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    required={formData.role !== 'ad'}
                  />
                </div>
                {touched.committeeName && !formData.committeeName && (
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <FiInfo className="mr-1" /> Committee name is required
                  </p>
                )}
              </div>
            )}

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className={`w-full max-w-md mx-auto flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
                  loading ? 'bg-blue-400' : 
                  !isFormValid() ? 'bg-gray-400 cursor-not-allowed' : 
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering User...
                  </>
                ) : (
                  'Register User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;