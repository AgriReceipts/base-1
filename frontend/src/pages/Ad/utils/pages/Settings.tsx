import React, { useState } from 'react';
import { Settings as SettingsIcon, Trash2, Download, Upload, AlertTriangle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Settings: React.FC = () => {
  const [receipts, setReceipts] = useLocalStorage('receipts', []);
  const [targets, setTargets] = useLocalStorage('targets', []);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleExportData = () => {
    const data = {
      receipts,
      targets,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amc-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.receipts) setReceipts(data.receipts);
        if (data.targets) setTargets(data.targets);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    setReceipts([]);
    setTargets([]);
    setShowConfirmation(false);
    alert('All data cleared successfully!');
  };

  const getDataStats = () => {
    return {
      receipts: receipts.length,
      targets: targets.length,
      totalMarketFee: receipts
        .filter((r: any) => r.natureOfReceipt === 'mf')
        .reduce((sum: number, r: any) => sum + r.marketFee, 0),
    };
  };

  const stats = getDataStats();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <SettingsIcon className="w-6 h-6 text-gray-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        </div>

        {/* Data Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-600">Total Receipts</p>
                <p className="text-2xl font-bold text-blue-800">{stats.receipts}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-green-600">Target Configurations</p>
                <p className="text-2xl font-bold text-green-800">{stats.targets}</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-purple-600">Total Market Fee</p>
                <p className="text-2xl font-bold text-purple-800">₹{stats.totalMarketFee.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-600">Download all your data as a backup file</p>
              </div>
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Import Data</h4>
                <p className="text-sm text-gray-600">Upload a previously exported backup file</p>
              </div>
              <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h4 className="font-medium text-red-900">Clear All Data</h4>
                <p className="text-sm text-red-600">Permanently delete all receipts and targets</p>
              </div>
              <button
                onClick={() => setShowConfirmation(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Application Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Information</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Application Name:</span>
                <span className="text-sm text-gray-900">AMC Market Fee Management System</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Version:</span>
                <span className="text-sm text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Data Storage:</span>
                <span className="text-sm text-gray-900">Local Browser Storage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                <span className="text-sm text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Data Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all data? This action cannot be undone. 
              All receipts and targets will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;