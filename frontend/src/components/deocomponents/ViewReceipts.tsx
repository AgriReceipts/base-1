import React, { useState } from 'react';

interface Receipt {
  id: string;
  date: string;
  bookReceipt: string;
  trader: string;
  payee: string;
  amountPaid: number;
  nature: 'Market Fees (MF)' | 'Other';
}

const EditIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500 hover:text-blue-700 transition-colors"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5h6M4 15v4a2 2 0 002 2h4l9-9-6-6-9 9z" />
  </svg>
);

const ViewIcon = () => (
  <svg
    className="w-5 h-5 text-green-500 hover:text-green-700 transition-colors"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ViewReceipts: React.FC = () => {
  const [receipts] = useState<Receipt[]>([
    {
      id: '1',
      date: '2023-05-15',
      bookReceipt: 'BK-001',
      trader: 'John Doe',
      payee: 'Jane Smith',
      amountPaid: 1500,
      nature: 'Market Fees (MF)',
    },
    {
      id: '2',
      date: '2023-05-16',
      bookReceipt: 'BK-002',
      trader: 'Alice Johnson',
      payee: 'Bob Brown',
      amountPaid: 2000,
      nature: 'Market Fees (MF)',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [natureFilter, setNatureFilter] = useState<string>('all');

  const filteredReceipts = receipts.filter((receipt) => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      receipt.trader.toLowerCase().includes(normalizedSearch) ||
      receipt.payee.toLowerCase().includes(normalizedSearch) ||
      receipt.bookReceipt.toLowerCase().includes(normalizedSearch) ||
      receipt.nature.toLowerCase().includes(normalizedSearch) ||
      receipt.date.includes(normalizedSearch) ||
      receipt.amountPaid.toString().includes(normalizedSearch);

    const matchesNature = natureFilter === 'all' || receipt.nature === natureFilter;

    return matchesSearch && matchesNature;
  });

  const handleEdit = (id: string) => {
    console.log('Edit receipt with id:', id);
  };

  const handleView = (id: string) => {
    console.log('View receipt with id:', id);
  };

  return (
    <div className="p-8 bg-white min-h-screen w-full font-sans text-gray-800">
      <h2 className="text-3xl font-extrabold mb-1 text-blue-900">📄 My Receipts</h2>
      <p className="text-gray-600 mb-8">View and manage receipts you have created</p>

      {/* Committee Info Card */}
     <div className="mb-8 p-6 rounded-2xl shadow-md bg-gradient-to-r from-cyan-100 to-blue-100 text-black">
  <h3 className="text-xl font-bold text-blue-900 mb-1">Committee Access</h3>
  <p className="text-gray-800">
    You are viewing data for <span className="font-semibold">Tuni Agricultural Market Committee</span>{' '}
    (ID: <span className="font-mono text-gray-700">1a5c766d...</span>)
  </p>
  <p className="text-sm text-gray-700 mt-1">
    You can only view receipts submitted under your assigned committee. <br />
    Found <span className="font-semibold text-black">{receipts.length}</span> accessible receipt{receipts.length !== 1 && 's'}.
  </p>
</div>


      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search anything..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white shadow-md border border-gray-300 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="absolute left-3 top-4  text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </div>
        </div>

        <select
          value={natureFilter}
          onChange={(e) => setNatureFilter(e.target.value)}
          className="w-full md:w-64 py-3 px-4 rounded-xl bg-white shadow-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">🌐 All Types</option>
          <option value="Market Fees (MF)">🏷️ Market Fees (MF)</option>
          <option value="Other">📂 Other</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-md bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              {["Date", "Book/Receipt", "Trader", "Payee", "Amount Paid", "Nature", "Actions"].map((heading, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider ${
                    idx === 0 ? 'rounded-tl-2xl' : idx === 6 ? 'text-right rounded-tr-2xl' : ''
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredReceipts.length > 0 ? (
              filteredReceipts.map((receipt) => (
                <tr
                  key={receipt.id}
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{receipt.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{receipt.bookReceipt}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{receipt.trader}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{receipt.payee}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₹ {receipt.amountPaid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{receipt.nature}</td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button onClick={() => handleEdit(receipt.id)} className="p-2 rounded-full bg-blue-100 hover:bg-blue-200">
                      <EditIcon />
                    </button>
                    <button onClick={() => handleView(receipt.id)} className="p-2 rounded-full bg-green-100 hover:bg-green-200">
                      <ViewIcon />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500 text-sm font-medium">
                  ❌ No receipts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewReceipts;
