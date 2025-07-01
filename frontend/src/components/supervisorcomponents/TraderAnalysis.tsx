import { Divide } from 'lucide-react';
import React from 'react';
import { FiSearch, FiFilter, FiDownload, FiPrinter } from 'react-icons/fi';
import AreaChartComponent from '../supervisorcomponents/AreaChartComponent'

export default function TraderAnalysis() {
  const traders = [
    { id: 1, name: 'John Doe', volume: '$12,450', compliance: '95%', lastActive: '2 days ago' },
    { id: 2, name: 'Jane Smith', volume: '$8,720', compliance: '89%', lastActive: '1 week ago' },
    { id: 3, name: 'Robert Johnson', volume: '$15,230', compliance: '92%', lastActive: '3 days ago' },
    { id: 4, name: 'Emily Davis', volume: '$6,540', compliance: '87%', lastActive: '5 days ago' },
    { id: 5, name: 'Michael Wilson', volume: '$21,300', compliance: '97%', lastActive: '1 day ago' },
  ];

  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold mb-4 md:mb-0">Trader Analysis</h2>
        
      </div>

       {/* Chart Component */}
  <div className="mb-6">
    <AreaChartComponent />
  </div>
      
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative mb-4 md:mb-0 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search traders..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {traders.map((trader) => (
                <tr key={trader.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {trader.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{trader.name}</div>
                        <div className="text-sm text-gray-500">ID: {trader.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trader.volume}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      parseFloat(trader.compliance) > 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trader.compliance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trader.lastActive}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Audit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">24</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}