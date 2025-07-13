import type {Committee, Target} from '@/types/targets';
import {Trash} from 'lucide-react';
import React from 'react';

interface TargetListProps {
  targets: Target[];
  loading: boolean;
  committee?: Committee;
  selectedCheckpost: string; // ✅ Added selectedCheckpost prop
  year: number;
  deleteTarget: (id: string) => void;
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
  selectedCheckpost, // ✅ Destructure selectedCheckpost
  year,
  deleteTarget,
}) => {
  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  // ✅ Filter targets based on selectedCheckpost
  const filteredTargets = selectedCheckpost
    ? targets.filter((target) => target.checkpost?.id === selectedCheckpost)
    : targets;

  // ✅ Get committee-level targets (those without a specific checkpost)
  const committeeLevelTargets = targets.filter((target) => !target.checkpost);

  // ✅ When filtering by checkpost, combine checkpost-specific targets with committee-level targets
  const displayTargets = selectedCheckpost
    ? [...filteredTargets, ...committeeLevelTargets]
    : targets;

  // ✅ Check if we have checkpost-specific targets when filtering
  const hasCheckpostTargets = selectedCheckpost
    ? filteredTargets.length > 0
    : true;
  const checkpostName = selectedCheckpost
    ? committee?.checkposts?.find((cp) => cp.id === selectedCheckpost)?.name
    : null;

  if (displayTargets.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>
        No targets found for {committee?.name}
        {checkpostName && ` - ${checkpostName}`} in {year}-{year + 1}
      </div>
    );
  }

  // ✅ Get display name for header
  const getDisplayName = () => {
    if (selectedCheckpost) {
      const checkpostName = committee?.checkposts?.find(
        (cp) => cp.id === selectedCheckpost
      )?.name;
      return `${committee?.name} - ${checkpostName}`;
    }
    return committee?.name;
  };

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>
        Existing Targets - {getDisplayName()} ({year}-{year + 1})
      </h2>

      {/* ✅ Show message when no checkpost-specific targets found */}
      {selectedCheckpost && !hasCheckpostTargets && (
        <div className='mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded'>
          No specific targets found for {checkpostName}. Showing committee-level
          targets below.
        </div>
      )}

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
                Actions
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Notes
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {displayTargets.map((target) => (
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
                <td px-6 py-4 whitespace-nowrap text-sm text-gray-500>
                  <Trash
                    className='text-red-500 ml-5 cursor-pointer'
                    onClick={() => target.id && deleteTarget(target.id)}
                  />
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
