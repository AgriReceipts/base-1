import prisma from '../../utils/database';
import {updateAnalyticsOnReceiptDelete} from '../analytics/analyticsOnReceiptDelete';

export const deleteReceiptWithAnalytics = async (receiptId: string) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.receipt.findUnique({
      where: {id: receiptId},
    });

    if (!existing) throw new Error('Receipt not found');

    // Delete receipt
    await tx.receipt.update({
      where: {id: receiptId},
      data: {
        cancelled: true,
      },
    });

    // Update analytics after deletion
    await updateAnalyticsOnReceiptDelete(tx, existing);

    return {message: 'Receipt deleted successfully'};
  });
};
