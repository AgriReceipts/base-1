import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Receipt {
  id: string;
  receiptDate: string;
  bookNumber: string;
  receiptNumber: string;
  traderName: string;
  traderAddress: string;
  payeeName: string;
  payeeAddress: string;
  commodity: string;
  quantity: string;
  unit: string;
  nature: string;
  value: string;
  feesPaid: string;
  vehicleNumber: string;
  invoiceNumber: string;
  collectionLocation: string;
  collectedBy: string;
  designation: string;
}

interface ReceiptContextType {
  receipts: Receipt[];
  addReceipt: (receipt: Receipt) => void;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const useReceiptContext = (): ReceiptContextType => {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceiptContext must be used within a ReceiptProvider');
  }
  return context;
};

interface ReceiptProviderProps {
  children: ReactNode;
}

export const ReceiptProvider: React.FC<ReceiptProviderProps> = ({ children }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const addReceipt = (receipt: Receipt) => {
    setReceipts((prev) => [...prev, receipt]);
  };

  return (
    <ReceiptContext.Provider value={{ receipts, addReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
};
