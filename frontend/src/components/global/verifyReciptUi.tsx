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
    <div>
      <div className='min-h-screen bg-gray-50'>
        {/* Header */}
        <div className='bg-white shadow-sm border-b'>
          <div className='max-w-screen-[xl] mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16'>
              <a className='flex items-center' href='/login'>
                <div className='flex-shrink-0'>
                  <div className='flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg pt-1'>
                    <img src={logo} alt='Ap logo'></img>
                  </div>
                </div>
                <div className='ml-4'>
                  <h1 className='text-lg font-semibold text-gray-900'>
                    AMC Receipt System
                  </h1>
                  <p className='text-sm text-gray-500'>
                    Agricultural Market Committee Receipt Management
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>Verify Receipt</h2>
            <p className='mt-2 text-gray-600'>
              Search and verify receipt authenticity by receipt number or book
              details.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit}>
            <div className='bg-white rounded-lg shadow-sm border p-6 mb-6'>
              <div className='space-y-6'>
                {errors.general && (
                  <div className='flex items-center p-3 text-red-700 bg-red-50 rounded-md'>
                    <AlertCircle className='w-5 h-5 mr-2' />
                    <span className='text-sm'>{errors.general}</span>
                  </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Receipt Number */}
                  <div>
                    <label
                      htmlFor='receiptNumber'
                      className='block text-sm font-medium text-gray-700 mb-2'>
                      Receipt Number
                    </label>
                    <input
                      type='text'
                      id='receiptNumber'
                      name='receiptNumber'
                      value={formData.receiptNumber}
                      onChange={handleInputChange}
                      placeholder='e.g., 815F20250706-0006'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                    {errors.receiptNumber && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.receiptNumber}
                      </p>
                    )}
                  </div>

                  {/* Book Number */}
                  <div>
                    <label
                      htmlFor='bookNumber'
                      className='block text-sm font-medium text-gray-700 mb-2'>
                      Book Number
                    </label>
                    <input
                      type='text'
                      id='bookNumber'
                      name='bookNumber'
                      value={formData.bookNumber}
                      onChange={handleInputChange}
                      placeholder='e.g., 815F20250706'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                    {errors.bookNumber && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.bookNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Committee Selection */}
                <div>
                  <label
                    htmlFor='committeeId'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Committee
                  </label>
                  <select
                    id='committeeId'
                    name='committeeId'
                    value={formData.committeeId}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    disabled={loadingCommittees}>
                    <option value=''>Select Committee</option>
                    {committees.map((committee) => (
                      <option key={committee.id} value={committee.id}>
                        {committee.name}
                      </option>
                    ))}
                  </select>
                  {loadingCommittees && (
                    <p className='mt-1 text-sm text-gray-500'>
                      Loading committees...
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-3'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
                    {loading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className='w-4 h-4 mr-2' />
                        Verify Receipt
                      </>
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={handleReset}
                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500'>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Results */}
          {verificationResult && (
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <div className='flex items-center mb-4'>
                {verificationResult.success ? (
                  <CheckCircle className='w-5 h-5 text-green-600 mr-2' />
                ) : (
                  <AlertCircle className='w-5 h-5 text-red-600 mr-2' />
                )}
                <h3 className='text-lg font-semibold text-gray-900'>
                  Verification Result
                </h3>
              </div>

              <div
                className={`p-3 rounded-md mb-4 ${
                  verificationResult.success
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                {verificationResult.message}
              </div>

              {/* Receipt Table */}
              {verificationResult.receipts &&
                verificationResult.receipts.length > 0 && (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Receipt/Book #
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Date
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Trader
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Payee
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Value
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Fees Paid
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Nature
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Signed By
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {verificationResult.receipts.map((receipt, index) => (
                          <tr key={index} className='hover:bg-gray-50'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm font-medium text-gray-900'>
                                {receipt.receiptNumber}
                              </div>
                              <div className='text-sm text-gray-500'>
                                {receipt.bookNumber}
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {receipt?.receiptDate &&
                                new Date(receipt.receiptDate).toLocaleString()}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {receipt.trader?.name}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {receipt.payeeName}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              ₹
                              {receipt?.value && receipt.value.toLocaleString()}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              ₹
                              {receipt?.feesPaid &&
                                receipt.feesPaid.toLocaleString()}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className='px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'>
                                {receipt.natureOfReceipt}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
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
        </div>
      </div>
    </div>
  );
};

export default VefrifyForm;
