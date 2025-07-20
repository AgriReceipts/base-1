import {Card, CardContent} from '../../components/ui/Card';
import LoginForm from '../../components/Authcompo/LoginForm';
import {FiShield, FiUsers, FiBarChart, FiFileText} from 'react-icons/fi';
import logo from '../../assets/logo-ap.png';

const LoginPage = () => {
  const features = [
    {
      icon: <FiFileText size={20} />,
      title: 'Receipt Management',
      description: 'Digital entry and validation of trade receipts',
    },
    {
      icon: <FiBarChart size={20} />,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics and performance tracking',
    },
    {
      icon: <FiUsers size={20} />,
      title: 'Role-Based Access',
      description: 'Secure access for DEOs, Supervisors, and Directors',
    },
    {
      icon: <FiShield size={20} />,
      title: 'Secure & Compliant',
      description: 'Complete system administration and audit trails',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center'>
      {/* Header */}
      <header className='bg-white shadow-md border-b border-gray-200 sticky top-0 z-20 w-full'>
        <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-20'>
            <a
              className='flex items-center group'
              href='/'
              aria-label='Go to login'>
              <div className='flex-shrink-0 transition-all duration-200 group-hover:scale-105'>
                <div className='flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl shadow-inner'>
                  <img src={logo} alt='Ap logo' className='h-8 w-auto' />
                </div>
              </div>
              <div className='ml-4'>
                <h1 className='text-xl font-bold text-gray-900 tracking-tight'>
                  AMC Receipt System
                </h1>
                <p className='text-sm text-gray-600 font-medium'>
                  Agricultural Market Committee Receipt Management
                </p>
              </div>
            </a>
          </div>
        </div>
      </header>
      <div className='max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-start py-12 px-2 sm:px-6'>
        {/* Left side - Hero content */}
        <div className='space-y-8 flex flex-col justify-center h-full'>
          <div className='space-y-4'>
            <h1 className='text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight'>
              AMC Receipt
              <span className='text-primary-600 block'>Management System</span>
            </h1>
            <p className='text-xl text-neutral-600 leading-relaxed'>
              Secure, efficient, and transparent management of agricultural
              market committee trade receipts.
            </p>
          </div>

          {/* Features grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border border-neutral-200'>
                <div className='flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg flex-shrink-0'>
                  <div className='text-primary-600'>{feature.icon}</div>
                </div>
                <div className='space-y-1'>
                  <h3 className='font-semibold text-neutral-900 text-sm'>
                    {feature.title}
                  </h3>
                  <p className='text-neutral-600 text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo credentials */}
          {/*
          <Card className='bg-primary-50 border-primary-200'>
            <CardContent className='space-y-3'>
              <div className='bg-blue-50 p-4 rounded-lg border border-blue-100'>
                <h3 className='font-bold text-gray-800 mb-3'>
                  Demo Login Credentials
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center'>
                    <span className='font-medium w-40'>
                      DEO (Tuni Committee):
                    </span>
                    <span className='font-mono bg-blue-100 px-2 py-1 rounded'>
                      deo_tuni
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <span className='font-medium w-40'>
                      Supervisor (Kakinada Rural):
                    </span>
                    <span className='font-mono bg-blue-100 px-2 py-1 rounded'>
                      supervisor_kakinadarural
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <span className='font-medium w-40'>
                      Secretary (Pithapuram):
                    </span>
                    <span className='font-mono bg-blue-100 px-2 py-1 rounded'>
                      secretary_pithapuram
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <span className='font-medium w-40'>
                      Assistant Director:
                    </span>
                    <span className='font-mono bg-blue-100 px-2 py-1 rounded'>
                      ad_user1
                    </span>
                  </li>
                </ul>
                <p className='mt-3 text-xs text-gray-500'>
                  Password for all users:{' '}
                  <span className='font-mono bg-blue-100 px-2 py-1 rounded'>
                    password123
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
          */}
        </div>

        {/* Right side - Login form */}
        <div className='flex items-center justify-center h-full'>
          <div className='w-full max-w-md'>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
