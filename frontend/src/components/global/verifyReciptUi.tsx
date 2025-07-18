import type {
  Committee,
  VerificationResult,
  VerifyReceiptForm,
} from '@/types/verifyReceipt';
import {Search, AlertCircle, CheckCircle, Loader2} from 'lucide-react';
import logo from '../../assets/logo-ap.png';
import React from 'react';

interface VefrifyFormProps {
  formData: VerifyReceiptForm;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
  committees: Committee[];
  loading: boolean;
  loadingCommittees: boolean;
  verificationResult: VerificationResult | null;
  errors: Record<string, string>;
}

const VefrifyForm: React.FC<VefrifyFormProps> = ({
  formData,
  handleReset,
  handleInputChange,
  handleSubmit,
  committees,
  loading,
  loadingCommittees,
  verificationResult,
  errors,
}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-20'>
            <a className='flex items-center group' href='/login'>
              <div className='flex-shrink-0 transition-all duration-200 group-hover:scale-105'>
                <div className='flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl shadow-inner'>
                  <img src={logo} alt='Ap logo' className='h-8 w-auto' />
                </div>
              </div>
              <div className='ml-4'>
                <h1 className='text-xl font-bold text-gray-900 tracking-tight'>
                  AMC Receipt System
                </h1>
                <p className='text-sm text-gray-600 font-medium'>
                  Agricultural Market Committee Receipt Management
                </p>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='mb-10'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Verify Receipt
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Search and verify receipt authenticity by receipt number or book
            details. Our system ensures the integrity of all transactions.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit}>
          <div className='bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-8 transition-all duration-200 hover:shadow-lg'>
            <div className='space-y-8'>
              {errors.general && (
                <div className='flex items-center p-4 text-red-700 bg-red-50 rounded-lg border border-red-100'>
                  <AlertCircle className='w-6 h-6 mr-3 flex-shrink-0' />
                  <span className='text-sm font-medium'>{errors.general}</span>
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Receipt Number */}
                <div>
                  <label
                    htmlFor='receiptNumber'
                    className='block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider'>
                    Receipt Number
                  </label>
                  <input
                    type='text'
                    id='receiptNumber'
                    name='receiptNumber'
                    value={formData.receiptNumber}
                    onChange={handleInputChange}
                    placeholder='e.g., 815F20250706-0006'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm'
                  />
                  {errors.receiptNumber && (
                    <p className='mt-2 text-sm text-red-600 font-medium'>
                      {errors.receiptNumber}
                    </p>
                  )}
                </div>

                {/* Book Number */}
                <div>
                  <label
                    htmlFor='bookNumber'
                    className='block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider'>
                    Book Number
                  </label>
                  <input
                    type='text'
                    id='bookNumber'
                    name='bookNumber'
                    value={formData.bookNumber}
                    onChange={handleInputChange}
                    placeholder='e.g., 815F20250706'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm'
                  />
                  {errors.bookNumber && (
                    <p className='mt-2 text-sm text-red-600 font-medium'>
                      {errors.bookNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Committee Selection */}
              <div>
                <label
                  htmlFor='committeeId'
                  className='block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider'>
                  Committee
                </label>
                <div className='relative'>
                  <select
                    id='committeeId'
                    name='committeeId'
                    value={formData.committeeId}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-200 shadow-sm'
                    disabled={loadingCommittees}>
                    <option value=''>Select Committee</option>
                    {committees.map((committee) => (
                      <option key={committee.id} value={committee.id}>
                        {committee.name}
                      </option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700'>
                    <svg
                      className='h-5 w-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                </div>
                {loadingCommittees && (
                  <p className='mt-2 text-sm text-gray-500 font-medium'>
                    Loading committees...
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-2'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg'>
                  {loading ? (
                    <>
                      <Loader2 className='w-5 h-5 mr-3 animate-spin' />
                      <span className='font-semibold'>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Search className='w-5 h-5 mr-3' />
                      <span className='font-semibold'>Verify Receipt</span>
                    </>
                  )}
                </button>
                <button
                  type='button'
                  onClick={handleReset}
                  className='px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200 shadow-sm'>
                  <span className='font-semibold'>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Results */}
        {verificationResult && (
          <div className='bg-white rounded-xl shadow-md border border-gray-200 p-8 transition-all duration-200 hover:shadow-lg'>
            <div className='flex items-center mb-6'>
              {verificationResult.success ? (
                <CheckCircle className='w-7 h-7 text-green-500 mr-3 flex-shrink-0' />
              ) : (
                <AlertCircle className='w-7 h-7 text-red-500 mr-3 flex-shrink-0' />
              )}
              <h3 className='text-2xl font-bold text-gray-900'>
                Verification Result
              </h3>
            </div>

            <div
              className={`p-4 rounded-lg mb-6 border ${
                verificationResult.success
                  ? 'bg-green-50 text-green-800 border-green-100'
                  : 'bg-red-50 text-red-800 border-red-100'
              }`}>
              <p className='font-medium'>{verificationResult.message}</p>
            </div>

            {/* Receipt Table */}
            {verificationResult.receipts &&
              verificationResult.receipts.length > 0 && (
                <div className='overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                          Receipt/Book #
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                          Date
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                          Trader
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                          Payee
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                          Value
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                          Fees Paid
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                          Nature
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                          Signed By
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {verificationResult.receipts.map((receipt, index) => (
                        <tr
                          key={index}
                          className='hover:bg-gray-50 transition-colors duration-150'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='font-medium text-gray-900'>
                              {receipt.receiptNumber}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {receipt.bookNumber}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                            {receipt?.receiptDate &&
                              new Date(receipt.receiptDate).toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                            {receipt.trader?.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                            {receipt.payeeName}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-900 font-medium'>
                            ₹{receipt?.value && receipt.value.toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-900 font-medium'>
                            ₹
                            {receipt?.feesPaid &&
                              receipt.feesPaid.toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span className='px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full'>
                              {receipt.natureOfReceipt}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                            {receipt.receiptSignedBy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VefrifyForm;
