import type {Committee, MonthlyTarget, Target} from '@/types/targets';
import React, {useState, useEffect} from 'react';

interface TargetFormProps {
  committee: Committee;
  year: number;
  currentUser: string;
  existingTarget: Target;
  onSave: (targets: Omit<Target, 'id'>[]) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const MONTHS = [
  {value: 1, label: 'Jan'},
  {value: 2, label: 'Feb'},
  {value: 3, label: 'Mar'},
  {value: 4, label: 'Apr'},
  {value: 5, label: 'May'},
  {value: 6, label: 'Jun'},
  {value: 7, label: 'Jul'},
  {value: 8, label: 'Aug'},
  {value: 9, label: 'Sep'},
  {value: 10, label: 'Oct'},
  {value: 11, label: 'Nov'},
  {value: 12, label: 'Dec'},
];

export const TargetForm: React.FC<TargetFormProps> = ({
  committee,
  year,
  currentUser,
  existingTarget,
  onSave,
  onCancel,
  loading,
}) => {
  const [monthlyTargets, setMonthlyTargets] = useState<MonthlyTarget[]>([]);
  const [totalMarketFee, setTotalMarketFee] = useState<number>(0);
  const [totalValueTarget, setTotalValueTarget] = useState<number>(0);
  const [selectedCheckpost, setSelectedCheckpost] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    const zeroTargets = MONTHS.map((month) => ({
      month: month.value,
      marketFeeTarget: 0,
      totalValueTarget: 0,
    }));

    setMonthlyTargets(zeroTargets);
    updateTotals(zeroTargets);
  }, [committee.id]);

  const updateTotals = (targets: MonthlyTarget[]) => {
    const marketFeeSum = targets.reduce(
      (sum, target) => sum + target.marketFeeTarget,
      0
    );
    const totalValueSum = targets.reduce(
      (sum, target) => sum + target.totalValueTarget,
      0
    );
    setTotalMarketFee(marketFeeSum);
    setTotalValueTarget(totalValueSum);
  };

  const handleMonthlyTargetChange = (
    month: number,
    field: keyof MonthlyTarget,
    value: number
  ) => {
    const updated = monthlyTargets.map((target) =>
      target.month === month ? {...target, [field]: value} : target
    );
    setMonthlyTargets(updated);
    updateTotals(updated);
  };

  const handleTotalMarketFeeChange = (newTotal: number) => {
    const perMonth = newTotal / 12;
    const updated = monthlyTargets.map((target) => ({
      ...target,
      marketFeeTarget: perMonth,
    }));
    setMonthlyTargets(updated);
    setTotalMarketFee(newTotal);
  };

  const handleTotalValueTargetChange = (newTotal: number) => {
    const perMonth = newTotal / 12;
    const updated = monthlyTargets.map((target) => ({
      ...target,
      totalValueTarget: perMonth,
    }));
    setMonthlyTargets(updated);
    setTotalValueTarget(newTotal);
  };

  const handleSave = async () => {
    const targets: Omit<Target, 'id'>[] = monthlyTargets.map(
      (monthlyTarget) => ({
        year,
        month: monthlyTarget.month,
        committeeId: committee.id,
        checkpostId: selectedCheckpost || undefined,
        marketFeeTarget: monthlyTarget.marketFeeTarget,
        totalValueTarget: monthlyTarget.totalValueTarget,
        setBy: currentUser,
        notes,
      })
    );

    await onSave(targets);
  };

  // Helper function to format value for display
  const formatInputValue = (value: number): string => {
    return value === 0 ? '' : value.toString();
  };

  // Helper function to handle input focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className='bg-gray-50 p-6 rounded-lg mb-6'>
      <h2 className='text-xl font-semibold mb-4'>
        Set Targets for {committee.name} - {year}-{year + 1}
      </h2>

      {/* Checkpost Selection */}
      {committee.checkposts?.length > 0 && (
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Checkpost (Optional)
          </label>
          <select
            value={selectedCheckpost}
            onChange={(e) => setSelectedCheckpost(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value=''>Committee Level (All Checkposts)</option>
            {committee.checkposts.map((checkpost) => (
              <option key={checkpost.id} value={checkpost.id}>
                {checkpost.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Total Targets */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Total Market Fee Target
          </label>
          <input
            type='number'
            step='0.01'
            value={formatInputValue(totalMarketFee)}
            onChange={(e) =>
              handleTotalMarketFeeChange(parseFloat(e.target.value) || 0)
            }
            onFocus={handleInputFocus}
            placeholder='0'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Total Value Target
          </label>
          <input
            type='number'
            step='0.01'
            value={formatInputValue(totalValueTarget)}
            onChange={(e) =>
              handleTotalValueTargetChange(parseFloat(e.target.value) || 0)
            }
            onFocus={handleInputFocus}
            placeholder='0'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {/* Monthly Targets */}
      <div className='mb-6'>
        <h3 className='text-lg font-medium mb-4'>Monthly Targets</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {MONTHS.map((month) => {
            const monthlyTarget = monthlyTargets.find(
              (t) => t.month === month.value
            );
            return (
              <div
                key={month.value}
                className='border border-gray-200 rounded-lg p-4'>
                <h4 className='font-medium text-gray-800 mb-2'>
                  {month.label}
                </h4>
                <div className='space-y-2'>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>
                      Market Fee Target
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      value={formatInputValue(
                        monthlyTarget?.marketFeeTarget || 0
                      )}
                      onChange={(e) =>
                        handleMonthlyTargetChange(
                          month.value,
                          'marketFeeTarget',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      onFocus={handleInputFocus}
                      placeholder='0'
                      className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>
                      Total Value Target
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      value={formatInputValue(
                        monthlyTarget?.totalValueTarget || 0
                      )}
                      onChange={(e) =>
                        handleMonthlyTargetChange(
                          month.value,
                          'totalValueTarget',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      onFocus={handleInputFocus}
                      placeholder='0'
                      className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Add any additional notes...'
        />
      </div>

      {/* Action Buttons */}
      <div className='flex gap-2'>
        <button
          onClick={handleSave}
          disabled={loading}
          className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed'>
          {loading ? 'Saving...' : 'Save Targets'}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed'>
          Cancel
        </button>
      </div>
    </div>
  );
};
