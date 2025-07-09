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
    <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col'>
        <header className='flex items-center justify-between p-4 border-b border-gray-200'>
          <h3 className='text-lg font-bold text-gray-800'>Receipt Details</h3>
          <button
            onClick={onClose}
            className='p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors'>
            <X size={20} />
          </button>
        </header>
        <main className='p-6 overflow-y-auto'>
          {isLoading && (
            <div className='flex justify-center items-center h-48'>
              <Loader2 className='animate-spin text-blue-500' size={40} />
            </div>
          )}
          {error && (
            <div className='text-center text-red-600 bg-red-50 p-4 rounded-lg'>
              {error}
            </div>
          )}
          {receipt && (
            <div className='space-y-4 text-sm'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InfoItem
                  label='Receipt Number'
                  value={receipt.receiptNumber}
                />
                <InfoItem label='Book Number' value={receipt.bookNumber} />
                <InfoItem
                  label='Receipt Date'
                  value={new Date(receipt.receiptDate).toLocaleString()}
                />
                <InfoItem
                  label='Committee'
                  value={receipt.committee?.name || 'N/A'}
                />
                <InfoItem label='Trader Name' value={receipt.trader?.name} />
                <InfoItem label='Payee Name' value={receipt.payeeName} />
                <InfoItem
                  label='Value (INR)'
                  value={`₹ ${Number(receipt.value).toLocaleString()}`}
                />
                <InfoItem
                  label='Nature of Receipt'
                  value={receipt.natureOfReceipt}
                />
                <InfoItem
                  label='Commodity'
                  value={receipt.commodity?.name || 'N/A'}
                />
                <InfoItem
                  label='Quantity'
                  value={`${receipt.quantity} ${receipt.unit}`}
                />
                <InfoItem
                  label='Vehicle Number'
                  value={receipt.vehicleNumber || 'N/A'}
                />
                <InfoItem label='Signed By' value={receipt.receiptSignedBy} />
              </div>
            </div>
          )}
        </main>
        <footer className='flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-3'>
            Close
          </button>
          <button
            onClick={() => onDownload(receiptId)}
            disabled={!receipt || isLoading}
            className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed'>
            <FileDown size={16} className='mr-2' />
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
  <div className='bg-gray-50 p-3 rounded-lg'>
    <p className='text-xs font-semibold text-gray-500 uppercase'>{label}</p>
    <p className='text-gray-800 font-medium'>{value}</p>
  </div>
);

export default ReceiptModal;
