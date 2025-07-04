import React, {useState} from 'react';
import PieChartComponent from './PieChartComponent';
import AreaChartComponent from './AreaChartComponent';

// Mock data for line graph (month-wise MF collected)
const mockLineData = [
  {date: 'Jan', mf: 120000},
  {date: 'Feb', mf: 95000},
  {date: 'Mar', mf: 143000},
  {date: 'Apr', mf: 110000},
  {date: 'May', mf: 128000},
  {date: 'Jun', mf: 101000},
];

// Mock data for pie chart (market fees by location)
const mockLocationData = [
  {
    name: 'Office',
    value: 42.95,
  },
  {
    name: 'Checkpost',
    value: 57.05,
  },
  {
    name: 'Other',
    value: 0,
  },
];

const mockOfficeDrilldown = [
  {name: 'Supervisor 1', value: 25},
  {name: 'Supervisor 2', value: 20},
  {name: 'Supervisor 3', value: 10},
];
const mockCheckpostDrilldown = [
  {name: 'Checkpost A', value: 12},
  {name: 'Checkpost B', value: 10},
  {name: 'Checkpost C', value: 8},
];
const mockOtherDrilldown = [
  {name: 'Survey', value: 7},
  {name: 'Mobile Collection', value: 5},
  {name: 'Misc', value: 3},
];

// Mock data for commodity directory
const mockCommodities = [
  {
    name: 'Rice',
    receipts: 4,
    value: 94000,
    commodities: 1,
    monthlyPattern: [
      {month: 'Jan 2025', value: 20000},
      {month: 'Feb 2025', value: 18000},
      {month: 'Mar 2025', value: 22000},
      {month: 'Apr 2025', value: 17000},
      {month: 'May 2025', value: 17000},
    ],
    traded: ['Rice'],
    traders: ['Babu traders', 'katyayyani'],
    lastTransaction: '18/06/2025',
    highestTransaction: 22000,
    totalQuantity: 8,
    avgPerReceipt: 23500,
  },
  {
    name: 'Wheat',
    receipts: 2,
    value: 30000,
    commodities: 1,
    monthlyPattern: [
      {month: 'Jan 2025', value: 15000},
      {month: 'Feb 2025', value: 15000},
    ],
    traded: ['Wheat'],
    lastTransaction: '10/06/2025',
    totalQuantity: 4,
    avgPerReceipt: 15000,
  },
  {
    name: 'Maize',
    receipts: 1,
    value: 12000,
    commodities: 1,
    monthlyPattern: [{month: 'Mar 2025', value: 12000}],
    traded: ['Maize'],
    lastTransaction: '05/03/2025',
    totalQuantity: 2,
    avgPerReceipt: 12000,
  },
  {
    name: 'Tomato',
    receipts: 3,
    value: 15000,
    commodities: 1,
    monthlyPattern: [
      {month: 'Apr 2025', value: 5000},
      {month: 'May 2025', value: 10000},
    ],
    traded: ['Tomato'],
    lastTransaction: '20/05/2025',
    totalQuantity: 5,
    avgPerReceipt: 5000,
  },
  {
    name: 'Onion',
    receipts: 2,
    value: 8000,
    commodities: 1,
    monthlyPattern: [{month: 'Jun 2025', value: 8000}],
    traded: ['Onion'],
    lastTransaction: '18/06/2025',
    totalQuantity: 3,
    avgPerReceipt: 4000,
  },
];

function formatLakh(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

export default function CommitteeAnalysis() {
  // Drilldown state for location pie chart
  const [locationDrill, setLocationDrill] = useState<string | null>(null);
  // Selected commodity for analytics
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(
    null
  );

  // Pie chart data for drilldown
  let locationPieData = mockLocationData;
  let locationPieTitle = 'Market Fees by Location';
  if (locationDrill === 'Office') {
    locationPieData = mockOfficeDrilldown;
    locationPieTitle = 'Office - Supervisor Wise';
  } else if (locationDrill === 'Checkpost') {
    locationPieData = mockCheckpostDrilldown;
    locationPieTitle = 'Checkpost Wise';
  } else if (locationDrill === 'Other') {
    locationPieData = mockOtherDrilldown;
    locationPieTitle = 'Other Collections';
  }

  // Find selected commodity details
  const selected = mockCommodities.find((c) => c.name === selectedCommodity);

  return (
    <div className='w-full p-4 md:p-6'>
      {/* Line Graph - full width, top */}
      <div className='mb-8'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-full'>
          <div className='h-64 md:h-80 w-full flex items-center justify-center'>
            <AreaChartComponent />
          </div>
        </div>
      </div>

      {/* Main content: Pie chart and Commodity Directory */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        {/* Market Fees by Location Pie Chart */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-lg font-semibold'>{locationPieTitle}</h3>
            {locationDrill && (
              <button
                className='text-xs text-blue-600 underline'
                onClick={() => setLocationDrill(null)}>
                Back
              </button>
            )}
          </div>
          <div className='h-64 md:h-80 cursor-pointer'>
            <PieChartComponent
              data={locationPieData.map((d) => {
                let color = '#8884d8';
                if (d.name === 'Office') color = '#2563eb'; // blue
                else if (d.name === 'Checkpost') color = '#22c55e'; // green
                else if (d.name === 'Other') color = '#f59e42'; // orange
                return {...d, color};
              })}
              onClickData={(onClickData) => {
                if (
                  !locationDrill &&
                  ['Office', 'Checkpost', 'Other'].includes(onClickData.name)
                ) {
                  setLocationDrill(onClickData.name);
                }
              }}
            />
          </div>
        </div>

        {/* Commodity Directory List */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col'>
          <h3 className='text-xl font-bold mb-1'>Commodity Directory</h3>
          <div className='text-gray-500 text-sm mb-4'>
            Click on a commodity to view detailed analytics
          </div>
          <div className='flex-1 flex flex-col gap-3'>
            {mockCommodities.slice(0, 4).map((c) => (
              <button
                key={c.name}
                className={`flex items-center justify-between p-4 rounded-lg border transition bg-white hover:bg-blue-50 ${
                  selectedCommodity === c.name ? 'ring-2 ring-blue-400' : ''
                }`}
                onClick={() => setSelectedCommodity(c.name)}>
                <div>
                  <div className='font-semibold text-lg text-left'>
                    {c.name}
                  </div>
                  <div className='text-gray-500 text-sm'>
                    {c.receipts} receipts • {c.commodities} commodities
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-xl'>{formatLakh(c.value)}</div>
                  <div className='text-xs text-gray-500'>Total Value</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Commodity Detailed Analytics Card */}
      {selected && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
            <div>
              <div className='text-2xl font-bold flex items-center gap-2'>
                <span>📈</span> {selected.name} - Detailed Analytics
              </div>
              <div className='text-gray-500 text-sm mt-1'>
                Comprehensive performance analysis for the selected commodity
              </div>
            </div>
            <button
              className='text-xs text-blue-600 underline mt-2 md:mt-0'
              onClick={() => setSelectedCommodity(null)}>
              Close
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
            <div className='bg-blue-50 rounded-lg p-4 flex flex-col items-center'>
              <div className='text-2xl font-bold'>{selected.receipts}</div>
              <div className='text-gray-600 text-sm mt-1'>Total Receipts</div>
            </div>
            <div className='bg-green-50 rounded-lg p-4 flex flex-col items-center'>
              <div className='text-2xl font-bold'>
                {formatLakh(selected.value)}
              </div>
              <div className='text-gray-600 text-sm mt-1'>Total Value</div>
            </div>
            <div className='bg-yellow-50 rounded-lg p-4 flex flex-col items-center'>
              <div className='text-2xl font-bold'>
                ₹{selected.avgPerReceipt}
              </div>
              <div className='text-gray-600 text-sm mt-1'>
                Avg Market Fees Collected
              </div>
            </div>
            <div className='bg-purple-50 rounded-lg p-4 flex flex-col items-center'>
              <div className='text-2xl font-bold'>{selected.commodities}</div>
              <div className='text-gray-600 text-sm mt-1'>Traders Traded</div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <div className='font-semibold mb-2'>Monthly Trading Pattern</div>
              <div className='bg-gray-50 rounded-lg p-4 h-56 flex items-center justify-center'>
                {/* Dotted line chart for market fees */}
                <svg width='100%' height='100%' viewBox='0 0 300 180'>
                  <polyline
                    fill='none'
                    stroke='#8884d8'
                    strokeWidth='3'
                    strokeDasharray='6,6'
                    points={selected.monthlyPattern
                      .map(
                        (d, i) =>
                          `${30 + i * 50},${180 - (d.value / 35000) * 160}`
                      )
                      .join(' ')}
                  />
                  {selected.monthlyPattern.map((d, i) => (
                    <circle
                      key={d.month}
                      cx={30 + i * 50}
                      cy={180 - (d.value / 35000) * 160}
                      r='4'
                      fill='#8884d8'
                    />
                  ))}
                  {/* X axis labels */}
                  {selected.monthlyPattern.map((d, i) => (
                    <text
                      key={d.month + '-label'}
                      x={30 + i * 50}
                      y={175}
                      fontSize='10'
                      textAnchor='middle'
                      fill='#666'>
                      {d.month.split(' ')[0]}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
            <div>
              <div className='font-semibold mb-2'>Traders Traded</div>
              <div className='flex flex-wrap gap-2 mb-2'>
                {selected.traders &&
                  selected.traders.map((t) => (
                    <span
                      key={t}
                      className='bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700'>
                      {t}
                    </span>
                  ))}
              </div>
              <div className='text-sm text-gray-700 mb-1'>
                <b>Last Transaction:</b> {selected.lastTransaction}
              </div>
              <div className='text-sm text-gray-700'>
                <b>Highest Single Transaction:</b> ₹
                {selected.highestTransaction}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
