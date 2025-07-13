import {FiDollarSign, FiUsers, FiTrendingUp, FiActivity} from 'react-icons/fi';

export function MetricCards() {
  const metrics = [
    {
      title: 'Total Traders',
      value: '1,234',
      icon: <FiUsers size={24} />,
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Committees',
      value: '56',
      icon: <FiActivity size={24} />,
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Monthly Volume',
      value: '$245,231',
      icon: <FiDollarSign size={24} />,
      change: '+8.2%',
      trend: 'up',
    },
    {
      title: 'Avg. Compliance',
      value: '92%',
      icon: <FiTrendingUp size={24} />,
      change: '+2.4%',
      trend: 'up',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-sm font-medium text-gray-500'>
                {metric.title}
              </p>
              <h3 className='text-2xl font-bold mt-1'>{metric.value}</h3>
            </div>
            <div className='p-2 rounded-lg bg-blue-50 text-blue-600'>
              {metric.icon}
            </div>
          </div>
          <div
            className={`mt-4 text-sm flex items-center ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
            {metric.change} from last month
            {metric.trend === 'up' ? (
              <svg
                className='w-4 h-4 ml-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 15l7-7 7 7'
                />
              </svg>
            ) : (
              <svg
                className='w-4 h-4 ml-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
