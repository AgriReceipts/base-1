import {Request, Response} from 'express';
import {CreateReceiptSchema} from '../../types/receipt';
import {handlePrismaError} from '../../utils/helpers';
import {createReceiptWithAnalytics} from '../../services/receipts/createReceiptService';

export const createReceipt = async (req: Request, res: Response) => {
  const parseResult = CreateReceiptSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: 'Invalid input',
      errors: parseResult.error.flatten(),
    });
  }

  const userId = req.user?.id;
  const committeeId = req.user?.committee.id;

  if (!userId || !committeeId) {
    return res.status(400).json({message: 'Missing user or committee info'});
  }

  try {
    const receipt = await createReceiptWithAnalytics(
      parseResult.data,
      userId,
      committeeId
    );
    return res.status(201).json({
      message: 'Receipt created successfully',
      receiptNumber: receipt.receiptNumber,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
