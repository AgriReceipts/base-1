import React, { useState, useRef, useEffect } from 'react';
import { useReceiptContext } from '../../contexts/ReceiptContext';
import { v4 as uuidv4 } from 'uuid';
import { useForm, Controller } from 'react-hook-form';

const units = ['Kg', 'Quintal', 'Ton'];
const natures = [
  { label: 'Market Fees (mf)', value: 'mf' },
  { label: 'User Fees (uf)', value: 'uf' },
  { label: 'Licence Fees (lf)', value: 'lf' },
  { label: 'Others', value: 'others' },
];
const checkposts = ['Tuni', 'K/P Puram', 'Rekavanipalem'];
const supervisors = ['Supervisor 1', 'Supervisor 2'];
const commodities = ['Rice', 'Wheat', 'Maize'];
const collectionLocations = ['office', 'checkpost', 'other'];

type FormData = {
  receiptDate: string;
  bookNumber: string;
  receiptNumber: string;
  traderName: string;
  traderAddress: string;
  payeeName: string;
  payeeAddress: string;
  commodity: string;
  quantity: number;
  unit: string;
  nature: string;
  value: number;
  feesPaid: number;
  vehicleNumber: string;
  invoiceNumber: string;
  collectionLocation: string;
  collectedBy: string;
  designation: string;
  otherLocation: string;
};

const AddReceipt: React.FC = () => {
  const { addReceipt } = useReceiptContext();
  const [formData, setFormData] = useState<FormData>({
    receiptDate: '2025-06-30',
    bookNumber: '',
    receiptNumber: '',
    traderName: '',
    traderAddress: '',
    payeeName: '',
    payeeAddress: '',
    commodity: '',
    quantity: 0,
    unit: '',
    nature: '',
    value: 0,
    feesPaid: 0,
    vehicleNumber: '',
    invoiceNumber: '',
    collectionLocation: '',
    collectedBy: '',
    designation: '',
    otherLocation: ''
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: formData
  });

  const collectionLocation = watch('collectionLocation');

  // Refs for all input fields
  const inputRefs = {
    receiptDate: useRef<HTMLInputElement>(null),
    bookNumber: useRef<HTMLInputElement>(null),
    receiptNumber: useRef<HTMLInputElement>(null),
    traderName: useRef<HTMLInputElement>(null),
    traderAddress: useRef<HTMLTextAreaElement>(null),
    payeeName: useRef<HTMLInputElement>(null),
    payeeAddress: useRef<HTMLTextAreaElement>(null),
    commodity: useRef<HTMLSelectElement>(null),
    quantity: useRef<HTMLInputElement>(null),
    unit: useRef<HTMLSelectElement>(null),
    nature: useRef<HTMLSelectElement>(null),
    value: useRef<HTMLInputElement>(null),
    feesPaid: useRef<HTMLInputElement>(null),
    vehicleNumber: useRef<HTMLInputElement>(null),
    invoiceNumber: useRef<HTMLInputElement>(null),
    collectionLocation: useRef<HTMLSelectElement>(null),
    generatedBy: useRef<HTMLInputElement>(null),
    designation: useRef<HTMLInputElement>(null)
  };

  // Order of fields for navigation
  const fieldOrder = [
    'receiptDate', 'bookNumber', 'receiptNumber',
    'traderName', 'traderAddress',
    'payeeName', 'payeeAddress',
    'commodity', 'quantity', 'unit',
    'nature', 'value', 'feesPaid',
    'vehicleNumber', 'invoiceNumber', 'collectionLocation',
    'generatedBy', 'designation'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      moveToNextField(fieldName);
    }
  };

  const moveToNextField = (currentField: string) => {
    const currentIndex = fieldOrder.indexOf(currentField);
    if (currentIndex < fieldOrder.length - 1) {
      const nextField = fieldOrder[currentIndex + 1];
      const nextRef = inputRefs[nextField as keyof typeof inputRefs];
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    if (inputRefs.receiptDate.current) {
      inputRefs.receiptDate.current.focus();
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const receipt = {
        id: uuidv4(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      await addReceipt(receipt);
      reset();
      // Show success message or redirect
    } catch (error) {
      console.error('Error saving receipt:', error);
      // Show error message
    }
  };

  const handleReset = () => {
    reset({
      receiptDate: '2025-06-30',
      bookNumber: '',
      receiptNumber: '',
      traderName: '',
      traderAddress: '',
      payeeName: '',
      payeeAddress: '',
      commodity: '',
      quantity: 0,
      unit: '',
      nature: '',
      value: 0,
      feesPaid: 0,
      vehicleNumber: '',
      invoiceNumber: '',
      collectionLocation: '',
      collectedBy: '',
      designation: '',
      otherLocation: ''
    });
    // Focus back to first field after reset
    if (inputRefs.receiptDate.current) {
      inputRefs.receiptDate.current.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-3 py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Tuni Agricultural Market Committee</h1>
                <h2 className="text-md font-normal mt-1 opacity-90">New Receipt Entry</h2>
              </div>
              <div
                className="bg-white/20 rounded-full px-2 py-0.5 text-sm font-light backdrop-blur-sm"
                role="contentinfo"
                aria-label="Committee code"
              >
                Code: TUN-AMC
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4" noValidate>
            {/* Committee Information */}
            <section
              className="bg-gray-50 rounded-md p-3 border border-gray-100"
              aria-labelledby="committee-info"
            >
              <h3
                id="committee-info"
                className="text-base font-medium text-gray-700 mb-2 flex items-center"
              >
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Committee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Committee</p>
                  <p className="text-sm text-gray-500 mt-0.5">Tuni Agricultural Market Committee</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Checkposts</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {checkposts.length > 0 ? (
                      checkposts.map((loc) => (
                        <span
                          key={loc}
                          className="bg-white px-2 py-0.5 rounded-full text-sm text-gray-600 border border-gray-200 shadow-xs"
                        >
                          {loc}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No checkposts available</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Receipt Information */}
            <section aria-labelledby="receipt-info" className="space-y-2">
              <h3
                id="receipt-info"
                className="text-base font-medium text-gray-700 flex items-center"
              >
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Receipt Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label htmlFor="receiptDate" className="block text-sm font-normal text-gray-600 mb-2">
                    Receipt Date<span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={inputRefs.receiptDate}
                    type="date"
                    id="receiptDate"
                    {...register('receiptDate', { required: 'Receipt date is required' })}
                    onKeyDown={(e) => handleKeyDown(e, 'receiptDate')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white transition-colors"
                  />
                  {errors.receiptDate && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.receiptDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="bookNumber" className="block text-sm font-normal text-gray-600 mb-2">
                    Book Number<span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={inputRefs.bookNumber}
                    type="text"
                    id="bookNumber"
                    placeholder="Book number"
                    {...register('bookNumber', { required: 'Book number is required' })}
                    onKeyDown={(e) => handleKeyDown(e, 'bookNumber')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                  {errors.bookNumber && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.bookNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="receiptNumber"
                    className="block text-sm font-normal text-gray-600 mb-2"
                  >
                    Receipt Number<span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={inputRefs.receiptNumber}
                    type="text"
                    id="receiptNumber"
                    placeholder="Receipt number"
                    {...register('receiptNumber', { required: 'Receipt number is required' })}
                    onKeyDown={(e) => handleKeyDown(e, 'receiptNumber')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                  {errors.receiptNumber && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.receiptNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trader/Farmer Details */}
              <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center">
                  <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                  Trader/Farmer Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="traderName" className="block text-sm font-normal text-gray-600 mb-1">Trader/Farmer Name</label>
                    <input
                      ref={inputRefs.traderName}
                      type="text"
                      id="traderName"
                      placeholder="Trader/Farmer name"
                      {...register('traderName', { required: 'Trader name is required' })}
                      onKeyDown={(e) => handleKeyDown(e, 'traderName')}
                      className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white/70 transition-colors"
                    />
                    {errors.traderName && (
                      <p role="alert" className="text-red-600 text-xs mt-1">
                        {errors.traderName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="traderAddress" className="block text-sm font-normal text-gray-600 mb-1">Trader Address</label>
                    <textarea
                      ref={inputRefs.traderAddress}
                      id="traderAddress"
                      placeholder="Trader address"
                      {...register('traderAddress')}
                      onKeyDown={(e) => handleKeyDown(e, 'traderAddress')}
                      className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white/70 transition-colors"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Payee Details */}
              <div className="bg-teal-50 rounded-md p-3 border border-teal-100">
                <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center">
                  <span className="bg-teal-400 w-1.5 h-4 rounded-full mr-2"></span>
                  Payee Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="payeeName" className="block text-sm font-normal text-gray-600 mb-1">Payee Name</label>
                    <input
                      ref={inputRefs.payeeName}
                      type="text"
                      id="payeeName"
                      placeholder="Payee name"
                      {...register('payeeName')}
                      onKeyDown={(e) => handleKeyDown(e, 'payeeName')}
                      className="w-full px-3 py-1.5 text-sm border border-teal-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-teal-100 focus:border-teal-300 bg-white/70 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="payeeAddress" className="block text-sm font-normal text-gray-600 mb-1">Payee Address</label>
                    <textarea
                      ref={inputRefs.payeeAddress}
                      id="payeeAddress"
                      placeholder="Payee address"
                      {...register('payeeAddress')}
                      onKeyDown={(e) => handleKeyDown(e, 'payeeAddress')}
                      className="w-full px-3 py-1.5 text-sm border border-teal-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-teal-100 focus:border-teal-300 bg-white/70 transition-colors"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Commodity Details */}
            <section aria-labelledby="commodity-details" className="space-y-2">
              <h3
                id="commodity-details"
                className="text-base font-medium text-gray-700 flex items-center"
              >
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Commodity Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label htmlFor="commodity" className="block text-sm font-normal text-gray-600 mb-2">
                    Commodity<span className="text-red-600">*</span>
                  </label>
                  <select
                    ref={inputRefs.commodity}
                    id="commodity"
                    {...register('commodity', { required: 'Commodity is required' })}
                    onKeyDown={(e) => handleKeyDown(e, 'commodity')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]"
                  >
                    <option value="">Select commodity</option>
                    {commodities.map((commodity) => (
                      <option key={commodity} value={commodity}>
                        {commodity}
                      </option>
                    ))}
                  </select>
                  {errors.commodity && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.commodity.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-normal text-gray-600 mb-2">
                    Quantity<span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={inputRefs.quantity}
                    type="number"
                    id="quantity"
                    placeholder="Quantity"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 0, message: 'Quantity must be positive' }
                    })}
                    onKeyDown={(e) => handleKeyDown(e, 'quantity')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                  {errors.quantity && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="unit" className="block text-sm font-normal text-gray-600 mb-2">
                    Unit<span className="text-red-600">*</span>
                  </label>
                  <select
                    ref={inputRefs.unit}
                    id="unit"
                    {...register('unit', { required: 'Unit is required' })}
                    onKeyDown={(e) => handleKeyDown(e, 'unit')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]"
                  >
                    <option value="">Select unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.unit.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Nature Details */}
            <section aria-labelledby="nature-details" className="space-y-2">
              <h3
                id="nature-details"
                className="text-base font-medium text-gray-700 flex items-center"
              >
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Nature Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label htmlFor="nature" className="block text-sm font-normal text-gray-600 mb-2">
                    Nature<span className="text-red-600">*</span>
                  </label>
                  <select
                    ref={inputRefs.nature}
                    id="nature"
                    {...register('nature', { required: 'Nature is required' })}
                    onKeyDown={(e) => handleKeyDown(e, 'nature')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]"
                  >
                    <option value="">Select nature</option>
                    {natures.map((nature) => (
                      <option key={nature.value} value={nature.value}>
                        {nature.label}
                      </option>
                    ))}
                  </select>
                  {errors.nature && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.nature.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="value" className="block text-sm font-normal text-gray-600 mb-2">Value (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">₹</span>
                    </div>
                    <input
                      ref={inputRefs.value}
                      type="number"
                      id="value"
                      placeholder="Value"
                      {...register('value', { min: 0 })}
                      onKeyDown={(e) => handleKeyDown(e, 'value')}
                      className="w-full pl-6 pr-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="feesPaid" className="block text-sm font-normal text-gray-600 mb-2">Fees Paid (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">₹</span>
                    </div>
                    <input
                      ref={inputRefs.feesPaid}
                      type="number"
                      id="feesPaid"
                      placeholder="Fees paid"
                      {...register('feesPaid', { 
                        required: 'Fees paid is required',
                        min: { value: 0, message: 'Fees must be positive' }
                      })}
                      onKeyDown={(e) => handleKeyDown(e, 'feesPaid')}
                      className="w-full pl-6 pr-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300"
                    />
                    {errors.feesPaid && (
                      <p role="alert" className="text-red-600 text-xs mt-1">
                        {errors.feesPaid.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Collection Location */}
            <section aria-labelledby="collection-location" className="space-y-2">
              <h3
                id="collection-location"
                className="text-base font-medium text-gray-700 flex items-center"
              >
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Collection Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label htmlFor="vehicleNumber" className="block text-sm font-normal text-gray-600 mb-2">Vehicle Number</label>
                  <input
                    ref={inputRefs.vehicleNumber}
                    type="text"
                    id="vehicleNumber"
                    placeholder="Vehicle number"
                    {...register('vehicleNumber')}
                    onKeyDown={(e) => handleKeyDown(e, 'vehicleNumber')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="invoiceNumber" className="block text-sm font-normal text-gray-600 mb-2">Invoice Number</label>
                  <input
                    ref={inputRefs.invoiceNumber}
                    type="text"
                    id="invoiceNumber"
                    placeholder="Invoice number"
                    {...register('invoiceNumber')}
                    onKeyDown={(e) => handleKeyDown(e, 'invoiceNumber')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="collectionLocation" className="block text-sm font-normal text-gray-600 mb-2">Collection Location</label>
                  <select
                    ref={inputRefs.collectionLocation}
                    id="collectionLocation"
                    {...register('collectionLocation')}
                    onKeyDown={(e) => handleKeyDown(e, 'collectionLocation')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]"
                  >
                    <option value="">Select location</option>
                    <option value="office">Office</option>
                    <option value="checkpost">Checkpost</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {collectionLocation === 'checkpost' && checkposts.length > 0 && (
                  <div>
                    <label
                      htmlFor="otherLocation"
                      className="block text-sm font-normal text-gray-600 mb-2"
                    >
                      Checkpost
                    </label>
                    <select
                      id="otherLocation"
                      {...register('otherLocation')}
                      className="w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors"
                    >
                      <option value="">Select checkpost</option>
                      {checkposts.map((checkpost) => (
                        <option key={checkpost} value={checkpost}>
                          {checkpost}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {collectionLocation === 'other' && (
                  <div>
                    <label
                      htmlFor="otherLocationInput"
                      className="block text-sm font-normal text-gray-600 mb-2"
                    >
                      Other Location
                    </label>
                    <input
                      id="otherLocationInput"
                      type="text"
                      placeholder="Enter other location"
                      {...register('otherLocation')}
                      className="w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Generated By */}
            <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
              <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center">
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Generated By
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="collectedBy" className="block text-sm font-normal text-gray-600 mb-2">Generated By</label>
                  <input
                    ref={inputRefs.generatedBy}
                    type="text"
                    id="collectedBy"
                    placeholder="Generated by"
                    {...register('collectedBy', { required: 'Generated by is required' })}
                    onKeyDown={(e) => handleKeyDown(e, 'collectedBy')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                  {errors.collectedBy && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.collectedBy.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="designation" className="block text-sm font-normal text-gray-600 mb-2">Designation</label>
                  <input
                    ref={inputRefs.designation}
                    type="text"
                    id="designation"
                    placeholder="Designation"
                    {...register('designation', { required: 'Designation is required' })}
                    onKeyDown={(e) => handleKeyDown(e, 'designation')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                  {errors.designation && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.designation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  !isValid || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                aria-disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Receipt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReceipt;