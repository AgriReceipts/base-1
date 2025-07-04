import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {CreateReceiptSchema} from '../../types/receipt';
import {handlePrismaError} from '../../utils/helpers';

// @desc    Create a new receipt
// @route   POST /api/receipts/createReceipt
// @access  Private

export const createReceipt = async (req: Request, res: Response) => {
  try {
    const parseResult = CreateReceiptSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(400)
        .json({message: 'Invalid input', errors: parseResult.error.flatten()});
    }

    const receiptData = parseResult.data;
    console.log('the receipt req data', receiptData);

    const committeeId = req.user?.committee.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(404).json({message: 'User not found'});
    }

    if (!committeeId) {
      return res.status(400).json({message: 'committeeId is required'});
    }

    let commodityId: string | undefined;

    // Handle "Other" commodity
    if (receiptData.commodity === 'Other' && receiptData.newCommodityName) {
      const existing = await prisma.commodity.findUnique({
        where: {name: receiptData.newCommodityName},
        select: {id: true},
      });

      if (existing) {
        commodityId = existing.id;
      } else {
        const created = await prisma.commodity.create({
          data: {name: receiptData.newCommodityName},
        });
        commodityId = created.id;
      }
    } else {
      const found = await prisma.commodity.findUnique({
        where: {name: receiptData.commodity},
        select: {id: true},
      });
      commodityId = found?.id;
    }

    let traderId: string | undefined;
    //Handle "new" trader
    if (receiptData.traderName === 'New' && receiptData.newTraderName) {
      const existing = await prisma.trader.findUnique({
        where: {name: receiptData.newTraderName},
        select: {id: true},
      });

      if (existing) {
        traderId = existing.id;
      } else {
        const created = await prisma.trader.create({
          data: {
            name: receiptData.newTraderName,
            address: receiptData.traderAddress ?? '',
          },
        });
        traderId = created.id;
      }
    } else {
      const found = await prisma.trader.findUnique({
        where: {name: receiptData.traderName},
        select: {id: true},
      });
      traderId = found?.id;
    }

    if (!traderId) {
      return res.status(400).json({message: 'traderId is required'});
    }
    if (!commodityId) {
      return res.status(400).json({message: 'commodityId is required'});
    }

    const newReceipt = await prisma.receipt.create({
      data: {
        receiptDate: new Date(receiptData.receiptDate),
        bookNumber: receiptData.bookNumber,
        receiptNumber: receiptData.receiptNumber,
        traderId: traderId,
        payeeName: receiptData.payeeName,
        payeeAddress: receiptData.payeeAddress ?? '',
        commodityId: commodityId,
        quantity: receiptData.quantity,
        unit: receiptData.unit,
        natureOfReceipt: receiptData.natureOfReceipt,
        natureOtherText: receiptData.natureOtherText,
        value: receiptData.value,
        feesPaid: receiptData.feesPaid,
        vehicleNumber: receiptData.vehicleNumber,
        invoiceNumber: receiptData.invoiceNumber,
        collectionLocation: receiptData.collectionLocation,
        officeSupervisor: receiptData.officeSupervisor,
        collectionOtherText: receiptData.collectionOtherText,
        designation: receiptData.designation,
        receiptSignedBy: receiptData.receiptSignedBy,
        generatedBy: userId,
        committeeId: committeeId,
        checkpostId: receiptData.checkpostId || null,
      },
      select: {
        receiptNumber: true,
      },
    });

    return res.status(201).json({
      message: 'Receipt created successfully',
      receiptNumber: newReceipt.receiptNumber,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
