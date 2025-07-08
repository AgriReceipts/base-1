import {useTargets} from '@/hooks/useTarget';
import type {Committee, Target} from '@/types/targets';
import React, {useState} from 'react';
import {TargetForm} from './TargetForm';
import {TargetList} from './TargetList';

interface TargetManagerProps {
  committees: Committee[];
  currentUser: string;
}

const MONTHS = [
  {value: 1, label: 'January'},
  {value: 2, label: 'February'},
  {value: 3, label: 'March'},
  {value: 4, label: 'April'},
  {value: 5, label: 'May'},
  {value: 6, label: 'June'},
  {value: 7, label: 'July'},
  {value: 8, label: 'August'},
  {value: 9, label: 'September'},
  {value: 10, label: 'October'},
  {value: 11, label: 'November'},
  {value: 12, label: 'December'},
];

export const TargetManager: React.FC<TargetManagerProps> = ({
  committees,
  currentUser,
}) => {
  const [selectedCommittee, setSelectedCommittee] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [showForm, setShowForm] = useState(false);

  const {targets, loading, error, saveTargets} = useTargets(
    selectedYear,
    selectedCommittee
  );

  const handleCommitteeChange = (committeeId: string) => {
    setSelectedCommittee(committeeId);
    setShowForm(false);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setShowForm(false);
  };

  const handleSaveTargets = async (targetData: Omit<Target, 'id'>[]) => {
    const success = await saveTargets(targetData);
    if (success) {
      setShowForm(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Target Management
        </h1>

        {/* Committee and Year Selection */}
        <div className='flex gap-4 mb-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select Committee
            </label>
            <select
              value={selectedCommittee}
              onChange={(e) => handleCommitteeChange(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option value=''>Select a committee</option>
              {committees.map((committee) => (
                <option key={committee.id} value={committee.id}>
                  {committee.name} ({committee.code})
                </option>
              ))}
            </select>
          </div>

          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Financial Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
              {Array.from({length: 5}, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}-{year + 1}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <button
            onClick={() => setShowForm(true)}
            disabled={!selectedCommittee || !selectedYear}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'>
            Set New Targets
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}

      {/* Target Form */}
      {showForm && selectedCommittee && (
        <TargetForm
          committee={committees.find((c) => c.id === selectedCommittee)!}
          year={selectedYear}
          currentUser={currentUser}
          existingTargets={targets}
          onSave={handleSaveTargets}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      )}

      {/* Target List */}
      {selectedCommittee && !showForm && (
        <TargetList
          targets={targets}
          loading={loading}
          committee={committees.find((c) => c.id === selectedCommittee)}
          year={selectedYear}
        />
      )}
    </div>
  );
};
