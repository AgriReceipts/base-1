// shared/types/receipt.ts
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
  generatedBy: z.string(),
  designation: z.string(),
  committeeId: z.string(),
});

export type CreateReceiptRequest = z.infer<typeof CreateReceiptSchema>;

export type Receipt = CreateReceiptRequest & {
  id: string;
};
