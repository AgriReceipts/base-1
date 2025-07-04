import React, { useState } from 'react';
import { Plus, Save, AlertCircle } from 'lucide-react';
import type { Receipt } from '../types';
import { committees, commodities } from '../data/committees';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ReceiptEntry: React.FC = () => {
  const [receipts, setReceipts] = useLocalStorage<Receipt[]>('receipts', []);
  const [formData, setFormData] = useState({
    bookNumber: '',
    receiptNumber: '',
    date: '',
    traderName: '',
    payeeName: '',
    commodity: '',
    transactionValue: '',
    marketFee: '',
    natureOfReceipt: 'mf' as 'mf' | 'others',
    natureOfReceiptOther: '',
    collectionLocation: 'office' as 'office' | 'checkpost' | 'supervisor',
    collectionLocationOther: '',
    checkpostName: '',
    supervisorName: '',
    committeeId: '',
    financialYear: '2025-26' as '2024-25' | '2025-26',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bookNumber) newErrors.bookNumber = 'Book number is required';
    if (!formData.receiptNumber) newErrors.receiptNumber = 'Receipt number is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.traderName) newErrors.traderName = 'Trader name is required';
    if (!formData.payeeName) newErrors.payeeName = 'Payee name is required';
    if (!formData.commodity) newErrors.commodity = 'Commodity is required';
    if (!formData.transactionValue) newErrors.transactionValue = 'Transaction value is required';
    if (!formData.marketFee) newErrors.marketFee = 'Market fee is required';
    if (!formData.committeeId) newErrors.committeeId = 'Committee is required';

    if (formData.natureOfReceipt === 'others' && !formData.natureOfReceiptOther) {
      newErrors.natureOfReceiptOther = 'Please specify nature of receipt';
    }

    if (formData.collectionLocation === 'checkpost' && !formData.checkpostName) {
      newErrors.checkpostName = 'Please select checkpost';
    }

    if (formData.collectionLocation === 'supervisor' && !formData.supervisorName) {
      newErrors.supervisorName = 'Please enter supervisor name';
    }

    // Check for duplicate receipt
    const duplicate = receipts.find(
      receipt => 
        receipt.bookNumber === formData.bookNumber &&
        receipt.receiptNumber === formData.receiptNumber &&
        receipt.committeeId === formData.committeeId
    );

    if (duplicate) {
      newErrors.receiptNumber = 'Receipt number already exists for this book and committee';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newReceipt: Receipt = {
      id: Date.now().toString(),
      bookNumber: formData.bookNumber,
      receiptNumber: formData.receiptNumber,
      date: formData.date,
      traderName: formData.traderName,
      payeeName: formData.payeeName,
      commodity: formData.commodity,
      transactionValue: parseFloat(formData.transactionValue),
      marketFee: parseFloat(formData.marketFee),
      natureOfReceipt: formData.natureOfReceipt,
      natureOfReceiptOther: formData.natureOfReceiptOther,
      collectionLocation: formData.collectionLocation,
      collectionLocationOther: formData.collectionLocationOther,
      checkpostName: formData.checkpostName,
      supervisorName: formData.supervisorName,
      committeeId: formData.committeeId,
      financialYear: formData.financialYear,
      createdAt: new Date().toISOString(),
    };

    setReceipts([...receipts, newReceipt]);
    
    // Reset form
    setFormData({
      bookNumber: '',
      receiptNumber: '',
      date: '',
      traderName: '',
      payeeName: '',
      commodity: '',
      transactionValue: '',
      marketFee: '',
      natureOfReceipt: 'mf',
      natureOfReceiptOther: '',
      collectionLocation: 'office',
      collectionLocationOther: '',
      checkpostName: '',
      supervisorName: '',
      committeeId: '',
      financialYear: '2025-26',
    });
    setErrors({});

    alert('Receipt saved successfully!');
  };

  const selectedCommittee = committees.find(c => c.id === formData.committeeId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Plus className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Receipt Entry</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Committee Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agricultural Market Committee *
              </label>
              <select
                value={formData.committeeId}
                onChange={(e) => setFormData({ ...formData, committeeId: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.committeeId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Committee</option>
                {committees.map((committee) => (
                  <option key={committee.id} value={committee.id}>
                    {committee.name} ({committee.code})
                  </option>
                ))}
              </select>
              {errors.committeeId && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.committeeId}
                </p>
              )}
            </div>

            {/* Book Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Number *
              </label>
              <input
                type="text"
                value={formData.bookNumber}
                onChange={(e) => setFormData({ ...formData, bookNumber: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bookNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter book number"
              />
              {errors.bookNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.bookNumber}
                </p>
              )}
            </div>

            {/* Receipt Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Number *
              </label>
              <input
                type="text"
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.receiptNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter receipt number"
              />
              {errors.receiptNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.receiptNumber}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Financial Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financial Year *
              </label>
              <select
                value={formData.financialYear}
                onChange={(e) => setFormData({ ...formData, financialYear: e.target.value as '2024-25' | '2025-26' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>

            {/* Trader Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trader Name *
              </label>
              <input
                type="text"
                value={formData.traderName}
                onChange={(e) => setFormData({ ...formData, traderName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.traderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter trader name"
              />
              {errors.traderName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.traderName}
                </p>
              )}
            </div>

            {/* Payee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payee Name *
              </label>
              <input
                type="text"
                value={formData.payeeName}
                onChange={(e) => setFormData({ ...formData, payeeName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.payeeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter payee name"
              />
              {errors.payeeName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.payeeName}
                </p>
              )}
            </div>

            {/* Commodity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commodity *
              </label>
              <select
                value={formData.commodity}
                onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.commodity ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Commodity</option>
                {commodities.map((commodity) => (
                  <option key={commodity} value={commodity}>
                    {commodity}
                  </option>
                ))}
              </select>
              {errors.commodity && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.commodity}
                </p>
              )}
            </div>

            {/* Transaction Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Value (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.transactionValue}
                onChange={(e) => setFormData({ ...formData, transactionValue: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.transactionValue ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter transaction value"
              />
              {errors.transactionValue && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.transactionValue}
                </p>
              )}
            </div>

            {/* Market Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Fee (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.marketFee}
                onChange={(e) => setFormData({ ...formData, marketFee: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.marketFee ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter market fee"
              />
              {errors.marketFee && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.marketFee}
                </p>
              )}
            </div>

            {/* Nature of Receipt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nature of Receipt *
              </label>
              <select
                value={formData.natureOfReceipt}
                onChange={(e) => setFormData({ ...formData, natureOfReceipt: e.target.value as 'mf' | 'others' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mf">Market Fee (MF)</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Nature of Receipt Other */}
            {formData.natureOfReceipt === 'others' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specify Nature of Receipt *
                </label>
                <input
                  type="text"
                  value={formData.natureOfReceiptOther}
                  onChange={(e) => setFormData({ ...formData, natureOfReceiptOther: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.natureOfReceiptOther ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter nature of receipt"
                />
                {errors.natureOfReceiptOther && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.natureOfReceiptOther}
                  </p>
                )}
              </div>
            )}

            {/* Collection Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Location *
              </label>
              <select
                value={formData.collectionLocation}
                onChange={(e) => setFormData({ ...formData, collectionLocation: e.target.value as 'office' | 'checkpost' | 'supervisor' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="office">Office</option>
                <option value="checkpost">Checkpost</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            {/* Checkpost Name */}
            {formData.collectionLocation === 'checkpost' && selectedCommittee?.hasCheckposts && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checkpost Name *
                </label>
                <select
                  value={formData.checkpostName}
                  onChange={(e) => setFormData({ ...formData, checkpostName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.checkpostName ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Checkpost</option>
                  {selectedCommittee.checkposts.map((checkpost) => (
                    <option key={checkpost} value={checkpost}>
                      {checkpost}
                    </option>
                  ))}
                </select>
                {errors.checkpostName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.checkpostName}
                  </p>
                )}
              </div>
            )}

            {/* Supervisor Name */}
            {formData.collectionLocation === 'supervisor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supervisor Name *
                </label>
                <input
                  type="text"
                  value={formData.supervisorName}
                  onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.supervisorName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter supervisor name"
                />
                {errors.supervisorName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.supervisorName}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Receipt
            </button>
          </div>
        </form>
      </div>

      {/* Recent Receipts */}
      {receipts.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Receipts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Committee
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receipts.slice(-5).reverse().map((receipt) => {
                  const committee = committees.find(c => c.id === receipt.committeeId);
                  return (
                    <tr key={receipt.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {receipt.receiptNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(receipt.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {receipt.traderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{receipt.marketFee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {committee?.code}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptEntry;