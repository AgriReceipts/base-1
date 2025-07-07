// Mock data for metrics
const metrics = [
  {
    label: 'Total Traders',
    value: 3,
    color: 'bg-blue-50',
    text: 'text-blue-700',
  },
  {
    label: 'Total Receipts',
    value: 5,
    color: 'bg-green-50',
    text: 'text-green-700',
  },
  {
    label: 'Total Value',
    value: 124000,
    color: 'bg-yellow-50',
    text: 'text-yellow-700',
    isMoney: true,
  },
  {
    label: 'Avg Market Fees Collected',
    value: 41333,
    color: 'bg-purple-50',
    text: 'text-purple-700',
    isMoney: true,
  },
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
      {month: 'Jan 2025', value: 12000},
      {month: 'Feb 2025', value: 18000},
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
    monthlyPattern: [{month: 'Mar 2025', value: 0}],
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
      {month: 'Apr 2025', value: 47000},
      {month: 'May 2025', value: 47000},
    ],
    traded: ['Rice'],
    lastTransaction: '20/05/2025',
    totalQuantity: 5,
    avgPerReceipt: 47000,
  },
];
