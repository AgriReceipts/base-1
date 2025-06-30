import React, { useEffect } from 'react';
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      receiptDate: new Date().toISOString().split('T')[0],
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
      otherLocation: '',
    },
  });

  const nature = watch('nature');
  const value = watch('value');
  const collectionLocation = watch('collectionLocation');

  useEffect(() => {
    if (nature === 'mf') {
      // Set feesPaid to value if nature is market fees
      // Use setValue from useForm instead of control
      setValue('feesPaid', value);
    }
  }, [nature, value, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const newReceipt = {
        id: uuidv4(),
        ...data,
        quantity: data.quantity.toString(),
        value: data.value.toString(),
        feesPaid: data.feesPaid.toString(),
        collectionLocation:
          data.collectionLocation === 'other' ? data.otherLocation : data.collectionLocation,
      };
      await addReceipt(newReceipt);
      alert('Receipt saved successfully!');
      reset();
    } catch (error: any) {
      alert('Failed to save receipt: ' + (error.message || 'Unknown error'));
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
                    id="receiptDate"
                    type="date"
                    {...register('receiptDate', { required: 'Receipt date is required' })}
                    aria-invalid={errors.receiptDate ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.receiptDate
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    } bg-white`}
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
                    id="bookNumber"
                    type="text"
                    placeholder="Book number"
                    {...register('bookNumber', { required: 'Book number is required' })}
                    aria-invalid={errors.bookNumber ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.bookNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
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
                    id="receiptNumber"
                    type="text"
                    placeholder="Receipt number"
                    {...register('receiptNumber', { required: 'Receipt number is required' })}
                    aria-invalid={errors.receiptNumber ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.receiptNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
                  />
                  {errors.receiptNumber && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.receiptNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Trader/Farmer Details */}
            <section
              aria-labelledby="trader-details"
              className="bg-blue-50 rounded-md p-3 border border-blue-100"
            >
              <h3
                id="trader-details"
                className="text-base font-medium text-gray-700 mb-2 flex items-center"
              >
                <span className="bg-blue-400 w-1.5 h-4 rounded-full mr-2"></span>
                Trader/Farmer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="traderName"
                    className="block text-sm font-normal text-gray-600 mb-2"
                  >
                    Trader/Farmer Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="traderName"
                    type="text"
                    placeholder="Trader/farmer name"
                    {...register('traderName', { required: 'Trader/Farmer name is required' })}
                    aria-invalid={errors.traderName ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.traderName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-blue-200 focus:ring-blue-100 focus:border-blue-300'
                    } bg-white/70`}
                  />
                  {errors.traderName && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.traderName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="traderAddress"
                    className="block text-sm font-normal text-gray-600 mb-2"
                  >
                    Trader Address
                  </label>
                  <textarea
                    id="traderAddress"
                    placeholder="Trader address"
                    {...register('traderAddress')}
                    rows={2}
                    className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white/70 transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Payee Details */}
            <section
              aria-labelledby="payee-details"
              className="bg-teal-50 rounded-md p-3 border border-teal-100"
            >
              <h3
                id="payee-details"
                className="text-base font-medium text-gray-700 mb-2 flex items-center"
              >
                <span className="bg-teal-400 w-1.5 h-4 rounded-full mr-2"></span>
                Payee Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="payeeName" className="block text-sm font-normal text-gray-600 mb-2">
                    Payee Name
                  </label>
                  <input
                    id="payeeName"
                    type="text"
                    placeholder="Payee name"
                    {...register('payeeName')}
                    className="w-full px-3 py-1.5 text-sm border border-teal-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-teal-100 focus:border-teal-300 bg-white/70 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="payeeAddress"
                    className="block text-sm font-normal text-gray-600 mb-2"
                  >
                    Payee Address
                  </label>
                  <textarea
                    id="payeeAddress"
                    placeholder="Payee address"
                    {...register('payeeAddress')}
                    rows={2}
                    className="w-full px-3 py-1.5 text-sm border border-teal-200 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-teal-100 focus:border-teal-300 bg-white/70 transition-colors"
                  />
                </div>
              </div>
            </section>

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
                    id="commodity"
                    {...register('commodity', { required: 'Commodity is required' })}
                    aria-invalid={errors.commodity ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.commodity
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
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
                    id="quantity"
                    type="number"
                    {...register('quantity', {
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be greater than zero' },
                    })}
                    aria-invalid={errors.quantity ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.quantity
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
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
                    id="unit"
                    {...register('unit', { required: 'Unit is required' })}
                    aria-invalid={errors.unit ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.unit
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
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
                    id="nature"
                    {...register('nature', { required: 'Nature is required' })}
                    aria-invalid={errors.nature ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.nature
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
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
                  <label htmlFor="value" className="block text-sm font-normal text-gray-600 mb-2">
                    Value<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="value"
                    type="number"
                    {...register('value', {
                      required: 'Value is required',
                      min: { value: 0, message: 'Value must be non-negative' },
                    })}
                    aria-invalid={errors.value ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.value
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
                  />
                  {errors.value && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.value.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="feesPaid" className="block text-sm font-normal text-gray-600 mb-2">
                    Fees Paid
                  </label>
                  <input
                    id="feesPaid"
                    type="number"
                    {...register('feesPaid', {
                      min: { value: 0, message: 'Fees Paid must be non-negative' },
                    })}
                    aria-invalid={errors.feesPaid ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.feesPaid
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
                    readOnly={nature === 'mf'}
                  />
                  {errors.feesPaid && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.feesPaid.message}
                    </p>
                  )}
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
                  <label
                    htmlFor="collectionLocation"
                    className="block text-sm font-normal text-gray-600 mb-2"
                  >
                    Collection Location<span className="text-red-600">*</span>
                  </label>
                  <select
                    id="collectionLocation"
                    {...register('collectionLocation', { required: 'Collection location is required' })}
                    aria-invalid={errors.collectionLocation ? 'true' : 'false'}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors ${
                      errors.collectionLocation
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300'
                    }`}
                  >
                    <option value="">Select location</option>
                    <option value="office">Office</option>
                    <option value="checkpost">Checkpost</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.collectionLocation && (
                    <p role="alert" className="text-red-600 text-xs mt-1">
                      {errors.collectionLocation.message}
                    </p>
                  )}
                </div>

                {collectionLocation === 'office' && (
                  <>
                    <div>
                      <label
                        htmlFor="collectedBy"
                        className="block text-sm font-normal text-gray-600 mb-2"
                      >
                        Collected By
                      </label>
                      <select
                        id="collectedBy"
                        {...register('collectedBy')}
                        className="w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors"
                      >
                        <option value="">Select supervisor</option>
                        {supervisors.map((supervisor) => (
                          <option key={supervisor} value={supervisor}>
                            {supervisor}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="designation"
                        className="block text-sm font-normal text-gray-600 mb-2"
                      >
                        Designation
                      </label>
                      <input
                        id="designation"
                        type="text"
                        placeholder="Enter designation"
                        {...register('designation')}
                        className="w-full px-3 py-1.5 text-sm border rounded-md shadow-xs focus:outline-none focus:ring-1 transition-colors"
                      />
                    </div>
                  </>
                )}

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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`w-full py-2 rounded-md text-white transition-colors ${
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
