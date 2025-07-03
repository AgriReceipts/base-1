import api from '@/lib/axiosInstance';
import {useAuthStore} from '@/stores/authStore';
import {ChevronLeft, ChevronRight, Eye, Loader2, Search} from 'lucide-react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import ReceiptModal from './ReceiptModal';

interface commitie {
  id: string;
  name: string;
}

interface FilterChangeEvent
  extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> {}

interface Filters {
  search: string;
  natureOfReceipt: string;
  committeeId: string;
  startDate: string;
  endDate: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Receipt {
  id: string;
  receiptNumber: string;
  bookNumber: string;
  receiptDate: string;
  traderName: string;
  payeeName: string;
  value: number;
  natureOfReceipt: string;
  receiptSignedBy: string;
  // Add any other fields as needed
}

const ViewReceipts = () => {
  const {user, committee} = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [committees, setCommittees] = useState<commitie[]>([]);

  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(
    null
  );

  // Filters state, initialized from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    natureOfReceipt: searchParams.get('natureOfReceipt') || '',
    committeeId: searchParams.get('committeeId') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  });

  // Memoize query params to prevent unnecessary refetching
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', searchParams.get('page') || '1');
    params.set('limit', searchParams.get('limit') || '10');
    if (filters.search) params.set('search', filters.search);
    if (filters.natureOfReceipt)
      params.set('natureOfReceipt', filters.natureOfReceipt);
    if (user?.designation === 'ad' && filters.committeeId)
      params.set('committeeId', filters.committeeId);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    return params;
  }, [searchParams, filters, user?.designation]);

  const fetchAllCommittees = async () => {
    try {
      const response = await api.get('/metaData/commities');
      return response.data.data;
    } catch (err) {
      console.error(err);
    }
  };

  // Data fetching effect
  useEffect(() => {
    const fetchReceipts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(
          `/receipts/getAllReceipts?${queryParams.toString()}`
        );
        setReceipts(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(
          'Failed to fetch receipts. Please check your connection and try again.'
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipts();
    // Update URL when queryParams change
    setSearchParams(queryParams, {replace: true});
  }, [queryParams, setSearchParams]);

  // Fetch committees if user is admin
  useEffect(() => {
    if (user?.designation === 'ad') {
      fetchAllCommittees().then(setCommittees);
    }
  }, [user?.designation]);

  const handleFilterChange = (e: FilterChangeEvent) => {
    const {name, value} = e.target;
    setFilters((prev: Filters) => ({...prev, [name]: value}));
    // Reset page to 1 when filters change
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage > 0 && newPage <= pagination.totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
    }
  };

  const handleDownload = useCallback(async (receiptId: string) => {
    try {
      // Replace with your actual download endpoint
      const response = await api.get(`/receipts/download/${receiptId}`, {
        responseType: 'blob', // Important for file downloads
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${receiptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Could not download the receipt.');
    }
  }, []);

  return (
    <div className='p-4 md:p-8 bg-gray-50 min-h-screen w-full font-sans text-gray-800'>
      <h2 className='text-3xl font-bold mb-1 text-gray-800'>View Receipts</h2>
      <p className='text-gray-600 mb-6'>
        Search, filter, and manage all submitted receipts.
      </p>

      {user?.designation !== 'ad' && (
        <div className='mb-6 p-4 rounded-lg bg-blue-100 border border-blue-200 text-blue-800'>
          <h3 className='font-bold'>
            Committee Access:{' '}
            <span className='font-normal'>{committee?.name}</span>
          </h3>
          <p className='text-sm'>
            You are viewing receipts for your assigned committee.
          </p>
        </div>
      )}

      {/* Filters Section */}
      <div className='p-4 mb-6 bg-white rounded-xl shadow-sm border border-gray-200'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Search Input */}
          <div className='relative'>
            <label
              htmlFor='search'
              className='text-sm font-medium text-gray-600 mb-1 block'>
              Search Book/Receipt #
            </label>
            <Search className='absolute left-3 top-9 text-gray-400' size={20} />
            <input
              type='text'
              name='search'
              id='search'
              placeholder='e.g., b123 or red234'
              value={filters.search}
              onChange={handleFilterChange}
              className='w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          {/* Nature of Receipt Filter */}
          <div>
            <label
              htmlFor='natureOfReceipt'
              className='text-sm font-medium text-gray-600 mb-1 block'>
              Nature of Receipt
            </label>
            <select
              name='natureOfReceipt'
              id='natureOfReceipt'
              value={filters.natureOfReceipt}
              onChange={handleFilterChange}
              className='w-full py-2 px-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option value=''>All Natures</option>
              <option value='mf'>Market Fees (MF)</option>
              <option value='lc'>License Fees (LF)</option>
              <option value='others'>Other</option>
            </select>
          </div>
          {/* Date Filters */}
          <div>
            <label
              htmlFor='startDate'
              className='text-sm font-medium text-gray-600 mb-1 block'>
              Start Date
            </label>
            <input
              type='date'
              name='startDate'
              id='startDate'
              value={filters.startDate}
              onChange={handleFilterChange}
              className='w-full p-2 rounded-lg border border-gray-300'
            />
          </div>
          <div>
            <label
              htmlFor='endDate'
              className='text-sm font-medium text-gray-600 mb-1 block'>
              End Date
            </label>
            <input
              type='date'
              name='endDate'
              id='endDate'
              value={filters.endDate}
              onChange={handleFilterChange}
              className='w-full p-2 rounded-lg border border-gray-300'
            />
          </div>

          {/* Committee Filter for Admin */}
          {user?.designation === 'ad' && (
            <div className='md:col-span-2 lg:col-span-4'>
              <label
                htmlFor='committeeId'
                className='text-sm font-medium text-gray-600 mb-1 block'>
                Filter by Committee
              </label>
              <select
                name='committeeId'
                id='committeeId'
                value={filters.committeeId}
                onChange={handleFilterChange}
                className='w-full py-2 px-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                <option value=''>All Committees</option>
                {committees.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-xl shadow-sm bg-white border border-gray-200'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {[
                'Receipt/Book #',
                'Date',
                'Trader',
                'Payee',
                'Value',
                'Nature',
                'Signed By',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {isLoading ? (
              <tr>
                <td colSpan={8} className='text-center py-10'>
                  <Loader2
                    className='animate-spin text-blue-500 mx-auto'
                    size={32}
                  />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={8}
                  className='text-center py-10 text-red-600 font-medium'>
                  {error}
                </td>
              </tr>
            ) : receipts.length > 0 ? (
              receipts.map((receipt) => (
                <tr key={receipt.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {receipt.receiptNumber} / {receipt.bookNumber}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {new Date(receipt.receiptDate).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {receipt.traderName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {receipt.payeeName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    ₹{Number(receipt.value).toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {receipt.natureOfReceipt}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {receipt.receiptSignedBy}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-right'>
                    <button
                      onClick={() => setSelectedReceiptId(receipt.id)}
                      className='p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors'>
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className='text-center py-10 text-gray-500'>
                  No receipts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.total > 0 && (
        <div className='flex items-center justify-between mt-4'>
          <span className='text-sm text-gray-700'>
            Showing{' '}
            <span className='font-medium'>
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className='font-medium'>
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className='font-medium'>{pagination.total}</span> results
          </span>
          <div className='inline-flex items-center'>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className='p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'>
              <ChevronLeft size={20} />
            </button>
            <span className='px-4 text-sm font-medium'>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className='p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedReceiptId && (
        <ReceiptModal
          receiptId={selectedReceiptId}
          onClose={() => setSelectedReceiptId(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default ViewReceipts;
