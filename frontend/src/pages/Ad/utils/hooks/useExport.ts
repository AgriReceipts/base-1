import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportOptions } from '../components/ExportModal';

interface ExportHookReturn {
  isExporting: boolean;
  exportError: string | null;
  exportSuccess: string | null;
  exportToCSV: (data: any[], columns: { key: string; label: string }[], options: ExportOptions) => Promise<void>;
  exportToPDF: (data: any[], columns: { key: string; label: string }[], options: ExportOptions, title?: string) => Promise<void>;
  clearMessages: () => void;
}

export const useExport = (): ExportHookReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setExportError(null);
    setExportSuccess(null);
  };

  const validateData = (data: any[], selectedColumns: string[]): boolean => {
    if (!data || data.length === 0) {
      setExportError('No data available to export');
      return false;
    }
    if (!selectedColumns || selectedColumns.length === 0) {
      setExportError('No columns selected for export');
      return false;
    }
    return true;
  };

  const generateFilename = (baseFilename: string, includeTimestamp: boolean, extension: string): string => {
    const timestamp = includeTimestamp ? `_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}` : '';
    return `${baseFilename}${timestamp}.${extension}`;
  };

  const processDataInChunks = async <T>(
    data: T[],
    chunkSize: number,
    processor: (chunk: T[], index: number) => Promise<void>
  ): Promise<void> => {
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      await processor(chunk, Math.floor(i / chunkSize));
      
      // Allow UI to update between chunks
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  };

  const exportToCSV = async (
    data: any[],
    columns: { key: string; label: string }[],
    options: ExportOptions
  ): Promise<void> => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);

    try {
      if (!validateData(data, options.selectedColumns)) {
        return;
      }

      const selectedColumnObjects = columns.filter(col => options.selectedColumns.includes(col.key));
      const csvRows: string[] = [];

      // Add headers
      if (options.includeHeaders) {
        csvRows.push(selectedColumnObjects.map(col => `"${col.label}"`).join(','));
      }

      // Process data in chunks to prevent UI blocking
      await processDataInChunks(data, options.chunkSize || 1000, async (chunk) => {
        const chunkRows = chunk.map(row => {
          return selectedColumnObjects.map(col => {
            const value = row[col.key];
            if (value === null || value === undefined) return '""';
            
            // Handle different data types
            if (typeof value === 'number') {
              return value.toString();
            }
            if (typeof value === 'boolean') {
              return value ? 'true' : 'false';
            }
            if (value instanceof Date) {
              return `"${value.toISOString()}"`;
            }
            
            // Escape quotes and wrap in quotes for strings
            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
          }).join(',');
        });
        
        csvRows.push(...chunkRows);
      });

      // Create and download CSV
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', generateFilename(options.filename, options.includeTimestamp, 'csv'));
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setExportSuccess(`CSV file exported successfully with ${data.length} rows`);
    } catch (error) {
      console.error('CSV Export Error:', error);
      setExportError(`Failed to export CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async (
    data: any[],
    columns: { key: string; label: string }[],
    options: ExportOptions,
    title?: string
  ): Promise<void> => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);

    try {
      if (!validateData(data, options.selectedColumns)) {
        return;
      }

      const selectedColumnObjects = columns.filter(col => options.selectedColumns.includes(col.key));
      
      // Create PDF document
      const doc = new jsPDF({
        orientation: options.orientation || 'landscape',
        unit: 'mm',
        format: options.paperSize || 'A4'
      });

      // Add title if provided
      if (title && options.includeHeaders) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 20);
      }

      // Prepare table data
      const tableHeaders = selectedColumnObjects.map(col => col.label);
      const tableData = data.map(row => 
        selectedColumnObjects.map(col => {
          const value = row[col.key];
          if (value === null || value === undefined) return '';
          if (typeof value === 'number') return value.toLocaleString();
          if (typeof value === 'boolean') return value ? 'Yes' : 'No';
          if (value instanceof Date) return value.toLocaleDateString();
          return String(value);
        })
      );

      // Generate table
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: title && options.includeHeaders ? 30 : 20,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 20, right: 14, bottom: 20, left: 14 },
        didDrawPage: (data) => {
          // Add page numbers if headers are enabled
          if (options.includeHeaders) {
            const pageCount = doc.getNumberOfPages();
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height || pageSize.getHeight();
            
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(
              `Page ${data.pageNumber} of ${pageCount}`,
              pageSize.width - 30,
              pageHeight - 10
            );
          }

          // Add footer with generation date if enabled
          if (options.includeFooters) {
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height || pageSize.getHeight();
            
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(
              `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
              14,
              pageHeight - 10
            );
          }
        },
      });

      // Save PDF
      const filename = generateFilename(options.filename, options.includeTimestamp, 'pdf');
      doc.save(filename);

      setExportSuccess(`PDF file exported successfully with ${data.length} rows`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      setExportError(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportError,
    exportSuccess,
    exportToCSV,
    exportToPDF,
    clearMessages,
  };
};