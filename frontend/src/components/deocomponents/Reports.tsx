import {
  FiFileText,
  FiDownload,
  FiCalendar,
  FiChevronDown,
} from 'react-icons/fi';

export default function Reports() {
  const reports = [
    {
      id: 1,
      name: 'Monthly Compliance Report',
      type: 'PDF',
      date: 'Jun 1, 2023',
      size: '2.4 MB',
    },
    {
      id: 2,
      name: 'Trader Activity Summary',
      type: 'Excel',
      date: 'May 1, 2023',
      size: '1.8 MB',
    },
    {
      id: 3,
      name: 'Committee Performance',
      type: 'PDF',
      date: 'Apr 1, 2023',
      size: '3.2 MB',
    },
    {
      id: 4,
      name: 'Quarterly Audit Report',
      type: 'PDF',
      date: 'Mar 15, 2023',
      size: '4.5 MB',
    },
    {
      id: 5,
      name: 'Annual Compliance Review',
      type: 'PDF',
      date: 'Jan 1, 2023',
      size: '5.1 MB',
    },
  ];

  return (
    <div className='w-full p-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
        <h2 className='text-xl font-bold mb-4 md:mb-0'>Reports</h2>
        <button className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
          <FiFileText className='mr-2' />
          Generate New Report
        </button>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between'>
          <div className='mb-4 md:mb-0'>
            <h3 className='font-medium'>All Reports</h3>
            <p className='text-sm text-gray-500'>
              Generated reports and documents
            </p>
          </div>
          <div className='flex space-x-2'>
            <div className='relative'>
              <button className='flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50'>
                <FiCalendar className='mr-2' />
                Last 30 days
                <FiChevronDown className='ml-2' />
              </button>
            </div>
          </div>
        </div>

        <div className='divide-y divide-gray-200'>
          {reports.map((report) => (
            <div
              key={report.id}
              className='p-4 flex flex-col md:flex-row md:items-center md:justify-between'>
              <div className='flex items-start mb-4 md:mb-0'>
                <div className='bg-blue-100 p-3 rounded-lg mr-4'>
                  <FiFileText className='text-blue-600' size={20} />
                </div>
                <div>
                  <h4 className='font-medium'>{report.name}</h4>
                  <div className='flex flex-wrap items-center text-sm text-gray-500 mt-1'>
                    <span className='mr-3'>{report.type}</span>
                    <span className='mr-3'>{report.date}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <button className='flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 self-start md:self-auto'>
                <FiDownload className='mr-2' />
                Download
              </button>
            </div>
          ))}
        </div>

        <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
          <div className='text-sm text-gray-700'>
            Showing <span className='font-medium'>1</span> to{' '}
            <span className='font-medium'>5</span> of{' '}
            <span className='font-medium'>15</span> results
          </div>
          <div className='flex space-x-2'>
            <button className='px-3 py-1 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50'>
              Previous
            </button>
            <button className='px-3 py-1 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50'>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
