import React from 'react';
import { FiPrinter, FiDownload } from 'react-icons/fi';

const Reports: React.FC = () => {
  const reportsData = [
    { id: 1, name: 'Receipt #001 - Farmer Subsidy', date: '2025-06-01' },
    { id: 2, name: 'Receipt #002 - Market Yard Sale', date: '2025-06-10' },
    { id: 3, name: 'Receipt #003 - Govt Aid Transfer', date: '2025-06-18' },
    { id: 4, name: 'Receipt #004 - Pesticide Purchase', date: '2025-06-25' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Reports</h2>

      <div className="space-y-4">
        {reportsData.map((report) => (
          <div
            key={report.id}
            className="bg-white shadow-md rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">{report.name}</span>
              <span className="text-sm text-gray-500">Date: {report.date}</span>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                <FiDownload className="text-md" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                <FiPrinter className="text-md" />
                Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
