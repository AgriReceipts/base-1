const LoginHeroSection = () => {
  return (
    <div className='hidden lg:flex flex-col justify-center'>
      <div className='max-w-md'>
        {/* Title at top left */}
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>
          AMC Receipt System
        </h1>

        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          Digital Receipt Management, Simplified.
        </h2>

        <p className='text-lg text-gray-600 mb-6'>
          Secure, efficient, and transparent management of agricultural market
          committee trade receipts.
        </p>

        <ul className='space-y-4 mb-8'>
          <li className='flex items-start'>
            <span className='mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-1'>
              ✓
            </span>
            <div>
              <h3 className='font-medium text-gray-800'>
                Receipt Entry & Validation
              </h3>
              <p className='text-gray-600'>
                Digital entry of trade receipts with instant validation.
              </p>
            </div>
          </li>

          <li className='flex items-start'>
            <span className='mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-1'>
              ✓
            </span>
            <div>
              <h3 className='font-medium text-gray-800'>
                Analytics & Insights
              </h3>
              <p className='text-gray-600'>
                Comprehensive analytics and trader performance tracking.
              </p>
            </div>
          </li>

          <li className='flex items-start'>
            <span className='mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-1'>
              ✓
            </span>
            <div>
              <h3 className='font-medium text-gray-800'>Role-Based Access</h3>
              <p className='text-gray-600'>
                Secure access for DEOs, Supervisors, and Directors.
              </p>
            </div>
          </li>

          <li className='flex items-start'>
            <span className='mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-1'>
              ✓
            </span>
            <div>
              <h3 className='font-medium text-gray-800'>User Management</h3>
              <p className='text-gray-600'>
                Complete system administration and role management.
              </p>
            </div>
          </li>
        </ul>

        <div className='bg-blue-50 p-4 rounded-lg border border-blue-100'>
          <h3 className='font-bold text-gray-800 mb-3'>
            Demo Login Credentials
          </h3>
          <ul className='space-y-2 text-sm'>
            <li className='flex items-center'>
              <span className='font-medium w-40'>DEO (Tuni Committee):</span>
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
              <span className='font-medium w-40'>Secretary (Pithapuram):</span>
              <span className='font-mono bg-blue-100 px-2 py-1 rounded'>
                secretary_pithapuram
              </span>
            </li>
            <li className='flex items-center'>
              <span className='font-medium w-40'>Assistant Director:</span>
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
      </div>
    </div>
  );
};

export default LoginHeroSection;
