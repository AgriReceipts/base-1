import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {ReceiptForm} from './ReceiptForm';

import {v4 as uuidv4} from 'uuid';
import {CreateReceiptSchema, type CreateReceiptRequest} from '@/types/receipt';

export const AddReceiptContainer: React.FC = () => {
  const form = useForm<CreateReceiptRequest>({
    resolver: zodResolver(CreateReceiptSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: CreateReceiptRequest) => {
    try {
      const res = await axios.post('/api/receipts/create', {
        id: uuidv4(),
        ...data,
        createdAt: new Date().toISOString(),
      });
      if (res.status === 201 || res.status === 200) {
        alert('Receipt added successfully');
        form.reset({receiptDate: new Date().toISOString().split('T')[0]});
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-gradient-to-r from-blue-500 to-teal-500 p-4 text-white'>
        <h1 className='text-2xl font-bold'>Add New Receipt</h1>
      </header>
      <ReceiptForm
        form={form}
        onSubmit={onSubmit}
        onReset={() => form.reset()}
      />
    </div>
  );
};
