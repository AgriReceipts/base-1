import React from 'react';
import {Trash2} from 'lucide-react';
import {TargetType, type Committee, type Target} from '@/types/targets';
import {TargetTypeName} from '@/types/targets'; // Assuming you have this mapping

interface TargetListProps {
  targets: Target[];
  loading: boolean;
  committee?: Committee;
  year: number;
  type: TargetType;
  deleteTarget: (id: string) => Promise<void>;
}

// Helper function to format the 'marketFeeTarget' string into Indian currency format
const formatCurrency = (value: string | number) => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numberValue)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(numberValue);
};

// Helper to get month name from number (1-indexed)
const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('en-US', {month: 'long'});
};

export const TargetList: React.FC<TargetListProps> = ({
  targets,
  loading,
  committee,
  year,
  type,
  deleteTarget,
}) => {
  if (loading) {
    return (
      <div className='flex justify-center items-center p-10'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <p className='ml-4 text-gray-600'>Loading Targets...</p>
      </div>
    );
  }

  if (!targets.length) {
    return (
      <div className='text-center p-10 border-2 border-dashed rounded-lg mt-4 bg-gray-50'>
        <h3 className='text-lg font-semibold text-gray-700'>
          No Targets Found
        </h3>
        <p className='text-gray-500 mt-2'>
          There are no targets set for the selected criteria.
        </p>
      </div>
    );
  }

  // Create a display-friendly name for the target type
  const typeDisplayName = TargetTypeName[type] || 'Targets';

  return (
    <div className='mt-8'>
      <div className='mb-4 p-4 bg-blue-100/40 rounded-lg border border-blue-300'>
        <h2 className='text-xl font-bold text-gray-800'>
          {/* Updated title to be more generic if committee is not present */}
          {typeDisplayName} Targets {committee ? `for ${committee.name}` : ''}
        </h2>
        <p className='text-md text-gray-600'>
          Financial Year: {year} - {year + 1}
        </p>
      </div>

      <div className='overflow-x-auto bg-white rounded-lg shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-green-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Month
              </th>
              {/* Conditionally render Checkpost Name header */}
              {type === TargetType.CHECKPOST && (
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Checkpost Name
                </th>
              )}
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Market Fee Target
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Set By
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Last Updated
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {targets.map((target) => (
              <tr
                key={target.id}
                className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    {getMonthName(target.month)} {target.year}
                  </div>
                </td>
                {/* Conditionally render Checkpost Name data cell */}
                {type === TargetType.CHECKPOST && (
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {target.checkpost?.name || 'N/A'}
                    </div>
                  </td>
                )}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-800'>
                    {formatCurrency(target.marketFeeTarget)}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>{target.setBy}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>
                    {new Date(target.updatedAt || Date.now()).toLocaleString(
                      'en-IN',
                      {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right'>
                  <button
                    onClick={() => deleteTarget(target.id)}
                    className='p-2 text-red-400 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    title='Delete Target'>
                    <Trash2 className='h-5 w-5' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
