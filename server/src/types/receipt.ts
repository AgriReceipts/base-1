import {NatureOfReceipt} from '@prisma/client';
import {z} from 'zod';

export const CreateReceiptSchema = z.object({
  receiptDate: z.string(),
  bookNumber: z.string(),
  receiptNumber: z.string(),
  traderName: z.string(),
  newTraderName: z.string().optional(),
  traderAddress: z.string().optional(),
  payeeName: z.string(),
  payeeAddress: z.string().optional(),
  commodity: z.string(),
  newCommodityName: z.string().optional(),
  quantity: z.number(),
  unit: z.enum(['quintals', 'kilograms', 'bags', 'numbers']),
  weightPerBag: z.number().positive().optional(),
  totalWeightKg: z.number().positive().optional(),
  natureOfReceipt: z.enum(['mf', 'lc', 'uc', 'others']),
  natureOtherText: z.string().optional(),
  value: z.number().positive(),
  feesPaid: z.number().positive(),
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
