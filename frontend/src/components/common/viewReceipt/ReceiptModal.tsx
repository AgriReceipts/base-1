import api from '@/lib/axiosInstance';
import type {DetailedReceipt} from '@/types/receipt';
import {FileDown, Loader2, X} from 'lucide-react';
import {useEffect, useState} from 'react';

interface ReceiptModalProps {
  receiptId: string;
  onClose: () => void;
  onDownload: (receiptId: string) => void;
}

const ReceiptModal = ({receiptId, onClose, onDownload}: ReceiptModalProps) => {
  const [receipt, setReceipt] = useState<DetailedReceipt | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!receiptId) return;
    const fetchReceiptDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`receipts/getReceipt/${receiptId}`);
        setReceipt(response.data.data);
      } catch (err) {
        setError('Failed to fetch receipt details. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReceiptDetails();
  }, [receiptId]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Receipt Details</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </header>
        <main className="p-6 overflow-y-auto flex-1">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
              <span className="text-gray-500">Loading receipt details...</span>
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          )}
          {receipt && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem
                  label="Receipt Number"
                  value={receipt.receiptNumber}
                />
                <InfoItem label="Book Number" value={receipt.bookNumber} />
                <InfoItem
                  label="Receipt Date"
                  value={new Date(receipt.receiptDate).toLocaleString()}
                />
                <InfoItem
                  label="Committee"
                  value={receipt.committee?.name || 'N/A'}
                />
                <InfoItem label="Trader Name" value={receipt.trader?.name} />
                <InfoItem label="Payee Name" value={receipt.payeeName} />
                <InfoItem
                  label="Value (INR)"
                  value={`₹ ${Number(receipt.value).toLocaleString()}`}
                />
                <InfoItem
                  label="Nature of Receipt"
                  value={receipt.natureOfReceipt}
                />
                <InfoItem
                  label="Commodity"
                  value={receipt.commodity?.name || 'N/A'}
                />
                <InfoItem
                  label="Quantity"
                  value={`${receipt.quantity} ${receipt.unit}`}
                />
                <InfoItem
                  label="Vehicle Number"
                  value={receipt.vehicleNumber || 'N/A'}
                />
                <InfoItem label="Signed By" value={receipt.receiptSignedBy} />
              </div>
            </div>
          )}
        </main>
        <footer className="flex justify-end items-center p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-3 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onDownload(receiptId)}
            disabled={!receipt || isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            <FileDown size={16} className="mr-2" />
            Download
          </button>
        </footer>
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string | number | null | undefined;
}

const InfoItem = ({label, value}: InfoItemProps) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-gray-800 font-medium mt-1">{value || '-'}</p>
  </div>
);

export default ReceiptModal;