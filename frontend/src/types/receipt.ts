import { z } from "zod";
export const CreateReceiptSchema = z
  .object({
    receiptDate: z.string().min(1, "Receipt date is required"),
    bookNumber: z.string().min(1, "Book number is required"),
    receiptNumber: z.string().min(1, "Receipt number is required"),
    traderName: z.string().min(1, "Trader name is required"),
    newTraderName: z.string().optional(),
    traderAddress: z.string().optional(),
    payeeName: z.string().min(1, "Payee name is required"),
    payeeAddress: z.string().optional(),
    commodity: z
      .string()
      .min(
        1,
        "Commodity is required, Please select Other and enter the new name if commodity doesnot exist in the list",
      ),
    newCommodityName: z.string().optional(),
    quantity: z.number().positive("Quantity must be greater than 0"),
    unit: z.enum(["quintals", "kilograms", "bags", "numbers"], {
      errorMap: () => ({ message: "Please select a valid unit" }),
    }),
    weightPerBag: z.number().optional(),
    natureOfReceipt: z.enum(["mf", "lc", "uc", "others"], {
      errorMap: () => ({ message: "Please select nature of receipt" }),
    }),
    natureOtherText: z.string().optional(),
    value: z.number().nonnegative("Value must be 0 or greater"),
    feesPaid: z.number().nonnegative("Fees paid must be 0 or greater"),
    vehicleNumber: z.string().optional(),
    invoiceNumber: z.string().optional(),
    collectionLocation: z.enum(["office", "checkpost", "other"], {
      errorMap: () => ({ message: "Please select a collection location" }),
    }),
    officeSupervisor: z.string().optional(),
    checkpostId: z.string().optional(),
    collectionOtherText: z.string().optional(),
    receiptSignedBy: z.string().min(1, "Receipt signed by is required"),
    designation: z.string().min(1, "Designation is required"),
    committeeId: z.string().min(1, "Committee ID is required"),
  })
  // ADD THIS NEW REFINE FOR TRADER VALIDATION
  .refine(
    (data) => {
      // You'll need to pass the traders array to validation - see implementation note below
      // For now, this ensures if traderName is "New", newTraderName must be provided
      if (data.traderName === "New") {
        return !!data.newTraderName?.trim();
      }
      return true;
    },
    {
      message: "Please enter a new trader name",
      path: ["newTraderName"],
    },
  )
  .refine(
    (data) => {
      if (data.commodity === "Other" || data.commodity === "other") {
        return !!data.newCommodityName?.trim();
      }
      return true;
    },
    {
      message: "Please enter a new commodity name",
      path: ["newCommodityName"],
    },
  )
  .refine(
    (data) => {
      if (data.natureOfReceipt === "others") {
        return !!data.natureOtherText?.trim();
      }
      return true;
    },
    {
      message: "Please specify the nature of receipt",
      path: ["natureOtherText"],
    },
  )
  .refine(
    (data) => {
      if (data.collectionLocation === "office") {
        return !!data.officeSupervisor?.trim();
      }
      return true;
    },
    {
      message: "Please select an office supervisor",
      path: ["officeSupervisor"],
    },
  )
  .refine(
    (data) => {
      if (data.collectionLocation === "checkpost") {
        return !!data.checkpostId?.trim();
      }
      return true;
    },
    {
      message: "Please select a checkpost",
      path: ["checkpostId"],
    },
  )
  .refine(
    (data) => {
      if (data.collectionLocation === "other") {
        return !!data.collectionOtherText?.trim();
      }
      return true;
    },
    {
      message: "Please enter the other location",
      path: ["collectionOtherText"],
    },
  );

// Export as a value, not just a type
export type CreateReceiptRequest = z.infer<typeof CreateReceiptSchema>;
export interface UpdateReceipt extends CreateReceiptRequest {
  id: string;
}

export interface DetailedReceipt {
  id: string;
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
