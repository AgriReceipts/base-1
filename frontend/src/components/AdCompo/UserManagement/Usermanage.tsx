import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {
  FiUser,
  FiLock,
  FiBriefcase,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
} from 'react-icons/fi';
import api from '@/lib/axiosInstance';

// Zod schema for validation
export const RegisterUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Full name is required'),
  role: z.enum(['deo', 'supervisor', 'secretary', 'ad']),
  designation: z.string().min(1, 'Designation is required'),
  committeeName: z.string().optional(),
});

// Infer the type from the schema
type RegisterFormValues = z.infer<typeof RegisterUserSchema>;

// Data for roles and committees
const roles = [
  {value: 'deo', label: 'Data Entry Operator'},
  {value: 'supervisor', label: 'Supervisor'},
  {value: 'secretary', label: 'Secretary'},
  {value: 'ad', label: 'Administrator'},
];

const committeeNames = [
  'Karapa',
  'Kakinada Rural',
  'Pithapuram',
  'Tuni',
  'Prathipadu',
  'Jaggampeta',
  'Peddapuram',
  'Samalkota',
  'Kakinada',
];

const RegisterForm: React.FC = () => {
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {errors, isSubmitting, isValid},
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterUserSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
      name: '',
      role: 'deo',
      designation: '',
      committeeName: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token missing');

      const payload = {...data};
      if (payload.role === 'ad') {
        delete payload.committeeName;
      }

      await api.post('auth/register', payload);

      // MODIFICATION: Display username and password in the success message
      const successText = `User registered! Credentials: Username: ${data.username}, Password: ${data.password}`;
      setMessage({text: successText, type: 'success'});

      reset();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      setMessage({text: errorMsg, type: 'error'});
    }
  };

  return (
    <div className='w-full mx-8 p-4 sm:p-6'>
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='p-6 sm:p-8'>
          <div className='text-center mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800'>
              User Registration
            </h2>
            <p className='text-gray-500 mt-2 text-sm'>
              Create new system accounts with appropriate permissions
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
              {message.type === 'success' ? (
                <FiCheckCircle className='mt-0.5 mr-3 flex-shrink-0' />
              ) : (
                <FiAlertCircle className='mt-0.5 mr-3 flex-shrink-0' />
              )}
              {/* Using a pre-wrap to respect whitespace and line breaks if any */}
              <span className='whitespace-pre-wrap'>{message.text}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Username */}
            <div className='space-y-2'>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700'>
                <span className='flex items-center'>
                  Username<span className='text-red-500 ml-1'>*</span>
                </span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiUser className='text-gray-400' />
                </div>
                <input
                  id='username'
                  type='text'
                  {...register('username')}
                  className='pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm'
                />
              </div>
              {errors.username && (
                <p className='text-xs text-red-600 flex items-center mt-1'>
                  <FiInfo className='mr-1' /> {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'>
                <span className='flex items-center'>
                  Password<span className='text-red-500 ml-1'>*</span>
                  <span className='text-xs text-gray-500 ml-auto'>
                    (min 6 characters)
                  </span>
                </span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiLock className='text-gray-400' />
                </div>
                <input
                  id='password'
                  type='password'
                  {...register('password')}
                  className='pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm'
                />
              </div>
              {errors.password && (
                <p className='text-xs text-red-600 flex items-center mt-1'>
                  <FiInfo className='mr-1' /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className='space-y-2'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'>
                <span className='flex items-center'>
                  Full Name<span className='text-red-500 ml-1'>*</span>
                </span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiUser className='text-gray-400' />
                </div>
                <input
                  id='name'
                  type='text'
                  {...register('name')}
                  className='pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm'
                />
              </div>
              {errors.name && (
                <p className='text-xs text-red-600 flex items-center mt-1'>
                  <FiInfo className='mr-1' /> {errors.name.message}
                </p>
              )}
            </div>

            {/* Designation */}
            <div className='space-y-2'>
              <label
                htmlFor='designation'
                className='block text-sm font-medium text-gray-700'>
                <span className='flex items-center'>
                  Designation<span className='text-red-500 ml-1'>*</span>
                </span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiBriefcase className='text-gray-400' />
                </div>
                <input
                  id='designation'
                  type='text'
                  {...register('designation')}
                  className='pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm'
                />
              </div>
              {errors.designation && (
                <p className='text-xs text-red-600 flex items-center mt-1'>
                  <FiInfo className='mr-1' /> {errors.designation.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className='space-y-2'>
              <label
                htmlFor='role'
                className='block text-sm font-medium text-gray-700'>
                <span className='flex items-center'>
                  Role<span className='text-red-500 ml-1'>*</span>
                </span>
              </label>
              <select
                id='role'
                {...register('role')}
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm'>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Committee Name (conditionally rendered) */}
            {selectedRole !== 'ad' && (
              <div className='space-y-2'>
                <label
                  htmlFor='committeeName'
                  className='block text-sm font-medium text-gray-700'>
                  <span className='flex items-center'>
                    Committee Name<span className='text-red-500 ml-1'>*</span>
                  </span>
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiUsers className='text-gray-400' />
                  </div>
                  <select
                    id='committeeName'
                    {...register('committeeName')}
                    className='pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm'>
                    <option value='' disabled>
                      Select a committee
                    </option>
                    {committeeNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.committeeName && (
                  <p className='text-xs text-red-600 flex items-center mt-1'>
                    <FiInfo className='mr-1' /> {errors.committeeName.message}
                  </p>
                )}
              </div>
            )}

            <div className='md:col-span-2 pt-2'>
              <button
                type='submit'
                disabled={isSubmitting || !isValid}
                className={`w-full max-w-md mx-auto flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
                  isSubmitting
                    ? 'bg-blue-400'
                    : !isValid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                {isSubmitting ? (
                  <>
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
