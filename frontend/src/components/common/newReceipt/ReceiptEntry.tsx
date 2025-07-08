import {useState, useEffect, useCallback} from 'react';
import {toast} from 'react-hot-toast';
import {z} from 'zod';
import {
  type CreateReceiptRequest,
  CreateReceiptSchema,
  type EditReceipt,
} from '@/types/receipt';
import api, {isAxiosError} from '@/lib/axiosInstance';
import FormReceipt from './FormReceipt';
import {useAuthStore} from '@/stores/authStore';
import useInitialData from '@/hooks/useInititalData';

// Define types for better readability and maintenance
type FormData = Omit<z.infer<typeof CreateReceiptSchema>, 'receiptDate'>;
type Commodity = string;
type Checkpost = {id: string; name: string};
type Trader = string;

interface ReceiptEntryProps {
  receiptToEdit?: EditReceipt;
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
  // @ts-ignore
  quantity: '',
  unit: 'kilograms',
  natureOfReceipt: 'mf',
  natureOtherText: '',
  // @ts-ignore
  value: '',
  // @ts-ignore
  feesPaid: '',
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
  const isEditing = !!receiptToEdit;

  useEffect(() => {
    if (receiptToEdit) {
      const {receiptDate, ...rest} = receiptToEdit;
      setFormData(rest as FormData);
      setDate(new Date(receiptDate));
    } else {
      setFormData(getInitialFormData(committee?.id));
      setDate(new Date());
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
      Object.values(errors).forEach((err) => toast.error(err[0]));
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/receipts/${receiptToEdit.id}`, validation.data);
        toast.success('Receipt updated successfully!');
      } else {
        await api.post('/receipts/createReceipt', validation.data);
        toast.success('Receipt saved successfully!');
        handleReset();
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while saving the receipt.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
    />
  );
};

export default ReceiptEntry;
