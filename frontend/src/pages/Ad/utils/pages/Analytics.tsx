import React from 'react';
import { BarChart3, TrendingUp, Target, DollarSign } from 'lucide-react';
import type { Receipt, Target as TargetType } from '../types';
import { committees, months } from '../data/committees';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Analytics: React.FC = () => {
  const [receipts] = useLocalStorage<Receipt[]>('receipts', []);
  const [targets] = useLocalStorage<TargetType[]>('targets', []);
  const [selectedMonth, setSelectedMonth] = React.useState<string>('May');

  // Calculate market fee analytics with filters
  const marketFeeReceipts = receipts.filter(r => r.natureOfReceipt === 'mf');

  // Filtered by month and year for achieved calculation
  const analytics = committees.map(committee => {
    const committeeReceipts = marketFeeReceipts.filter(r => r.committeeId === committee.id);
    const monthIndex = months.indexOf(selectedMonth);
    const cumulativeMonths = monthIndex >= 0 ? months.slice(0, monthIndex + 1) : [selectedMonth];
    const achieved = committeeReceipts.filter(r => r.financialYear === '2024-25' && cumulativeMonths.includes(new Date(r.date).toLocaleString('default', { month: 'long' })))
      .reduce((sum, r) => sum + r.marketFee, 0);
    const target = targets.find(t => t.committeeId === committee.id && t.financialYear === '2024-25')?.monthlyTargets
      ? cumulativeMonths.reduce((sum, month) => {
          const t = targets.find(t => t.committeeId === committee.id && t.financialYear === '2024-25');
          return sum + (t?.monthlyTargets[month] || 0);
        }, 0)
      : 0;
    const percentage = target > 0 ? (achieved / target) * 100 : 0;
    return {
      committee,
      target,
      achieved,
      percentage,
      receiptCount: committeeReceipts.filter(r => r.financialYear === '2024-25' && cumulativeMonths.includes(new Date(r.date).toLocaleString('default', { month: 'long' }))).length,
    };
  });

  const totalCollected2024 = analytics.reduce((sum, a) => sum + a.target, 0);
  const totalCollected2025 = analytics.reduce((sum, a) => sum + a.target, 0);
  const totalReceipts = marketFeeReceipts.length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="w-6 h-6 text-purple-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Market Fee Analytics</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Collected (2025-26)</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalCollected2025.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Target (2025-26)</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalCollected2025.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth from 2024-25</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCollected2024 > 0 ? 
                  `${(((totalCollected2025 - totalCollected2024) / totalCollected2024) * 100).toFixed(1)}%` : 
                  'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Receipts</p>
              <p className="text-2xl font-bold text-gray-900">{totalReceipts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Committee-wise Analytics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6 justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Committee-wise Performance</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Committee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Achieved 2024-25
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Achievement %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipts
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.map((item) => (
                <tr key={item.committee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.committee.name}</div>
                    <div className="text-sm text-gray-500">{item.committee.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{item.target.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{item.achieved.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.percentage >= 100 ? 'bg-green-600' :
                            item.percentage >= 75 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.receiptCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Comparison Chart</h3>
        <div className="space-y-4">
          {analytics.map((item) => (
            <div key={item.committee.id} className="flex items-center space-x-4">
              <div className="w-48 text-sm font-medium text-gray-700 truncate">
                {item.committee.name}
              </div>
              <div className="flex-1 flex space-x-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>2024-25</span>
                    <span>₹{item.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ 
                        width: `${item.target > 0 ? Math.min((item.achieved / item.target) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>2025-26</span>
                    <span>₹{item.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ 
                        width: `${item.target > 0 ? Math.min((item.achieved / item.target) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;