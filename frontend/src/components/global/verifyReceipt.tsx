import React, {useState, useEffect} from 'react';
import VefrifyForm from './verifyReciptUi';
import {
  validateForm,
  type Committee,
  type VerificationResult,
} from '@/types/verifyReceipt';
import api from '@/lib/axiosInstance';

const VerifyReceipt: React.FC = () => {
  const [formData, setFormData] = useState({
    receiptNumber: '',
    bookNumber: '',
    committeeId: '',
  });

  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCommittees, setLoadingCommittees] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load committees on component mount
  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    setLoadingCommittees(true);
    try {
      const response = await api.get('/metaData/committees');
      if (response.status === 200) {
        const committees = response.data.data;
        setCommittees(committees);
      } else {
        setCommittees([
          {
            id: '310f2486-134e-472d-a02f-343d70df970e',
            name: 'Karapa',
          },
          {
            id: '1c17dc33-3bfd-4256-ba93-6c24a8a3815f',
            name: 'Kakinada Rural',
          },
          {
            id: 'e9ad8e67-73ed-4f1f-852e-b1028870326c',
            name: 'Pithapuram',
          },
          {
            id: '8fac59ef-59e5-46e3-8e84-24d116b0c656',
            name: 'Tuni',
          },
          {
            id: '63cce4c8-3870-466d-9e01-dd6d8c327b10',
            name: 'Prathipadu',
          },
          {
            id: '39500bc4-4836-4762-ba96-c9a450dce3b7',
            name: 'Jaggampeta',
          },
          {
            id: 'f1c0fe8c-ff3a-46dc-bd52-c750daa67a29',
            name: 'Peddapuram',
          },
          {
            id: '80c6cd56-32f5-4860-a4fe-2c6cc601b746',
            name: 'Samalkota',
          },
          {
            id: '03058c04-4476-457b-9377-9d9eb6d3f7d5',
            name: 'Kakinada',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching committees:', error);
    } finally {
      setLoadingCommittees(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setVerificationResult(null);

    try {
      const queryParams = new URLSearchParams();
      if (formData.receiptNumber)
        queryParams.append('receiptNumber', formData.receiptNumber);
      if (formData.bookNumber)
        queryParams.append('bookNumber', formData.bookNumber);
      if (formData.committeeId)
        queryParams.append('committeeId', formData.committeeId);
      const response = await api.get(`receipts/verifyReceipt?${queryParams}`);
      const result = response.data;

      if (response.status === 200) {
        setVerificationResult({
          success: true,
          message: 'Receipt found',
          receipts: result.data,
        });
        console.log('the result data', result.data);
        console.log('the recipt', verificationResult?.receipts);
      } else {
        setVerificationResult({
          success: false,
          message: 'Receipt not found or invalid',
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setVerificationResult({
          success: false,
          message: 'Receipt not found',
        });
      } else {
        console.error('Unexpected error verifying receipt:', error);
        setVerificationResult({
          success: false,
          message: 'Error occurred while verifying receipt',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      receiptNumber: '',
      bookNumber: '',
      committeeId: '',
    });
    setErrors({});
    setVerificationResult(null);
  };

  return (
    <>
      <VefrifyForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleReset={handleReset}
        handleSubmit={handleSubmit}
        committees={committees}
        loading={loading}
        loadingCommittees={loadingCommittees}
        verificationResult={verificationResult}
        errors={errors}
      />
    </>
  );
};

export default VerifyReceipt;
