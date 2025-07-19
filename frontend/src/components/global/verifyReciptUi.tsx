import type {
  Committee,
  VerificationResult,
  VerifyReceiptForm,
} from '@/types/verifyReceipt';
import {
  Search,
  AlertCircle,
  Loader2,
  Copy,
  BadgeCheck,
  XCircle,
} from 'lucide-react';
import logo from '../../assets/logo-ap.png';
import React, {useRef, useState} from 'react';

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
  const [copied, setCopied] = useState<string | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 -z-10'>
        <div className='w-full h-full bg-gradient-to-br from-blue-50 via-gray-50 to-emerald-50' />
        <div
          className='absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100 opacity-30 rounded-full blur-3xl animate-pulse-slow'
          aria-hidden='true'
        />
        <div
          className='absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100 opacity-20 rounded-full blur-3xl animate-pulse-slower'
          aria-hidden='true'
        />
      </div>

      {/* Header */}
      <header className='bg-white shadow-md border-b border-gray-200 sticky top-0 z-20'>
        <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-20'>
            <a
              className='flex items-center group'
              href='/'
              aria-label='Go to login'>
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
          <p className='text-lg text-gray-600 max-w-2xl leading-relaxed'>
            Search and verify receipt authenticity by receipt number or book
            details. Our system ensures the integrity of all transactions.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          autoComplete='off'
          aria-label='Verify Receipt Form'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 transition-all duration-200 hover:shadow-2xl'>
            <div className='space-y-8'>
              {errors.general && (
                <div
                  className='flex items-center p-4 text-red-700 bg-red-50 rounded-lg border border-red-100 animate-shake'
                  role='alert'>
                  <AlertCircle className='w-6 h-6 mr-3 flex-shrink-0' />
                  <span className='text-sm font-medium'>{errors.general}</span>
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Receipt Number */}
                <div className='relative'>
                  <input
                    type='text'
                    id='receiptNumber'
                    name='receiptNumber'
                    value={formData.receiptNumber}
                    onChange={handleInputChange}
                    placeholder=' '
                    ref={receiptInputRef}
                    aria-label='Receipt Number'
                    className={`peer w-full px-4 py-3 border ${
                      errors.receiptNumber
                        ? 'border-red-400'
                        : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-transparent`}
                  />
                  <label
                    htmlFor='receiptNumber'
                    className='absolute left-4 top-3 text-gray-500 text-sm font-semibold uppercase tracking-wider pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 bg-white px-1 rounded'>
                    Receipt Number
                  </label>
                  {errors.receiptNumber && (
                    <p className='mt-2 text-sm text-red-600 font-medium'>
                      {errors.receiptNumber}
                    </p>
                  )}
                </div>

                {/* Book Number */}
                <div className='relative'>
                  <input
                    type='text'
                    id='bookNumber'
                    name='bookNumber'
                    value={formData.bookNumber}
                    onChange={handleInputChange}
                    placeholder=' '
                    aria-label='Book Number'
                    className={`peer w-full px-4 py-3 border ${
                      errors.bookNumber ? 'border-red-400' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-transparent`}
                  />
                  <label
                    htmlFor='bookNumber'
                    className='absolute left-4 top-3 text-gray-500 text-sm font-semibold uppercase tracking-wider pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 bg-white px-1 rounded'>
                    Book Number
                  </label>
                  {errors.bookNumber && (
                    <p className='mt-2 text-sm text-red-600 font-medium'>
                      {errors.bookNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Committee Selection */}
              <div className='relative'>
                <select
                  id='committeeId'
                  name='committeeId'
                  value={formData.committeeId}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-200 shadow-sm bg-transparent'
                  disabled={loadingCommittees}
                  aria-label='Committee'>
                  <option value=''>Select Committee</option>
                  {committees.map((committee) => (
                    <option key={committee.id} value={committee.id}>
                      {committee.name}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor='committeeId'
                  className='absolute left-4 -top-4 text-xs text-blue-600 font-semibold uppercase tracking-wider bg-white px-1 rounded pointer-events-none'>
                  Committee
                </label>
                {loadingCommittees && (
                  <p className='mt-2 text-sm text-gray-500 font-medium animate-pulse'>
                    Loading committees...
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-2'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg group'>
                  {loading ? (
                    <>
                      <Loader2 className='w-5 h-5 mr-3 animate-spin' />
                      <span className='font-semibold'>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Search className='w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-150' />
                      <span className='font-semibold'>Verify Receipt</span>
                    </>
                  )}
                </button>
                <button
                  type='button'
                  onClick={handleReset}
                  className='px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200 shadow-sm font-semibold'>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Results */}
        {verificationResult && (
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 transition-all duration-200 hover:shadow-2xl mt-6'>
            <div className='flex items-center mb-6'>
              {verificationResult.success ? (
                <BadgeCheck className='w-7 h-7 text-green-500 mr-3 flex-shrink-0 animate-bounce' />
              ) : (
                <XCircle className='w-7 h-7 text-red-500 mr-3 flex-shrink-0 animate-shake' />
              )}
              <h3 className='text-2xl font-bold text-gray-900'>
                Verification Result
              </h3>
              <span
                className={`ml-4 px-3 py-1 text-xs font-bold rounded-full ${
                  verificationResult.success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                {verificationResult.success ? 'Verified' : 'Not Found'}
              </span>
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
                <div className='overflow-x-auto rounded-xl border border-gray-200 shadow-sm'>
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
                          className={`transition-colors duration-150 ${
                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          } hover:bg-blue-50`}>
                          <td className='px-6 py-4 whitespace-nowrap flex items-center gap-2'>
                            <div className='font-medium text-gray-900'>
                              {receipt.receiptNumber}
                            </div>
                            <button
                              type='button'
                              aria-label='Copy receipt number'
                              onClick={() => handleCopy(receipt.receiptNumber)}
                              className='ml-1 p-1 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150'>
                              <Copy
                                className={`w-4 h-4 ${
                                  copied === receipt.receiptNumber
                                    ? 'text-green-500'
                                    : 'text-gray-400'
                                }`}
                              />
                            </button>
                            {copied === receipt.receiptNumber && (
                              <span className='ml-1 text-xs text-green-600 font-semibold animate-fade-in'>
                                Copied!
                              </span>
                            )}
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
