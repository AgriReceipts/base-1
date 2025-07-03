import {NatureOfReceipt} from '@prisma/client';
import {Interface} from 'readline';
import {z} from 'zod';

export const CreateReceiptSchema = z.object({
  receiptDate: z.string(),
  bookNumber: z.string(),
  receiptNumber: z.string(),
  traderName: z.string(),
  traderAddress: z.string().optional(),
  payeeName: z.string(),
  payeeAddress: z.string().optional(),
  commodity: z.string(),
  newCommodityName: z.string().optional(),
  quantity: z.number(),
  unit: z.enum(['quintals', 'numbers', 'bags']),
  natureOfReceipt: z.enum(['mf', 'lc', 'uc', 'others']),
  natureOtherText: z.string().optional(),
  value: z.number(),
  feesPaid: z.number(),
  vehicleNumber: z.string().optional(),
  invoiceNumber: z.string().optional(),
  collectionLocation: z.enum(['office', 'checkpost', 'other']),
  officeSupervisor: z.string().optional(),
  checkpostId: z.string().optional(),
  collectionOtherText: z.string().optional(),
  receiptSignedBy: z.string(),
  designation: z.string(),
  committeeId: z.string(),
});

export type CreateReceiptRequest = z.infer<typeof CreateReceiptSchema>;

// Query parameters for listing receipts
export interface ReceiptQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  natureOfReceipt?: NatureOfReceipt;
  committeeId?: string; // For AD role to filter by committee
  startDate?: string;
  endDate?: string;
}
