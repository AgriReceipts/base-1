import React, {useMemo} from 'react';
import {Trash2} from 'lucide-react';
import {TargetType, type Committee, type Target} from '@/types/targets';
import {TargetTypeName} from '@/types/targets'; // Assuming you have this mapping
import {formatMoney} from '@/lib/helpers';

interface TargetListProps {
  targets: Target[];
  loading: boolean;
  committee?: Committee;
  year: number;
  type: TargetType;
  deleteTarget: (id: string) => Promise<void>;
}

// Helper function to format a number into Indian currency format (INR)
const formatCurrency = (value: string | number) => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numberValue)) {
    return '₹ 0.00'; // Return a default value for invalid numbers
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

// Helper to get month name from a 1-indexed month number
const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('en-US', {month: 'long'});
};

// --- Summary Sub-Component ---
// This component calculates and displays the aggregated totals.
const TargetSummary: React.FC<{targets: Target[]; displayName: string}> = ({
  targets,
  displayName,
}) => {
  const summary = useMemo(() => {
    // 1. Calculate the overall total by summing all targets.
    const overallTotal = targets.reduce((acc, target) => {
      const value = parseFloat(String(target.marketFeeTarget));
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

    // 2. Group and sum targets by each unique checkpost ID.
    const checkpostTotals = targets.reduce<
      Record<string, {name: string; total: number}>
    >((acc, target) => {
      if (target.checkpost?.id) {
        if (!acc[target.checkpost.id]) {
          acc[target.checkpost.id] = {name: target.checkpost.name, total: 0};
        }
        const value = parseFloat(String(target.marketFeeTarget));
        if (!isNaN(value)) {
          acc[target.checkpost.id].total += value;
        }
      }
      return acc;
    }, {});

    return {overallTotal, checkpostTotals: Object.values(checkpostTotals)};
  }, [targets]);

  return (
    <div className='mb-6 p-4 bg-gray-50 rounded-lg border'>
      <h3 className='text-lg font-semibold text-gray-700 mb-3'>
        Targets Summary
      </h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Overall Target Card */}
        <div className='bg-blue-100 border border-blue-200 p-4 rounded-lg shadow-sm'>
          <p className='text-sm font-medium text-blue-800'>{`Overall ${displayName} Target`}</p>
          <p className='text-2xl font-bold text-blue-900 mt-1'>
            {formatMoney(summary.overallTotal)}
          </p>
        </div>

        {/* Individual Checkpost Target Cards */}
        {summary.checkpostTotals.map((cp) => (
          <div
            key={cp.name}
            className='bg-green-100 border border-green-200 p-4 rounded-lg shadow-sm'>
            <p className='text-sm font-medium text-green-800'>
              {cp.name} Target
            </p>
            <p className='text-2xl font-bold text-green-900 mt-1'>
              {formatCurrency(cp.total)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Updated TargetList Component ---
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

  // Create a display-friendly name for the target type
  const typeDisplayName = TargetTypeName[type] || 'Targets';

  return (
    <div className='mt-8'>
      <div className='mb-4 p-4 bg-blue-100/40 rounded-lg border border-blue-300'>
        <h2 className='text-xl font-bold text-gray-800'>
          {typeDisplayName} Targets {committee ? `for ${committee.name}` : ''}
        </h2>
        <p className='text-md text-gray-600'>
          Financial Year: {year} - {year + 1}
        </p>
      </div>

      {/* Conditionally render the entire content based on whether targets exist */}
      {!targets.length ? (
        <div className='text-center p-10 border-2 border-dashed rounded-lg mt-4 bg-gray-50'>
          <h3 className='text-lg font-semibold text-gray-700'>
            No Targets Found
          </h3>
          <p className='text-gray-500 mt-2'>
            There are no targets set for the selected criteria.
          </p>
        </div>
      ) : (
        <>
          {/* Render the new summary component here */}
          <TargetSummary targets={targets} displayName={typeDisplayName} />

          {/* Render the detailed table */}
          <div className='overflow-x-auto bg-white rounded-lg shadow'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-green-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Month
                  </th>
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
                    {type === TargetType.CHECKPOST && (
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {target.checkpost?.name || 'N/A'}
                        </div>
                      </td>
                    )}
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-800 font-semibold'>
                        {formatCurrency(target.marketFeeTarget)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {target.setBy}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {new Date(
                          target.updatedAt || Date.now()
                        ).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
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
        </>
      )}
    </div>
  );
};
