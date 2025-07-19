import {useState, useEffect} from 'react';
import {z} from 'zod';
import {
  type CreateReceiptRequest,
  CreateReceiptSchema,
  type UpdateReceipt,
} from '@/types/receipt';
import api, {isAxiosError} from '@/lib/axiosInstance';
import FormReceipt from './FormReceipt';
import {useAuthStore} from '@/stores/authStore';
import useInitialData from '@/hooks/useInititalData';
import toast from 'react-hot-toast';

// Define types for better readability and maintenance
type FormData = Omit<z.infer<typeof CreateReceiptSchema>, 'receiptDate'>;

interface ReceiptEntryProps {
  receiptToEdit?: UpdateReceipt;
}

// Helper to generate initial form data, ensuring type safety
const getInitialFormData = (committeeId?: string): FormData => ({
  bookNumber: '',
  receiptNumber: '',
  newTraderName: '',
  traderName: '',
  traderAddress: '',
  payeeName: '',
  payeeAddress: '',
  commodity: '',
  newCommodityName: '',
  quantity: 0,
  unit: 'kilograms',
  weightPerBag: undefined,
  natureOfReceipt: 'mf',
  natureOtherText: '',
  value: 0,
  feesPaid: 0,
  vehicleNumber: '',
  invoiceNumber: '',
  collectionLocation: 'office',
  officeSupervisor: '',
  checkpostId: '',
  collectionOtherText: '',
  receiptSignedBy: '',
  designation: '',
  committeeId: committeeId || '',
});

const ReceiptEntry = ({receiptToEdit}: ReceiptEntryProps) => {
  const {committee} = useAuthStore();
  const [formData, setFormData] = useState<FormData>(
    getInitialFormData(committee?.id)
  );
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {commodities, traders, availableCheckposts} = useInitialData(
    committee?.id
  );
  const [loading, setLoading] = useState(false);
  const [commoditySearch, setCommoditySearch] = useState('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEditing = !!receiptToEdit;

  useEffect(() => {
    if (receiptToEdit) {
      const {receiptDate, ...rest} = receiptToEdit;
      setFormData(rest as FormData);
      setDate(new Date(receiptDate));
      // Set commodity search to match the commodity value
      setCommoditySearch(rest.commodity || '');
    } else {
      setFormData(getInitialFormData(committee?.id));
      setDate(new Date());
      setCommoditySearch('');
    }
  }, [receiptToEdit, committee]);

  const handleFormChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleReset = () => {
    setFormData(getInitialFormData(committee?.id));
    setDate(new Date());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const payload: CreateReceiptRequest = {
      ...formData,
      receiptDate: date ? date.toISOString() : new Date().toISOString(),
      quantity: Number(formData.quantity),
      value: Number(formData.value),
      feesPaid: Number(formData.feesPaid),
    };

    const validation = CreateReceiptSchema.safeParse(payload);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      console.error('Validation Errors:', errors);

      // Find the first error message
      const firstError = Object.values(errors)[0]?.[0];
      const errorMsg =
        firstError || 'Please fill all required fields correctly';

      // Show error toast
      toast.error(errorMsg, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #F87171',
        },
      });

      // Set error message for form highlighting
      setErrorMessage(errorMsg);
      setLoading(false);

      // Find the first field with an error and focus it
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({behavior: 'smooth', block: 'center'});
          setTimeout(() => element.focus(), 500);
        }
      }

      return;
    }

    try {
      if (isEditing) {
        await api.put(`/receipts/${receiptToEdit.id}`, validation.data);
        toast.success('Receipt updated successfully!');
        setIsSuccessDialogOpen(true);
      } else {
        await api.post('/receipts/createReceipt', validation.data);
        toast.success('Receipt created successfully!');
        setIsSuccessDialogOpen(true);
        handleReset();
      }
    } catch (error) {
      let errorMsg = 'An error occurred while saving the receipt.';

      if (isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      // Show error toast for server errors
      toast.error(errorMsg, {
        duration: 5000,
        position: 'top-center',
      });

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormReceipt
        formData={formData}
        onFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        date={date}
        onDateChange={handleDateChange}
        isEditing={isEditing}
        loading={loading}
        committeeData={committee}
        availableCheckposts={availableCheckposts}
        commodities={commodities}
        traders={traders}
        commoditySearch={commoditySearch}
        setCommoditySearch={setCommoditySearch}
        errorMessage={errorMessage}
        onErrorDismiss={() => setErrorMessage(null)}
      />

      {/* Success Dialog */}
      {isSuccessDialogOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full'>
            <div className='text-center'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
                <svg
                  className='h-6 w-6 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h3 className='mt-3 text-lg font-medium text-gray-900'>
                Success!
              </h3>
              <div className='mt-2 text-sm text-gray-500'>
                Receipt has been {isEditing ? 'updated' : 'created'}{' '}
                successfully.
              </div>
              <div className='mt-4'>
                <button
                  type='button'
                  className='inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm'
                  onClick={() => setIsSuccessDialogOpen(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiptEntry;
