import React, { useState } from 'react';

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

  const units = ['Kg', 'Quintal', 'Ton'];
  const natures = ['Purchase', 'Sale', 'Commission'];
  const checkposts = ['Tuni', 'K/P Puram', 'Rekavanipalem'];
  const commodities = ['Rice', 'Wheat', 'Maize'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Tuni Agricultural Market Committee</h1>
                <h2 className="text-xl font-medium mt-1">New Receipt Entry</h2>
                <p className="text-cyan-100 mt-2">Enter details for a new trade receipt</p>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
                Code: TUN-AMC
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6">
            {/* Committee Information */}
            <div className="bg-slate-100 rounded-lg p-5 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                <span className="bg-blue-500 w-1.5 h-5 rounded-full mr-2"></span>
                Committee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="font-medium text-slate-700">Market Committee</p>
                  <p className="text-slate-600">Tuni Agricultural Market Committee</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-slate-700">Available Checkposts</p>
                  <div className="flex flex-wrap gap-2">
                    {checkposts.map(loc => (
                      <span key={loc} className="bg-white px-3 py-1 rounded-full text-sm text-slate-700 border border-slate-200">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Receipt Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                <span className="bg-blue-500 w-1.5 h-5 rounded-full mr-2"></span>
                Receipt Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Receipt Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="receiptDate"
                      value={formData.receiptDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Book Number</label>
                  <input
                    type="text"
                    name="bookNumber"
                    placeholder="Enter book number"
                    value={formData.bookNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Receipt Number</label>
                  <input
                    type="text"
                    name="receiptNumber"
                    placeholder="Enter receipt number"
                    value={formData.receiptNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Trader/Farmer Details */}
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <span className="bg-blue-500 w-1.5 h-5 rounded-full mr-2"></span>
                Trader/Farmer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Trader/Farmer Name</label>
                  <input
                    type="text"
                    name="traderName"
                    placeholder="Enter trader/farmer name"
                    value={formData.traderName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Trader Address</label>
                  <textarea
                    name="traderAddress"
                    placeholder="Enter trader address"
                    value={formData.traderAddress}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payee Details */}
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <span className="bg-blue-500 w-1.5 h-5 rounded-full mr-2"></span>
                Payee Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Payee Name</label>
                  <input
                    type="text"
                    name="payeeName"
                    placeholder="Enter payee name"
                    value={formData.payeeName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Payee Address</label>
                  <textarea
                    name="payeeAddress"
                    placeholder="Enter payee address"
                    value={formData.payeeAddress}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Commodity Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                <span className="bg-blue-500 w-1.5 h-5 rounded-full mr-2"></span>
                Commodity Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Commodity</label>
                  <select
                    name="commodity"
                    value={formData.commodity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjd2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem]"
                  >
                    <option value="">Select commodity</option>
                    {commodities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjd2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem]"
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
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <span className="bg-blue-500 w-1.5 h-5 rounded-full mr-2"></span>
                Financial Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Nature of Receipt</label>
                  <select
                    name="nature"
                    value={formData.nature}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjd2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem]"
                  >
                    <option value="">Select nature</option>
                    {natures.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Value (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500">₹</span>
                    </div>
                    <input
                      type="number"
                      name="value"
                      placeholder="Enter value"
                      value={formData.value}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Fees Paid (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500">₹</span>
                    </div>
                    <input
                      type="number"
                      name="feesPaid"
                      placeholder="Enter fees paid"
                      value={formData.feesPaid}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                <span className="bg-blue-500 w-1.5 h-5 rounded-full mr-2"></span>
                Additional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    placeholder="Enter vehicle number"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    placeholder="Enter invoice number"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Collection Location</label>
                  <select
                    name="collectionLocation"
                    value={formData.collectionLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjd2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem]"
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
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <span className="bg-blue-500 w-1.5 h-5 rounded-full mr-2"></span>
                Generated By
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Generated By</label>
                  <input
                    type="text"
                    name="generatedBy"
                    placeholder="Enter who generated this receipt"
                    value={formData.generatedBy}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Enter designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
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