import React, { useState } from 'react';
import { X, Download, FileText, Settings, Check, AlertCircle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  availableColumns: { key: string; label: string }[];
  exportType: 'csv' | 'pdf';
  isLoading: boolean;
}

export interface ExportOptions {
  selectedColumns: string[];
  filename: string;
  includeTimestamp: boolean;
  paperSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  includeHeaders: boolean;
  includeFooters: boolean;
  chunkSize?: number;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  availableColumns,
  exportType,
  isLoading
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.map(col => col.key)
  );
  const [filename, setFilename] = useState('');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [paperSize, setPaperSize] = useState<'A4' | 'Letter' | 'Legal'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [includeFooters, setIncludeFooters] = useState(true);
  const [chunkSize, setChunkSize] = useState(1000);

  if (!isOpen) return null;

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(availableColumns.map(col => col.key));
  };

  const handleSelectNone = () => {
    setSelectedColumns([]);
  };

  const handleExport = () => {
    const options: ExportOptions = {
      selectedColumns,
      filename: filename || `${exportType}_export`,
      includeTimestamp,
      includeHeaders,
      includeFooters,
      chunkSize,
      ...(exportType === 'pdf' && { paperSize, orientation })
    };
    onExport(options);
  };

  const isValidExport = selectedColumns.length > 0 && filename.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            {exportType === 'csv' ? (
              <Download className="w-6 h-6 text-green-600 mr-2" />
            ) : (
              <FileText className="w-6 h-6 text-red-600 mr-2" />
            )}
            <h2 className="text-xl font-bold text-gray-900">
              Export to {exportType.toUpperCase()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              File Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filename *
                </label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter filename for ${exportType} export`}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeTimestamp"
                  checked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="includeTimestamp" className="ml-2 text-sm text-gray-700">
                  Include timestamp in filename
                </label>
              </div>
            </div>
          </div>

          {/* PDF-specific options */}
          {exportType === 'pdf' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">PDF Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paper Size
                  </label>
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value as 'A4' | 'Letter' | 'Legal')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeHeaders"
                    checked={includeHeaders}
                    onChange={(e) => setIncludeHeaders(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="includeHeaders" className="ml-2 text-sm text-gray-700">
                    Include headers and page numbers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeFooters"
                    checked={includeFooters}
                    onChange={(e) => setIncludeFooters(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="includeFooters" className="ml-2 text-sm text-gray-700">
                    Include footers with generation date
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* CSV-specific options */}
          {exportType === 'csv' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CSV Options</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chunk Size (for large datasets)
                </label>
                <input
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value) || 1000)}
                  min="100"
                  max="10000"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of rows to process at once (recommended: 1000-5000)
                </p>
              </div>
            </div>
          )}

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Columns ({selectedColumns.length}/{availableColumns.length})
              </h3>
              <div className="space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={isLoading}
                >
                  Select All
                </button>
                <button
                  onClick={handleSelectNone}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  Select None
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
              {availableColumns.map((column) => (
                <div key={column.key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`column-${column.key}`}
                    checked={selectedColumns.includes(column.key)}
                    onChange={() => handleColumnToggle(column.key)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={`column-${column.key}`}
                    className="ml-2 text-sm text-gray-700 truncate"
                    title={column.label}
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Messages */}
          {!isValidExport && (
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                Please enter a filename and select at least one column to export.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!isValidExport || isLoading}
            className={`flex items-center px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              isValidExport && !isLoading
                ? exportType === 'csv'
                  ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                  : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                {exportType === 'csv' ? (
                  <Download className="w-4 h-4 mr-2" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Export {exportType.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;