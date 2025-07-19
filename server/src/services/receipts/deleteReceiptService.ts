import prisma from "../../utils/database";
import { updateAnalyticsOnReceiptDelete } from "../analytics/analyticsOnReceiptDelete";

export const deleteReceiptWithAnalytics = async (receiptId: string) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.receipt.findUnique({
      where: { id: receiptId },
      select: {
        committeeId: true,
        traderId: true,
        commodityId: true,
        receiptDate: true,
        value: true,
        feesPaid: true,
        totalWeightKg: true,
        natureOfReceipt: true,
        collectionLocation: true,
        checkpostId: true,
      },
    });

    if (!existing) throw new Error("Receipt not found");

    // Delete receipt
    await tx.receipt.update({
      where: { id: receiptId },
      data: {
        cancelled: true,
      },
    });

    // Update analytics after deletion
    await updateAnalyticsOnReceiptDelete(tx, {
      committeeId: existing.committeeId,
      traderId: existing.traderId,
      commodityId: existing.commodityId!,
      receiptDate: existing.receiptDate,
      value: existing.value.toNumber(),
      feesPaid: existing.feesPaid.toNumber(),
      totalWeightKg: existing.totalWeightKg!.toNumber(),
      natureOfReceipt: existing.natureOfReceipt,
      collectionLocation: existing.collectionLocation,
      checkpostId: existing.checkpostId,
    });

    return { message: "Receipt deleted successfully" };
  });
};
