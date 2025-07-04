import React, { useState } from 'react';

// Mock data for metrics
const metrics = [
  { label: 'Total Traders', value: 3, color: 'bg-blue-50', text: 'text-blue-700' },
  { label: 'Total Receipts', value: 5, color: 'bg-green-50', text: 'text-green-700' },
  { label: 'Total Value', value: 124000, color: 'bg-yellow-50', text: 'text-yellow-700', isMoney: true },
  { label: 'Avg Market Fees Collected', value: 41333, color: 'bg-purple-50', text: 'text-purple-700', isMoney: true },
];

// Mock data for traders
const mockTraders = [
  {
    id: 1,
    name: 'Babu traders',
    receipts: 2,
    commodities: 2,
    value: 30000,
    monthlyPattern: [
      { month: 'Jan 2025', value: 12000 },
      { month: 'Feb 2025', value: 18000 },
    ],
    traded: ['Onion', 'Urad'],
    lastTransaction: '18/06/2025',
    totalQuantity: 8,
    avgPerReceipt: 16458,
  },
  {
    id: 2,
    name: 'katyayyani',
    receipts: 1,
    commodities: 1,
    value: 0,
    monthlyPattern: [
      { month: 'Mar 2025', value: 0 },
    ],
    traded: ['Maize'],
    lastTransaction: '05/03/2025',
    totalQuantity: 2,
    avgPerReceipt: 0,
  },
  {
    id: 3,
    name: 'srinivas traders',
    receipts: 2,
    commodities: 1,
    value: 94000,
    monthlyPattern: [
      { month: 'Apr 2025', value: 47000 },
      { month: 'May 2025', value: 47000 },
    ],
    traded: ['Rice'],
    lastTransaction: '20/05/2025',
    totalQuantity: 5,
    avgPerReceipt: 47000,
  },
];

function formatLakh(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

export default function TraderAnalysis() {
  const [selectedTrader, setSelectedTrader] = useState<number | null>(null);
  const selected = mockTraders.find(t => t.id === selectedTrader);

  return (
    <div className="w-full p-4 md:p-6">
      {/* Metrics Card Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`${m.color} rounded-lg p-6 flex flex-col items-center shadow-sm border`}
          >
            <div className={`text-2xl font-bold ${m.text}`}>
              {m.isMoney ? formatLakh(m.value) : m.value}
            </div>
            <div className="text-gray-600 text-sm mt-1 text-center">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Trader Directory List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col mb-6">
        <h3 className="text-xl font-bold mb-1">Trader Directory</h3>
        <div className="text-gray-500 text-sm mb-4">Click on a trader to view detailed analytics</div>
        <div className="flex-1 flex flex-col gap-3">
          {mockTraders.map((t) => (
            <button
              key={t.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition bg-white hover:bg-blue-50 ${selectedTrader === t.id ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setSelectedTrader(t.id)}
            >
              <div>
                <div className="font-semibold text-lg text-left">{t.name}</div>
                <div className="text-gray-500 text-sm">{t.receipts} receipts • {t.commodities} commodities</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">{formatLakh(t.value)}</div>
                <div className="text-xs text-gray-500">Total Value</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trader Detailed Analytics Card */}
      {selected && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <span>📈</span> {selected.name} - Detailed Analytics
              </div>
              <div className="text-gray-500 text-sm mt-1">Comprehensive performance analysis for the selected trader</div>
            </div>
            <button
              className="text-xs text-blue-600 underline mt-2 md:mt-0"
              onClick={() => setSelectedTrader(null)}
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-2xl font-bold">{selected.receipts}</div>
              <div className="text-gray-600 text-sm mt-1">Total Receipts</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-2xl font-bold">{formatLakh(selected.value)}</div>
              <div className="text-gray-600 text-sm mt-1">Total Value</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-2xl font-bold">₹{selected.avgPerReceipt}</div>
              <div className="text-gray-600 text-sm mt-1">Avg Market Fees Collected</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-2xl font-bold">{selected.commodities}</div>
              <div className="text-gray-600 text-sm mt-1">Commodities</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Monthly Trading Pattern</div>
              <div className="bg-gray-50 rounded-lg p-4 h-56 flex items-center justify-center">
                {/* Simple mock line chart using SVG for now */}
                <svg width="100%" height="100%" viewBox="0 0 300 180">
                  <polyline
                    fill="none"
                    stroke="#8884d8"
                    strokeWidth="3"
                    points={selected.monthlyPattern.map((d, i) => `${30 + i * 50},${180 - (d.value / 35000) * 160}`).join(' ')}
                  />
                  {selected.monthlyPattern.map((d, i) => (
                    <circle
                      key={d.month}
                      cx={30 + i * 50}
                      cy={180 - (d.value / 35000) * 160}
                      r="4"
                      fill="#8884d8"
                    />
                  ))}
                  {/* X axis labels */}
                  {selected.monthlyPattern.map((d, i) => (
                    <text
                      key={d.month + '-label'}
                      x={30 + i * 50}
                      y={175}
                      fontSize="10"
                      textAnchor="middle"
                      fill="#666"
                    >
                      {d.month.split(' ')[0]}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Commodities Traded</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {selected.traded.map((t) => (
                  <span key={t} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">{t}</span>
                ))}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <b>Last Transaction:</b> {selected.lastTransaction}
              </div>
              <div className="text-sm text-gray-700">
                <b>Total Quantity:</b> {selected.totalQuantity} units
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
