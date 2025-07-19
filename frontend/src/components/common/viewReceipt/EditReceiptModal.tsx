import api from '@/lib/axiosInstance';
import type {UpdateReceipt} from '@/types/receipt';
import {useEffect, useState} from 'react';
import ReceiptEntry from '../newReceipt/ReceiptEntry';

interface EditReceiptModalProps {
  receiptId: string;
  onClose: () => void;
}

function EditReceiptModal({receiptId, onClose}: EditReceiptModalProps) {
  const [receipt, setReceipt] = useState<UpdateReceipt | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!receiptId) return;

    const fetchReceiptDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(
          `receipts/getReceipt/${receiptId}?view=edit`
        );
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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden border border-gray-100'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl'>
          <div>
            <h2 className='text-xl font-semibold text-gray-800'>
              Edit Receipt
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Receipt ID: {receiptId}
            </p>
          </div>

          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            aria-label='Close modal'>
            Close
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto'>
          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <div className='flex flex-col items-center space-y-4'>
                {/* Loading spinner */}
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                <p className='text-gray-600 text-sm'>
                  Loading receipt details...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className='p-6'>
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-400'
                      viewBox='0 0 20 20'
                      fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <h3 className='text-sm font-medium text-red-800'>
                      Error Loading Receipt
                    </h3>
                    <p className='mt-2 text-sm text-red-700'>{error}</p>
                    <div className='mt-4'>
                      <button
                        onClick={() => window.location.reload()}
                        className='bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors'>
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && receipt && (
            <div className='p-6'>
              <ReceiptEntry receiptToEdit={receipt} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditReceiptModal;
