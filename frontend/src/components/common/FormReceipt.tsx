import React from 'react';
import {format} from 'date-fns';
import type {CreateReceiptSchema} from '@/types/receipt';
import type {z} from 'zod';

// Define props interface for type safety
interface FormReceiptProps {
  formData: Omit<z.infer<typeof CreateReceiptSchema>, 'receiptDate'>;
  onFormChange: (
    field: keyof FormReceiptProps['formData'],
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
  commodities: {id: string; name: string}[];
  commoditySearch: string;
  setCommoditySearch: (search: string) => void;
}

// Constants for select options
const units = ['quintals', 'numbers', 'bags'];
const natureOfReceipt = [
  {value: 'mf', label: 'Market Fee (MF)'},
  {value: 'lc', label: 'License Fee (LC)'},
  {value: 'uc', label: 'User Charges (UC)'},
  {value: 'others', label: 'Others'},
];
const supervisors = ['SUPERVISOR_1', 'SUPERVISOR_2'];

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
  setCommoditySearch,
}) => {
  const filteredCommodities = commodities.filter((c) =>
    c.name.toLowerCase().includes(commoditySearch.toLowerCase())
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    onDateChange(newDate);
  };

  return (
    <div className='min-h-screen w-full bg-gray-50'>
      <div className='mx-auto max-w-7xl px-3 py-4'>
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-500 to-teal-500 p-4 text-white'>
            <div className='flex justify-between items-center'>
              <div>
                <h1 className='text-2xl font-bold'>
                  {committeeData?.name || 'Agricultural Market Committee'}
                </h1>
                <h2 className='text-md font-normal mt-1 opacity-90'>
                  {isEditing ? 'Edit Receipt Entry' : 'New Receipt Entry'}
                </h2>
              </div>
              <div
                className='bg-white/20 rounded-full px-2 py-0.5 text-sm font-light backdrop-blur-sm'
                role='contentinfo'
                aria-label='Committee code'>
                Code: {committeeData?.code || 'AMC'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='p-4 space-y-4' noValidate>
            {/* Committee Information */}
            <section
              className='bg-gray-50 rounded-md p-3 border border-gray-100'
              aria-labelledby='committee-info'>
              <h3
                id='committee-info'
                className='text-base font-medium text-gray-700 mb-2 flex items-center'>
                <span className='bg-blue-400 w-1.5 h-4 rounded-full mr-2'></span>
                Committee Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Market Committee
                  </p>
                  <p className='text-sm text-gray-500 mt-0.5'>
                    {committeeData?.name || 'Agricultural Market Committee'}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Available Checkposts
                  </p>
                  <div className='flex flex-wrap gap-1 mt-0.5'>
                    {availableCheckposts.length > 0 ? (
                      availableCheckposts.map((checkpost) => (
                        <span
                          key={checkpost.id}
                          className='bg-white px-2 py-0.5 rounded-full text-sm text-gray-600 border border-gray-200 shadow-xs'>
                          {checkpost.name}
                        </span>
                      ))
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
            <section aria-labelledby='receipt-info' className='space-y-2'>
              <h3
                id='receipt-info'
                className='text-base font-medium text-gray-700 flex items-center'>
                <span className='bg-blue-400 w-1.5 h-4 rounded-full mr-2'></span>
                Receipt Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div>
                  <label
                    htmlFor='receiptDate'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Receipt Date<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='date'
                    id='receiptDate'
                    value={date ? format(date, 'yyyy-MM-dd') : ''}
                    onChange={handleDateChange}
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white transition-colors'
                  />
                </div>
                <div>
                  <label
                    htmlFor='bookNumber'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Book Number<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='bookNumber'
                    placeholder='Book number'
                    value={formData.bookNumber}
                    onChange={(e) => onFormChange('bookNumber', e.target.value)}
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
                <div>
                  <label
                    htmlFor='receiptNumber'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Receipt Number<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='receiptNumber'
                    placeholder='Receipt number'
                    value={formData.receiptNumber}
                    onChange={(e) =>
                      onFormChange('receiptNumber', e.target.value)
                    }
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
              </div>
            </section>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Trader/Farmer Details */}
              <div className='bg-blue-50 rounded-md p-3 border border-blue-100'>
                <h3 className='text-base font-medium text-gray-700 mb-2 flex items-center'>
                  <span className='bg-blue-400 w-1.5 h-4 rounded-full mr-2'></span>
                  Trader/Farmer Details
                </h3>
                <div className='space-y-2'>
                  <div>
                    <label
                      htmlFor='traderName'
                      className='block text-sm font-normal text-gray-600 mb-1'>
                      Trader/Farmer Name<span className='text-red-600'>*</span>
                    </label>
                    <input
                      type='text'
                      id='traderName'
                      placeholder='Trader/Farmer name'
                      value={formData.traderName}
                      onChange={(e) =>
                        onFormChange('traderName', e.target.value)
                      }
                      className='w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white/70 transition-colors'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='traderAddress'
                      className='block text-sm font-normal text-gray-600 mb-1'>
                      Trader Address
                    </label>
                    <textarea
                      id='traderAddress'
                      placeholder='Trader address'
                      value={formData.traderAddress}
                      onChange={(e) =>
                        onFormChange('traderAddress', e.target.value)
                      }
                      className='w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white/70 transition-colors'
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Payee Details */}
              <div className='bg-teal-50 rounded-md p-3 border border-teal-100'>
                <h3 className='text-base font-medium text-gray-700 mb-2 flex items-center'>
                  <span className='bg-teal-400 w-1.5 h-4 rounded-full mr-2'></span>
                  Payee Details
                </h3>
                <div className='space-y-2'>
                  <div>
                    <label
                      htmlFor='payeeName'
                      className='block text-sm font-normal text-gray-600 mb-1'>
                      Payee Name
                    </label>
                    <input
                      type='text'
                      id='payeeName'
                      placeholder='Payee name'
                      value={formData.payeeName}
                      onChange={(e) =>
                        onFormChange('payeeName', e.target.value)
                      }
                      className='w-full px-3 py-1.5 text-sm border border-teal-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-teal-100 focus:border-teal-300 bg-white/70 transition-colors'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='payeeAddress'
                      className='block text-sm font-normal text-gray-600 mb-1'>
                      Payee Address
                    </label>
                    <textarea
                      id='payeeAddress'
                      placeholder='Payee address'
                      value={formData.payeeAddress}
                      onChange={(e) =>
                        onFormChange('payeeAddress', e.target.value)
                      }
                      className='w-full px-3 py-1.5 text-sm border border-teal-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-teal-100 focus:border-teal-300 bg-white/70 transition-colors'
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Commodity Details */}
            <section aria-labelledby='commodity-details' className='space-y-2'>
              <h3
                id='commodity-details'
                className='text-base font-medium text-gray-700 flex items-center'>
                <span className='bg-blue-400 w-1.5 h-4 rounded-full mr-2'></span>
                Commodity Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div>
                  <label
                    htmlFor='commodity'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Commodity<span className='text-red-600'>*</span>
                  </label>
                  <select
                    id='commodity'
                    value={formData.commodity}
                    onChange={(e) => onFormChange('commodity', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]">
                    <option value=''>Select commodity</option>
                    {commodities.map((commodity) => (
                      <option key={commodity.id} value={commodity.name}>
                        {commodity.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor='quantity'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Quantity<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='number'
                    id='quantity'
                    placeholder='Quantity'
                    value={formData.quantity}
                    onChange={(e) =>
                      onFormChange('quantity', Number(e.target.value))
                    }
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
                <div>
                  <label
                    htmlFor='unit'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Unit<span className='text-red-600'>*</span>
                  </label>
                  <select
                    id='unit'
                    value={formData.unit}
                    onChange={(e) => onFormChange('unit', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]">
                    <option value=''>Select unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Nature Details */}
            <section aria-labelledby='nature-details' className='space-y-2'>
              <h3
                id='nature-details'
                className='text-base font-medium text-gray-700 flex items-center'>
                <span className='bg-blue-400 w-1.5 h-4 rounded-full mr-2'></span>
                Nature Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div>
                  <label
                    htmlFor='natureOfReceipt'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Nature<span className='text-red-600'>*</span>
                  </label>
                  <select
                    id='natureOfReceipt'
                    value={formData.natureOfReceipt}
                    onChange={(e) =>
                      onFormChange('natureOfReceipt', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]">
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
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Value (₹)
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none'>
                      <span className='text-gray-400 text-sm'>₹</span>
                    </div>
                    <input
                      type='number'
                      id='value'
                      placeholder='Value'
                      value={formData.value}
                      onChange={(e) =>
                        onFormChange('value', Number(e.target.value))
                      }
                      className='w-full pl-6 pr-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300'
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='feesPaid'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Fees Paid (₹)<span className='text-red-600'>*</span>
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none'>
                      <span className='text-gray-400 text-sm'>₹</span>
                    </div>
                    <input
                      type='number'
                      id='feesPaid'
                      placeholder='Fees paid'
                      value={formData.feesPaid}
                      onChange={(e) =>
                        onFormChange('feesPaid', Number(e.target.value))
                      }
                      className='w-full pl-6 pr-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300'
                    />
                  </div>
                </div>
              </div>

              {/* Nature Other Text - Show when others is selected */}
              {formData.natureOfReceipt === 'others' && (
                <div className='mt-2'>
                  <label
                    htmlFor='natureOtherText'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Specify Other Nature<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='natureOtherText'
                    placeholder='Specify other nature'
                    value={formData.natureOtherText}
                    onChange={(e) =>
                      onFormChange('natureOtherText', e.target.value)
                    }
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
              )}
            </section>

            {/* Collection Location */}
            <section
              aria-labelledby='collection-location'
              className='space-y-2'>
              <h3
                id='collection-location'
                className='text-base font-medium text-gray-700 flex items-center'>
                <span className='bg-blue-400 w-1.5 h-4 rounded-full mr-2'></span>
                Collection Location
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div>
                  <label
                    htmlFor='vehicleNumber'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Vehicle Number
                  </label>
                  <input
                    type='text'
                    id='vehicleNumber'
                    placeholder='Vehicle number'
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      onFormChange('vehicleNumber', e.target.value)
                    }
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
                <div>
                  <label
                    htmlFor='invoiceNumber'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Invoice Number
                  </label>
                  <input
                    type='text'
                    id='invoiceNumber'
                    placeholder='Invoice number'
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      onFormChange('invoiceNumber', e.target.value)
                    }
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
                <div>
                  <label
                    htmlFor='collectionLocation'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Collection Location
                  </label>
                  <select
                    id='collectionLocation'
                    value={formData.collectionLocation}
                    onChange={(e) =>
                      onFormChange('collectionLocation', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]">
                    <option value=''>Select location</option>
                    <option value='office'>Office</option>
                    <option value='checkpost'>Checkpost</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>

              {/* Conditional fields based on collection location */}
              {formData.collectionLocation === 'office' && (
                <div className='mt-2'>
                  <label
                    htmlFor='officeSupervisor'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Office Supervisor
                  </label>
                  <select
                    id='officeSupervisor'
                    value={formData.officeSupervisor}
                    onChange={(e) =>
                      onFormChange('officeSupervisor', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]">
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
                <div className='mt-2'>
                  <label
                    htmlFor='checkpostId'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Checkpost
                  </label>
                  <select
                    id='checkpostId'
                    value={formData.checkpostId}
                    onChange={(e) =>
                      onFormChange('checkpostId', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]">
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
                <div className='mt-2'>
                  <label
                    htmlFor='otherLocation'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Other Location<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='otherLocation'
                    placeholder='Specify other location'
                    value={formData.collectionLocation}
                    onChange={(e) =>
                      onFormChange('collectionLocation', e.target.value)
                    }
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
              )}
            </section>

            {/* Generated By */}
            <section
              aria-labelledby='generated-by'
              className='bg-gray-50 rounded-md p-3 border border-gray-100'>
              <h3
                id='generated-by'
                className='text-base font-medium text-gray-700 mb-2 flex items-center'>
                <span className='bg-blue-400 w-1.5 h-4 rounded-full mr-2'></span>
                Generated By
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div>
                  <label
                    htmlFor='collectedBy'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Generated By<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='collectedBy'
                    placeholder='Generated by'
                    value={formData.generatedBy}
                    onChange={(e) =>
                      onFormChange('generatedBy', e.target.value)
                    }
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
                <div>
                  <label
                    htmlFor='designation'
                    className='block text-sm font-normal text-gray-600 mb-2'>
                    Designation<span className='text-red-600'>*</span>
                  </label>
                  <input
                    type='text'
                    id='designation'
                    placeholder='Designation'
                    value={formData.designation}
                    onChange={(e) =>
                      onFormChange('designation', e.target.value)
                    }
                    className='w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors'
                  />
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <div className='flex justify-between items-center pt-6 border-t border-gray-100'>
              <button
                type='button'
                onClick={handleReset}
                disabled={loading}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                Reset Form
              </button>
              <button
                type='submit'
                disabled={loading}
                className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                aria-disabled={loading}>
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
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </span>
                ) : isEditing ? (
                  'Update Receipt'
                ) : (
                  'Save Receipt'
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
