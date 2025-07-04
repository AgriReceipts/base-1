import React, { useState } from 'react';
import { Target, Save, Plus, Edit2 } from 'lucide-react';
import type { Target as TargetType } from '../types';
import { committees, months } from '../data/committees';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TargetManagement: React.FC = () => {
  const [targets, setTargets] = useLocalStorage<TargetType[]>('targets', []);
  const [selectedCommittee, setSelectedCommittee] = useState('');
  const [selectedYear, setSelectedYear] = useState<'2024-25' | '2025-26'>('2025-26');
  const [yearlyTarget, setYearlyTarget] = useState('');
  const [monthlyTargets, setMonthlyTargets] = useState<Record<string, string>>({});
  const [checkpostTargets, setCheckpostTargets] = useState<Record<string, Record<string, string>>>({});
  const [editingTarget, setEditingTarget] = useState<string | null>(null);

  const selectedCommitteeData = committees.find(c => c.id === selectedCommittee);
  const existingTarget = targets.find(t => t.committeeId === selectedCommittee && t.financialYear === selectedYear);

  const handleYearlyTargetChange = (value: string) => {
    setYearlyTarget(value);
    if (value) {
      const monthly = parseFloat(value) / 12;
      const newMonthlyTargets: Record<string, string> = {};
      months.forEach(month => {
        newMonthlyTargets[month] = monthly.toFixed(2);
      });
      setMonthlyTargets(newMonthlyTargets);

      // Update checkpost targets if applicable
      if (selectedCommitteeData?.hasCheckposts) {
        const newCheckpostTargets: Record<string, Record<string, string>> = {};
        selectedCommitteeData.checkposts.forEach(checkpost => {
          newCheckpostTargets[checkpost] = {};
          months.forEach(month => {
            newCheckpostTargets[checkpost][month] = (monthly / selectedCommitteeData.checkposts.length).toFixed(2);
          });
        });
        setCheckpostTargets(newCheckpostTargets);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCommittee || !yearlyTarget) {
      alert('Please select committee and enter yearly target');
      return;
    }

    const monthlyTargetNumbers: Record<string, number> = {};
    months.forEach(month => {
      monthlyTargetNumbers[month] = parseFloat(monthlyTargets[month] || '0');
    });

    const checkpostTargetNumbers: Record<string, Record<string, number>> = {};
    if (selectedCommitteeData?.hasCheckposts) {
      selectedCommitteeData.checkposts.forEach(checkpost => {
        checkpostTargetNumbers[checkpost] = {};
        months.forEach(month => {
          checkpostTargetNumbers[checkpost][month] = parseFloat(checkpostTargets[checkpost]?.[month] || '0');
        });
      });
    }

    const newTarget: TargetType = {
      id: existingTarget?.id || Date.now().toString(),
      committeeId: selectedCommittee,
      financialYear: selectedYear,
      yearlyTarget: parseFloat(yearlyTarget),
      monthlyTargets: monthlyTargetNumbers,
      checkpostTargets: selectedCommitteeData?.hasCheckposts ? checkpostTargetNumbers : undefined,
    };

    if (existingTarget) {
      setTargets(targets.map(t => t.id === existingTarget.id ? newTarget : t));
    } else {
      setTargets([...targets, newTarget]);
    }

    // Reset form
    setSelectedCommittee('');
    setYearlyTarget('');
    setMonthlyTargets({});
    setCheckpostTargets({});
    setEditingTarget(null);

    alert('Target saved successfully!');
  };

  const loadExistingTarget = (target: TargetType) => {
    setSelectedCommittee(target.committeeId);
    setSelectedYear(target.financialYear);
    setYearlyTarget(target.yearlyTarget.toString());
    
    const monthlyTargetStrings: Record<string, string> = {};
    months.forEach(month => {
      monthlyTargetStrings[month] = target.monthlyTargets[month]?.toString() || '0';
    });
    setMonthlyTargets(monthlyTargetStrings);

    if (target.checkpostTargets) {
      const checkpostTargetStrings: Record<string, Record<string, string>> = {};
      Object.keys(target.checkpostTargets).forEach(checkpost => {
        checkpostTargetStrings[checkpost] = {};
        months.forEach(month => {
          checkpostTargetStrings[checkpost][month] = target.checkpostTargets![checkpost][month]?.toString() || '0';
        });
      });
      setCheckpostTargets(checkpostTargetStrings);
    }

    setEditingTarget(target.id);
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Target className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Target Management</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Committee *
              </label>
              <select
                value={selectedCommittee}
                onChange={(e) => setSelectedCommittee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Committee</option>
                {committees.map((committee) => (
                  <option key={committee.id} value={committee.id}>
                    {committee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financial Year *
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as '2024-25' | '2025-26')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yearly Target (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={yearlyTarget}
                onChange={(e) => handleYearlyTargetChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter yearly target"
              />
            </div>
          </div>

          {yearlyTarget && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Targets</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {months.map((month) => (
                    <div key={month}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {month}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={monthlyTargets[month] || ''}
                        onChange={(e) => setMonthlyTargets({
                          ...monthlyTargets,
                          [month]: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {selectedCommitteeData?.hasCheckposts && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Checkpost Targets</h3>
                  {selectedCommitteeData.checkposts.map((checkpost) => (
                    <div key={checkpost} className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3">{checkpost}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {months.map((month) => (
                          <div key={`${checkpost}-${month}`}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {month}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={checkpostTargets[checkpost]?.[month] || ''}
                              onChange={(e) => setCheckpostTargets({
                                ...checkpostTargets,
                                [checkpost]: {
                                  ...checkpostTargets[checkpost],
                                  [month]: e.target.value
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingTarget ? 'Update Target' : 'Save Target'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Targets */}
      {targets.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Targets</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Committee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yearly Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {targets.map((target) => {
                  const committee = committees.find(c => c.id === target.committeeId);
                  return (
                    <tr key={target.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {committee?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {target.financialYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{target.yearlyTarget.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => loadExistingTarget(target)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetManagement;