import { Request, Response } from "express";
import { handlePrismaError } from "../../utils/helpers";
import { deleteReceiptWithAnalytics } from "../../services/receipts/deleteReceiptService";
import prisma from "../../utils/database";

export const deleteReceiptController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("the id is", id);
    if (!id) {
      return res.status(400).json({
        message: "receiptId is required",
      });
    }
    const cancelledReceipt = await prisma.receipt.findUnique({
      where: {
        id,
        cancelled: true,
      },
    });
    if (cancelledReceipt) {
      return res.status(409).json({
        message: "This receipt is already deleted",
      });
    }

    await deleteReceiptWithAnalytics(id);

    return res.status(200).json({
      message: "Receipt Deleted Successfully",
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
