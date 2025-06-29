// Receipt creation request body
export interface CreateReceiptRequest {
  receiptDate: string;
  bookNumber: string;
  receiptNumber: string;
  traderName: string;
  traderAddress?: string;
  payeeName: string;
  payeeAddress?: string;
  commodity: string;
  quantity: number;
  unit: 'quintals' | 'numbers' | 'bags';
  natureOfReceipt: 'mf' | 'lc' | 'uc' | 'others';
  natureOtherText?: string;
  value: number;
  feesPaid: number;
  vehicleNumber?: string;
  invoiceNumber?: string;
  collectionLocation: 'office' | 'checkpost' | 'other';
  officeSupervisor?: string;
  checkpostId?: string;
  collectionOtherText?: string;
}

// Query parameters for listing receipts
export interface ReceiptQueryParams {
  page?: number;
  limit?: number;
  committeeId?: string;
  startDate?: string;
  endDate?: string;
  traderName?: string;
  commodity?: string;
  natureOfReceipt?: string;
}
