export interface VerifyReceiptData {
  receiptNumber: string;
  bookNumber: string;
  receiptDate: string;
  trader: {
    name: string;
  };
  payeeName: string;
  value: number;
  feesPaid: number;
  natureOfReceipt: string;
  receiptSignedBy: string;
  committee: {
    name: string;
  };
  commodity: {
    name: string;
  };

  quantity: number;
  unit: string;
  vehicleNumber: string;
  generatedBy: string;
}

export interface VerifyReceiptForm {
  receiptNumber: string;
  bookNumber: string;
  committeeId: string;
}

export interface Committee {
  id: string;
  name: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  receipts?: VerifyReceiptData[];
}

// Validation schema (simple validation without zod for this example)
export const validateForm = (data: {
  receiptNumber: string;
  bookNumber: string;
  committeeId: string;
}) => {
  const errors: Record<string, string> = {};

  if (!data.receiptNumber && !(data.bookNumber && data.committeeId)) {
    errors.general =
      'Provide either receiptNumber or both bookNumber and committeeId for verification.';
  }

  if (data.receiptNumber && data.receiptNumber.trim().length < 3) {
    errors.receiptNumber = 'Receipt number must be at least 3 characters';
  }

  return errors;
};
