import React, { useState, useRef, useEffect } from 'react';

const AddReceipt: React.FC = () => {
  const [formData, setFormData] = useState({
    receiptDate: '2025-06-30',
    bookNumber: '',
    receiptNumber: '',
    traderName: '',
    traderAddress: '',
    payeeName: '',
    payeeAddress: '',
    commodity: '',
    quantity: '',
    unit: '',
    nature: '',
    value: '',
    feesPaid: '',
    vehicleNumber: '',
    invoiceNumber: '',
    collectionLocation: '',
    generatedBy: '',
    designation: ''
  });

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

  const units = ['Kg', 'Quintal', 'Ton'];
  const natures = ['Purchase', 'Sale', 'Commission'];
  const checkposts = ['Tuni', 'K/P Puram', 'Rekavanipalem'];
  const commodities = ['Rice', 'Wheat', 'Maize'];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      receiptDate: '2025-06-30',
      bookNumber: '',
      receiptNumber: '',
      traderName: '',
      traderAddress: '',
      payeeName: '',
      payeeAddress: '',
      commodity: '',
      quantity: '',
      unit: '',
      nature: '',
      value: '',
      feesPaid: '',
      vehicleNumber: '',
      invoiceNumber: '',
      collectionLocation: '',
      generatedBy: '',
      designation: ''
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
              <div className="bg-white/20 rounded-full px-2 py-0.5 text-sm font-light backdrop-blur-sm">
                Code: TUN-AMC
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Committee Information */}
            <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
              <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center">
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
                    {checkposts.map(loc => (
                      <span key={loc} className="bg-white px-2 py-0.5 rounded-full text-sm text-gray-600 border border-gray-200 shadow-xs">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Information */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-gray-700 flex items-center">
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Receipt Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Receipt Date</label>
                  <input
                    ref={inputRefs.receiptDate}
                    type="date"
                    name="receiptDate"
                    value={formData.receiptDate}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'receiptDate')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Book Number</label>
                  <input
                    ref={inputRefs.bookNumber}
                    type="text"
                    name="bookNumber"
                    placeholder="Book number"
                    value={formData.bookNumber}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'bookNumber')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Receipt Number</label>
                  <input
                    ref={inputRefs.receiptNumber}
                    type="text"
                    name="receiptNumber"
                    placeholder="Receipt number"
                    value={formData.receiptNumber}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'receiptNumber')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Trader/Farmer Details */}
  <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
    <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center">
      <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
      Trader/Farmer Details
    </h3>
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-normal text-gray-600 mb-1">Trader/Farmer Name</label>
        <input
          ref={inputRefs.traderName}
          type="text"
          name="traderName"
          placeholder="Trader/Farmer name"
          value={formData.traderName}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e, 'traderName')}
          className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white/70 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-normal text-gray-600 mb-1">Trader Address</label>
        <input
          ref={inputRefs.traderAddress}
          type="text"
          name="traderAddress"
          placeholder="Trader address"
          value={formData.traderAddress}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e, 'traderAddress')}
          className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white/70 transition-colors"
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
        <label className="block text-sm font-normal text-gray-600 mb-1">Payee Name</label>
        <input
          ref={inputRefs.payeeName}
          type="text"
          name="payeeName"
          placeholder="Payee name"
          value={formData.payeeName}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e, 'payeeName')}
          className="w-full px-3 py-1.5 text-sm border border-teal-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-teal-100 focus:border-teal-300 bg-white/70 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-normal text-gray-600 mb-1">Payee Address</label>
        <input
          ref={inputRefs.payeeAddress}
          type="text"
          name="payeeAddress"
          placeholder="Payee address"
          value={formData.payeeAddress}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e, 'payeeAddress')}
          className="w-full px-3 py-1.5 text-sm border border-teal-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-teal-100 focus:border-teal-300 bg-white/70 transition-colors"
        />
      </div>
    </div>
  </div>
</div>


            {/* Commodity Details */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-gray-700 flex items-center">
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Commodity Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Commodity</label>
                  <select
                    ref={inputRefs.commodity}
                    name="commodity"
                    value={formData.commodity}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'commodity')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]"
                  >
                    <option value="">Select commodity</option>
                    {commodities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Quantity</label>
                  <input
                    ref={inputRefs.quantity}
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'quantity')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Unit</label>
                  <select
                    ref={inputRefs.unit}
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'unit')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]"
                  >
                    <option value="">Select unit</option>
                    {units.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
              <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center">
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Financial Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Nature of Receipt</label>
                  <select
                    ref={inputRefs.nature}
                    name="nature"
                    value={formData.nature}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'nature')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]"
                  >
                    <option value="">Select nature</option>
                    {natures.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Value (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">₹</span>
                    </div>
                    <input
                      ref={inputRefs.value}
                      type="number"
                      name="value"
                      placeholder="Value"
                      value={formData.value}
                      onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e, 'value')}
                      className="w-full pl-6 pr-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Fees Paid (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">₹</span>
                    </div>
                    <input
                      ref={inputRefs.feesPaid}
                      type="number"
                      name="feesPaid"
                      placeholder="Fees paid"
                      value={formData.feesPaid}
                      onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e, 'feesPaid')}
                      className="w-full pl-6 pr-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-gray-700 flex items-center">
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Additional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Vehicle Number</label>
                  <input
                    ref={inputRefs.vehicleNumber}
                    type="text"
                    name="vehicleNumber"
                    placeholder="Vehicle number"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'vehicleNumber')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Invoice Number</label>
                  <input
                    ref={inputRefs.invoiceNumber}
                    type="text"
                    name="invoiceNumber"
                    placeholder="Invoice number"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'invoiceNumber')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Collection Location</label>
                  <select
                    ref={inputRefs.collectionLocation}
                    name="collectionLocation"
                    value={formData.collectionLocation}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'collectionLocation')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjRCNUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem]"
                  >
                    <option value="">Select location</option>
                    {checkposts.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Generated By */}
            <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
              <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center">
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Generated By
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Generated By</label>
                  <input
                    ref={inputRefs.generatedBy}
                    type="text"
                    name="generatedBy"
                    placeholder="Generated by"
                    value={formData.generatedBy}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'generatedBy')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-2">Designation</label>
                  <input
                    ref={inputRefs.designation}
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'designation')}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Compact Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-100 transition-colors shadow-xs"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-sm border border-transparent rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-colors shadow-xs"
              >
                Save Receipt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReceipt;