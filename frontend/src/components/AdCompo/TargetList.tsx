import type {Committee, Target} from '@/types/targets';
import React from 'react';

interface TargetListProps {
  targets: Target[];
  loading: boolean;
  committee?: Committee;
  year: number;
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const TargetList: React.FC<TargetListProps> = ({
  targets,
  loading,
  committee,
  year,
}) => {
  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (targets.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>
        No targets found for {committee?.name} in {year}-{year + 1}
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>
        Existing Targets - {committee?.name} ({year}-{year + 1})
      </h2>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Month
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Checkpost
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Market Fee Target
              </th>

              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Set By
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Notes
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {targets.map((target) => (
              <tr key={target.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {MONTH_NAMES[target.month - 1]}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {target.checkpost?.name || 'Committee Level'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  ₹{target.marketFeeTarget.toLocaleString()}
                </td>

                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {target.setBy}
                </td>
                <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                  {target.notes || 'No notes'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
