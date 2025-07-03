import React, {useState, useCallback, useEffect, memo} from 'react';
import {FiSearch, FiFilter, FiDownload, FiPrinter} from 'react-icons/fi';
import AreaChartComponent from '../supervisorcomponents/AreaChartComponent';
import PieChartComponent from '../supervisorcomponents/PieChartComponent';
import {useAuthStore} from '@/stores/authStore';
import api from '@/lib/axiosInstance';

// Memoize chart components to prevent unnecessary re-renders
const MemoizedAreaChartComponent = memo(AreaChartComponent);
const MemoizedPieChartComponent = memo(PieChartComponent);

export default function TraderAnalysis() {
  const {committee} = useAuthStore();
  const [commoditiesData, setCommoditiesData] = useState([]);
  const [marketFeeData, setMarketFeesData] = useState([]);

  // Mock data for traders - consider fetching this from an API as well
  const traders = [
    {
      id: 1,
      name: 'John Doe',
      volume: '$12,450',
      compliance: '95%',
      lastActive: '2 days ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      volume: '$8,720',
      compliance: '89%',
      lastActive: '1 week ago',
    },
    {
      id: 3,
      name: 'Robert Johnson',
      volume: '$15,230',
      compliance: '92%',
      lastActive: '3 days ago',
    },
    {
      id: 4,
      name: 'Emily Davis',
      volume: '$6,540',
      compliance: '87%',
      lastActive: '5 days ago',
    },
    {
      id: 5,
      name: 'Michael Wilson',
      volume: '$21,300',
      compliance: '97%',
      lastActive: '1 day ago',
    },
  ];

  // Fetch data using useCallback to memoize the function
  const fetchData = useCallback(async () => {
    if (!committee?.id) {
      console.warn('Committee ID is not available. Skipping data fetch.');
      return;
    }
    try {
      // Fetch commodities analysis and market fee analysis in parallel
      const [commoditiesRes, mfRes] = await Promise.all([
        api.get(`/analytics/commodityAnalysis/${committee.id}`),
        api.get('/analytics/marketFeeAnalysis'),
      ]);
      setCommoditiesData(commoditiesRes.data.data || []);
      setMarketFeesData(mfRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      // Implement user-friendly error notification here (e.g., a toast message)
    }
  }, [committee?.id]); // Dependency array ensures fetchData only changes if committee.id changes

  // useEffect to call fetchData when the component mounts or fetchData changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // The component's JSX must be inside the return statement
  return (
    <div className='p-6 bg-gray-50 min-h-screen w-full'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
        <h2 className='text-3xl font-bold text-gray-800 mb-4 md:mb-0'>
          Trader Analysis
        </h2>
        {/* Potentially add global actions or filters here if needed */}
      </div>

      <hr className='my-6 border-gray-200' />

      {/* Chart Component Section */}
      <div className='mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-4'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          Overall Market Trends
        </h3>
        <div className='h-72 md:h-96'>
          <MemoizedAreaChartComponent /> {/* Using memoized component */}
        </div>
      </div>

      <hr className='my-6 border-gray-200' />

      {/* Pie Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            Top Commodities by Volume
          </h3>
          <div className='h-64 md:h-80 flex items-center justify-center'>
            {commoditiesData.length > 0 ? (
              <MemoizedPieChartComponent data={commoditiesData} />
            ) : (
              <p className='text-gray-500'>No commodity data available.</p>
            )}
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            Market Fee Analysis by Location
          </h3>
          <div className='h-64 md:h-80 flex items-center justify-center'>
            {marketFeeData.length > 0 ? (
              <MemoizedPieChartComponent data={marketFeeData} />
            ) : (
              <p className='text-gray-500'>No market fee data available.</p>
            )}
          </div>
        </div>
      </div>

      <hr className='my-6 border-gray-200' />

      {/* Traders Table Section */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between'>
          <div className='relative mb-4 md:mb-0 md:w-64'>
            <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search traders...'
              className='pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <div className='flex flex-wrap gap-2'>
            <button className='flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out'>
              <FiDownload className='mr-2' />
              Export
            </button>
            <button className='flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out'>
              <FiPrinter className='mr-2' />
              Print
            </button>
            <button className='flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out'>
              <FiFilter className='mr-2' />
              Filters
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Trader
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Volume
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Compliance
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Last Active
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {traders.map((trader) => (
                <tr key={trader.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium'>
                        {trader.name.charAt(0)}
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {trader.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          ID: {trader.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {trader.volume}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        parseFloat(trader.compliance) > 90
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {trader.compliance}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {trader.lastActive}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <button className='text-blue-600 hover:text-blue-900 mr-3 transition duration-150 ease-in-out'>
                      View
                    </button>
                    <button className='text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out'>
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between'>
          <div className='text-sm text-gray-700 mb-4 md:mb-0'>
            Showing <span className='font-medium'>1</span> to{' '}
            <span className='font-medium'>5</span> of{' '}
            <span className='font-medium'>24</span> results
          </div>
          <div className='flex space-x-2'>
            <button className='px-3 py-1 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out'>
              Previous
            </button>
            <button className='px-3 py-1 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out'>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
