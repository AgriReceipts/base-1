import React from 'react';
import {format} from 'date-fns';
import {CreateReceiptSchema} from '@/types/receipt';
import {z} from 'zod';

// Define props interface for type safety
interface FormReceiptProps {
  formData: Omit<z.infer<typeof CreateReceiptSchema>, 'receiptDate'>;
  onFormChange: (
    field: keyof Omit<z.infer<typeof CreateReceiptSchema>, 'receiptDate'>,
    value: string | number
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
  date: Date | undefined;
  onDateChange: (date?: Date) => void;
  isEditing: boolean;
  loading: boolean;
  committeeData: {id: string; name: string; code?: string} | null;
  availableCheckposts: {id: string; name: string}[];
  commodities: string[];
  traders: string[];
  commoditySearch: string;
  errorMessage: string | null;
  onErrorDismiss: () => void;
  setCommoditySearch: (search: string) => void;
}

// Constants for select options
const units = ['quintals', 'kilograms', 'bags', 'numbers'] as const;

type NatureOfReceiptOption = {
  value: 'mf' | 'lc' | 'uc' | 'others';
  label: string;
};

const natureOfReceipt: NatureOfReceiptOption[] = [
  {value: 'mf', label: 'Market Fee (MF)'},
  {value: 'lc', label: 'License Fee (LC)'},
  {value: 'uc', label: 'User Charges (UC)'},
  {value: 'others', label: 'Others'},
];

const supervisors = ['SUPERVISOR_1', 'SUPERVISOR_2', 'SUPERVISOR_3'] as const;

// Helper function to format numbers in Indian style (12,34,567)
const formatIndianNumber = (num: number | string): string => {
  if (!num) return '0';

  const numberStr =
    typeof num === 'string' ? num.replace(/,/g, '') : num.toString();
  const [whole, decimal] = numberStr.split('.');

  let lastThree = whole.substring(whole.length - 3);
  const otherNumbers = whole.substring(0, whole.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  if (decimal) {
    result += '.' + decimal;
  }

  return result;
};

// Helper to parse Indian formatted numbers back to number type
const parseIndianNumber = (str: string): number => {
  return parseFloat(str.replace(/,/g, ''));
};

const FormReceipt: React.FC<FormReceiptProps> = ({
  formData,
  onFormChange,
  handleSubmit,
  handleReset,
  date,
  onDateChange,
  isEditing,
  loading,
  committeeData,
  availableCheckposts,
  commodities,
  commoditySearch,
  traders,
  setCommoditySearch,
  errorMessage,
  onErrorDismiss,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    onDateChange(newDate);
  };

  const handleNumberChange = (field: keyof typeof formData, value: string) => {
    // Remove any non-digit characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    onFormChange(field, numericValue ? parseIndianNumber(numericValue) : 0);
  };

  return (
    <div className='min-h-screen w-full bg-gray-50'>
      <div className='mx-auto max-w-8xl px-4 py-6'>
        <div className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200'>
          {/* Header */}
          <div className='bg-blue-700 p-4 text-white'>
            <div className='flex justify-between items-center'>
              <div>
                <h1 className='text-xl font-bold'>
                  {committeeData?.name || 'Agricultural Market Committee'}
                </h1>
                <h2 className='text-sm font-normal mt-1 opacity-90'>
                  {isEditing ? 'Edit Receipt Entry' : 'New Receipt Entry'}
                </h2>
              </div>
              <div
                className='bg-white/10 rounded px-3 py-1 text-xs font-medium'
                role='contentinfo'
                aria-label='Committee code'>
                Code: {committeeData?.code || 'AMC'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='p-6 space-y-6' noValidate>
            {/* Error Message Display */}
            {errorMessage && (
              <div
                className='bg-red-50 border border-red-400 rounded p-4 mb-4 relative'
                role='alert'>
                <div className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3 flex-1'>
                    <h3 className='text-sm font-medium text-red-800'>
                      Please correct the following errors:
                    </h3>
                    <div className='mt-1 text-sm text-red-700'>
                      {errorMessage}
                    </div>
                  </div>
                  <button
                    type='button'
                    className='ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 inline-flex h-8 w-8'
                    onClick={onErrorDismiss}
                    aria-label='Close'>
                    <span className='sr-only'>Dismiss</span>
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {/* Committee Information */}
            <section
              className='bg-gray-50 rounded p-4 border border-gray-200'
              aria-labelledby='committee-info'>
              <h3
                id='committee-info'
                className='text-base font-semibold text-gray-700 mb-3 flex items-center'>
                <svg
                  className='w-4 h-4 mr-2 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Committee Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-1'>
                    Agrl Market Committee
                  </label>
                  <div className='bg-white p-2 rounded border border-gray-300 text-sm'>
                    {committeeData?.name || 'Agricultural Market Committee'}
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-1'>
                    Checkpost
                  </label>
                  <div className='bg-white p-2 rounded border border-gray-300 min-h-10'>
                    {availableCheckposts.length > 0 ? (
                      <div className='flex flex-wrap gap-1'>
                        {availableCheckposts.map((checkpost) => (
                          <span
                            key={checkpost.id}
                            className='bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700 border border-gray-200'>
                            {checkpost.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className='text-gray-500 text-sm'>
                        No checkposts available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Receipt Information */}
            <section aria-labelledby='receipt-info' className='space-y-4'>
              <h3
                id='receipt-info'
                className='text-base font-semibold text-gray-700 mb-3 flex items-center'>
                <svg
                  className='w-4 h-4 mr-2 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z'
                    clipRule='evenodd'
                  />
                </svg>
                Receipt Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label
                    htmlFor='receiptDate'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Receipt Date<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='date'
                    id='receiptDate'
                    value={date ? format(date, 'yyyy-MM-dd') : ''}
                    onChange={handleDateChange}
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='bookNumber'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Book Number<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='bookNumber'
                    placeholder='Enter book number'
                    value={formData.bookNumber}
                    onChange={(e) => onFormChange('bookNumber', e.target.value)}
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='receiptNumber'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Receipt Number<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='receiptNumber'
                    placeholder='Enter receipt number'
                    value={formData.receiptNumber}
                    onChange={(e) =>
                      onFormChange('receiptNumber', e.target.value)
                    }
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
              </div>
            </section>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Trader Details */}
              <div className='bg-blue-50 rounded p-4 border border-blue-100'>
                <h3 className='text-base font-semibold text-gray-700 mb-3 flex items-center'>
                  <svg
                    className='w-4 h-4 mr-2 text-blue-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                  </svg>
                  Payee Details
                </h3>
                <div className='space-y-4'>
                  <div>
                    <label
                      htmlFor='traderName'
                      className='block text-sm font-medium text-gray-600 mb-1'>
                      Payee Name<span className='text-red-600'>*</span>
                    </label>
                    <div className='relative w-full group'>
                      <input
                        type='text'
                        id='traderName'
                        value={formData.traderName}
                        onChange={(e) =>
                          onFormChange('traderName', e.target.value)
                        }
                        placeholder='Search and select Payee'
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                        required
                      />
                      <div className='absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto hidden group-focus-within:block'>
                        {traders
                          .filter((trader) =>
                            trader
                              .toLowerCase()
                              .includes(formData.traderName.toLowerCase())
                          )
                          .map((trader) => (
                            <div
                              key={trader}
                              onMouseDown={() => {
                                onFormChange('traderName', trader);
                              }}
                              className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                                formData.traderName === trader
                                  ? 'bg-blue-100'
                                  : ''
                              }`}>
                              {trader}
                            </div>
                          ))}
                        {traders.filter((t) =>
                          t
                            .toLowerCase()
                            .includes(formData.traderName.toLowerCase())
                        ).length === 0 && (
                          <div className='px-3 py-2 text-sm text-gray-500'>
                            No traders found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {formData.traderName === 'New' && (
                    <>
                      <div>
                        <label
                          htmlFor='newTraderName'
                          className='block text-sm font-medium text-gray-600 mb-1'>
                          New Trader Name<span className='text-red-600'>*</span>
                        </label>
                        <input
                          type='text'
                          id='newTraderName'
                          placeholder='Enter new trader name'
                          value={formData.newTraderName || ''}
                          onChange={(e) =>
                            onFormChange('newTraderName', e.target.value)
                          }
                          className='w-full px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='traderAddress'
                          className='block text-sm font-medium text-gray-600 mb-1'>
                          Trader Address
                        </label>
                        <input
                          type='text'
                          id='traderAddress'
                          placeholder='Enter trader address'
                          value={formData.traderAddress || ''}
                          onChange={(e) =>
                            onFormChange('traderAddress', e.target.value)
                          }
                          className='w-full px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white'
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Farmer/Trader Details */}
              <div className='bg-teal-50 rounded p-4 border border-teal-100'>
                <h3 className='text-base font-semibold text-gray-700 mb-3 flex items-center'>
                  <svg
                    className='w-4 h-4 mr-2 text-teal-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z' />
                  </svg>
                  Farmer/Trader Details
                </h3>
                <div className='space-y-4'>
                  <div>
                    <label
                      htmlFor='payeeName'
                      className='block text-sm font-medium text-gray-600 mb-1'>
                      Farmer/Trader Name<span className='text-red-600'>*</span>
                    </label>
                    <input
                      type='text'
                      id='payeeName'
                      placeholder='Enter farmer/trader name'
                      value={formData.payeeName || ''}
                      onChange={(e) =>
                        onFormChange('payeeName', e.target.value)
                      }
                      className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='payeeAddress'
                      className='block text-sm font-medium text-gray-600 mb-1'>
                      Farmer/Trader Address
                    </label>
                    <input 
                      type='text'
                      id='payeeAddress'
                      placeholder='Enter farmer/trader address'
                      value={formData.payeeAddress || ''}
                      onChange={(e) =>
                        onFormChange('payeeAddress', e.target.value)
                      }
                      className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Commodity Details */}
            <section aria-labelledby='commodity-details' className='space-y-4'>
              <h3
                id='commodity-details'
                className='text-base font-semibold text-gray-700 mb-3 flex items-center'>
                <svg
                  className='w-4 h-4 mr-2 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z'
                    clipRule='evenodd'
                  />
                </svg>
                Commodity Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label
                    htmlFor='commodity'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Commodity<span className='text-red-600'>*</span>
                  </label>
                  <div className='relative w-full group'>
                    <input
                      type='text'
                      id='commodity'
                      value={commoditySearch}
                      onChange={(e) => setCommoditySearch(e.target.value)}
                      placeholder='Search and select commodity'
                      className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    />
                    <div className='absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto hidden group-focus-within:block'>
                      {commodities
                        .filter((commodity) =>
                          commodity
                            .toLowerCase()
                            .includes(commoditySearch.toLowerCase())
                        )
                        .map((commodity) => (
                          <div
                            key={commodity}
                            onMouseDown={() => {
                              onFormChange('commodity', commodity);
                              setCommoditySearch(commodity);
                            }}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                              formData.commodity === commodity
                                ? 'bg-blue-100'
                                : ''
                            }`}>
                            {commodity}
                          </div>
                        ))}
                      {commodities.filter((c) =>
                        c.toLowerCase().includes(commoditySearch.toLowerCase())
                      ).length === 0 && (
                        <div className='px-3 py-2 text-sm text-gray-500'>
                          No commodities found
                        </div>
                      )}
                    </div>
                  </div>
                  {(formData.commodity === 'Other' ||
                    formData.commodity === 'other') && (
                    <div className='mt-3'>
                      <label
                        htmlFor='newCommodityName'
                        className='block text-sm font-medium text-gray-600 mb-1'>
                        New Commodity Name
                        <span className='text-red-600'>*</span>
                      </label>
                      <input
                        type='text'
                        id='newCommodityName'
                        placeholder='Enter new commodity name'
                        value={formData.newCommodityName || ''}
                        onChange={(e) =>
                          onFormChange('newCommodityName', e.target.value)
                        }
                        className='w-full px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                        required
                      />
                      {!formData.newCommodityName?.trim() && (
                        <p className='mt-1 text-xs text-red-600'>
                          New commodity name is required
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='quantity'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Total Quantity<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='quantity'
                    placeholder='Enter quantity'
                    value={formatIndianNumber(formData.quantity)}
                    onChange={(e) =>
                      handleNumberChange('quantity', e.target.value)
                    }
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='unit'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Units<span className='text-red-600'>*</span>
                  </label>
                  <select
                    id='unit'
                    value={formData.unit}
                    onChange={(e) => onFormChange('unit', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NzY3NjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.75rem]"
                    required>
                    <option value=''>Select unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  {formData.unit === 'bags' && (
                    <div className='mt-3'>
                      <label
                        htmlFor='weightPerBag'
                        className='block text-sm font-medium text-gray-600 mb-1'>
                        Weight per Bag (kg)
                        <span className='text-red-600'>*</span>
                      </label>
                      <input
                        type='number'
                        id='weightPerBag'
                        placeholder='Enter weight per bag'
                        value={formData.weightPerBag || ''}
                        onChange={(e) =>
                          onFormChange('weightPerBag', Number(e.target.value))
                        }
                        className='w-full px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                        required
                      />
                      {formData.unit === 'bags' && !formData.weightPerBag && (
                        <p className='mt-1 text-xs text-red-600'>
                          Weight per bag is required
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Nature Details */}
            <section aria-labelledby='nature-details' className='space-y-4'>
              <h3
                id='nature-details'
                className='text-base font-semibold text-gray-700 mb-3 flex items-center'>
                <svg
                  className='w-4 h-4 mr-2 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                    clipRule='evenodd'
                  />
                </svg>
                Nature Of Receipt
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label
                    htmlFor='natureOfReceipt'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Nature<span className='text-red-600'>*</span>
                  </label>
                  <select
                    id='natureOfReceipt'
                    value={formData.natureOfReceipt}
                    onChange={(e) =>
                      onFormChange('natureOfReceipt', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NzY3NjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.75rem]"
                    required>
                    <option value=''>Select nature</option>
                    {natureOfReceipt.map((nature) => (
                      <option key={nature.value} value={nature.value}>
                        {nature.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor='value'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Value (₹)
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='value'
                      placeholder='Enter value'
                      value={formatIndianNumber(formData.value || 0)}
                      onChange={(e) =>
                        handleNumberChange('value', e.target.value)
                      }
                      className='w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    />
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500'>₹</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='feesPaid'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Fees Paid (₹)<span className='text-red-600'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='feesPaid'
                      placeholder='Enter fees paid'
                      value={formatIndianNumber(formData.feesPaid || 0)}
                      onChange={(e) =>
                        handleNumberChange('feesPaid', e.target.value)
                      }
                      className='w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                      required
                    />
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500'>₹</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nature Other Text - Show when others is selected */}
              {formData.natureOfReceipt === 'others' && (
                <div className='mt-3'>
                  <label
                    htmlFor='natureOtherText'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Specify Other Nature<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='natureOtherText'
                    placeholder='Specify other nature'
                    value={formData.natureOtherText || ''}
                    onChange={(e) =>
                      onFormChange('natureOtherText', e.target.value)
                    }
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
              )}
            </section>

            {/* Collection Location */}
            <section
              aria-labelledby='collection-location'
              className='space-y-4'>
              <h3
                id='collection-location'
                className='text-base font-semibold text-gray-700 mb-3 flex items-center'>
                <svg
                  className='w-4 h-4 mr-2 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                    clipRule='evenodd'
                  />
                </svg>
                Collection Location
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label
                    htmlFor='vehicleNumber'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Vehicle Number
                  </label>
                  <input
                    type='text'
                    id='vehicleNumber'
                    placeholder='Enter vehicle number'
                    value={formData.vehicleNumber || ''}
                    onChange={(e) =>
                      onFormChange('vehicleNumber', e.target.value)
                    }
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label
                    htmlFor='invoiceNumber'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    E-Way Bill/Invoice Number
                  </label>
                  <input
                    type='text'
                    id='invoiceNumber'
                    placeholder='Enter E-Way Bill/Invoice number'
                    value={formData.invoiceNumber || ''}
                    onChange={(e) =>
                      onFormChange('invoiceNumber', e.target.value)
                    }
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label
                    htmlFor='collectionLocation'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Collection Location
                  </label>
                  <select
                    id='collectionLocation'
                    value={formData.collectionLocation || ''}
                    onChange={(e) =>
                      onFormChange('collectionLocation', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NzY3NjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.75rem]">
                    <option value=''>Select location</option>
                    <option value='office'>Office</option>
                    <option value='checkpost'>Checkpost</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>

              {/* Conditional fields based on collection location */}
              {formData.collectionLocation === 'office' && (
                <div className='mt-3'>
                  <label
                    htmlFor='officeSupervisor'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Office Supervisor
                  </label>
                  <select
                    id='officeSupervisor'
                    value={formData.officeSupervisor || ''}
                    onChange={(e) =>
                      onFormChange('officeSupervisor', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NzY3NjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.75rem]">
                    <option value=''>Select supervisor</option>
                    {supervisors.map((supervisor) => (
                      <option key={supervisor} value={supervisor}>
                        {supervisor}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {formData.collectionLocation === 'checkpost' && (
                <div className='mt-3'>
                  <label
                    htmlFor='checkpostId'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Checkpost Name
                  </label>
                  <select
                    id='checkpostId'
                    value={formData.checkpostId || ''}
                    onChange={(e) =>
                      onFormChange('checkpostId', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NzY3NjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.75rem]">
                    <option value=''>Select checkpost</option>
                    {availableCheckposts.map((checkpost) => (
                      <option key={checkpost.id} value={checkpost.id}>
                        {checkpost.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {formData.collectionLocation === 'other' && (
                <div className='mt-3'>
                  <label
                    htmlFor='collectionOtherText'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Specify Other Location
                  </label>
                  <input
                    type='text'
                    id='collectionOtherText'
                    placeholder='Specify other location'
                    value={formData.collectionOtherText || ''}
                    onChange={(e) =>
                      onFormChange('collectionOtherText', e.target.value)
                    }
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              )}
            </section>

            {/* Signature Details */}
            <section aria-labelledby='signature-details' className='space-y-4'>
              <h3
                id='signature-details'
                className='text-base font-semibold text-gray-700 mb-3 flex items-center'>
                <svg
                  className='w-4 h-4 mr-2 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                Signature Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='receiptSignedBy'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Receipt Signed By<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='receiptSignedBy'
                    placeholder='Enter name of signatory'
                    value={formData.receiptSignedBy || ''}
                    onChange={(e) =>
                      onFormChange('receiptSignedBy', e.target.value)
                    }
                    className={`w-full px-3 py-2 text-sm border ${
                      errorMessage && !formData.receiptSignedBy
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    } rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  {errorMessage && !formData.receiptSignedBy && (
                    <p className='mt-1 text-xs text-red-600'>
                      Receipt signed by is required
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='designation'
                    className='block text-sm font-medium text-gray-600 mb-1'>
                    Designation<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='designation'
                    placeholder='Enter designation'
                    value={formData.designation || ''}
                    onChange={(e) =>
                      onFormChange('designation', e.target.value)
                    }
                    className={`w-full px-3 py-2 text-sm border ${
                      errorMessage && !formData.designation
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    } rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  {errorMessage && !formData.designation && (
                    <p className='mt-1 text-xs text-red-600'>
                      Designation is required
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
              <button
                type='button'
                onClick={handleReset}
                disabled={loading}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
                Reset
              </button>
              <button
                type='submit'
                disabled={loading}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
                {loading ? (
                  <span className='flex items-center'>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Processing...
                  </span>
                ) : isEditing ? (
                  'Update Receipt'
                ) : (
                  'Create Receipt'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormReceipt;