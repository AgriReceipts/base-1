import React, { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import ExportModal from './ExportModal';
import type { ExportOptions } from './ExportModal';

import { useExport } from '../hooks/useExport';

interface ExportButtonProps {
  data: any[];
  columns: { key: string; label: string }[];
  filename: string;
  title?: string;
  className?: string;
  variant?: 'csv' | 'pdf' | 'both';
  size?: 'sm' | 'md' | 'lg';
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  columns,
  filename,
  title,
  className = '',
  variant = 'both',
  size = 'md'
}) => {
  const [showModal, setShowModal] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf'>('csv');
  const { isExporting, exportError, exportSuccess, exportToCSV, exportToPDF, clearMessages } = useExport();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleExportClick = (type: 'csv' | 'pdf') => {
    setExportType(type);
    setShowModal(true);
    clearMessages();
  };

  const handleExport = async (options: ExportOptions) => {
    try {
      if (exportType === 'csv') {
        await exportToCSV(data, columns, options);
      } else {
        await exportToPDF(data, columns, options, title);
      }
      setShowModal(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearMessages();
  };

  // Show notification messages
  const showNotification = exportError || exportSuccess;

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        {(variant === 'csv' || variant === 'both') && (
          <button
            onClick={() => handleExportClick('csv')}
            disabled={isExporting || data.length === 0}
            className={`
              flex items-center ${sizeClasses[size]} bg-green-600 text-white rounded-md 
              hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 
              focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 
              disabled:cursor-not-allowed
            `}
          >
            <Download className={`${iconSizes[size]} mr-2`} />
            Export CSV
          </button>
        )}

        {(variant === 'pdf' || variant === 'both') && (
          <button
            onClick={() => handleExportClick('pdf')}
            disabled={isExporting || data.length === 0}
            className={`
              flex items-center ${sizeClasses[size]} bg-red-600 text-white rounded-md 
              hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 
              focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 
              disabled:cursor-not-allowed
            `}
          >
            <FileText className={`${iconSizes[size]} mr-2`} />
            Export PDF
          </button>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onExport={handleExport}
        availableColumns={columns}
        exportType={exportType}
        isLoading={isExporting}
      />

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className={`
            flex items-center p-4 rounded-lg shadow-lg border-l-4 ${
              exportError 
                ? 'bg-red-50 border-red-400 text-red-800' 
                : 'bg-green-50 border-green-400 text-green-800'
            }
          `}>
            {exportError ? (
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-medium">
                {exportError ? 'Export Failed' : 'Export Successful'}
              </p>
              <p className="text-sm mt-1">
                {exportError || exportSuccess}
              </p>
            </div>
            <button
              onClick={clearMessages}
              className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportButton;