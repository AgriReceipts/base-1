import prisma from '../../utils/database';
import Decimal from 'decimal.js';
import {CreateReceiptRequest} from '../../types/receipt';
import {updateAnalyticsOnReceiptCreate} from '../analytics/analyticsOnReceiptCreate';
export const createReceiptWithAnalytics = async (
  data: CreateReceiptRequest,
  userId: string,
  committeeId: string
) => {
  return await prisma.$transaction(async (tx) => {
    // Handle commodity
    let commodityId: string;
    if (data.commodity === 'Other' && data.newCommodityName) {
      const existing = await tx.commodity.findUnique({
        where: {name: data.newCommodityName},
      });
      commodityId =
        existing?.id ||
        (await tx.commodity.create({data: {name: data.newCommodityName}})).id;
    } else {
      const found = await tx.commodity.findUnique({
        where: {name: data.commodity},
      });
      if (!found) throw new Error('Invalid commodity');
      commodityId = found.id;
    }

    // Handle trader
    let traderId: string;
    if (data.traderName === 'New' && data.newTraderName) {
      const existing = await tx.trader.findUnique({
        where: {name: data.newTraderName},
      });
      traderId =
        existing?.id ||
        (
          await tx.trader.create({
            data: {name: data.newTraderName, address: data.traderAddress ?? ''},
          })
        ).id;
    } else {
      const found = await tx.trader.findUnique({
        where: {name: data.traderName},
      });
      if (!found) throw new Error('Invalid trader');
      traderId = found.id;
    }
    //Handle Weight and total weight

    let totalWeight: number;
    if (data.unit === 'bags' && data.weightPerBag) {
      totalWeight = data.quantity * data.weightPerBag;
    } else if (data.unit === 'kilograms') {
      totalWeight = data.quantity;
    } else if (data.unit === 'quintals') {
      totalWeight = data.quantity * 100;
    } else {
      totalWeight = 0;
    }

    const newReceipt = await tx.receipt.create({
      data: {
        receiptDate: new Date(data.receiptDate),
        bookNumber: data.bookNumber,
        receiptNumber: data.receiptNumber,
        traderId,
        payeeName: data.payeeName,
        payeeAddress: data.payeeAddress ?? '',
        commodityId,
        quantity: data.quantity,
        unit: data.unit,
        weightPerBag: data.weightPerBag || null,
        totalWeightKg: totalWeight,
        natureOfReceipt: data.natureOfReceipt,
        natureOtherText: data.natureOtherText,
        value: data.value,
        feesPaid: data.feesPaid,
        vehicleNumber: data.vehicleNumber,
        invoiceNumber: data.invoiceNumber,
        collectionLocation: data.collectionLocation,
        officeSupervisor: data.officeSupervisor,
        collectionOtherText: data.collectionOtherText,
        designation: data.designation,
        receiptSignedBy: data.receiptSignedBy,
        generatedBy: userId,
        committeeId,
        checkpostId: data.checkpostId || null,
      },
      select: {receiptNumber: true, receiptDate: true},
    });

    //  Update analytics inside the same transaction
    await updateAnalyticsOnReceiptCreate(tx, {
      committeeId,
      traderId,
      commodityId,
      receiptDate: newReceipt.receiptDate,
      value: data.value,
      feesPaid: data.feesPaid,
      totalWeightKg: data.totalWeightKg ?? data.quantity,
      natureOfReceipt: data.natureOfReceipt,
      collectionLocation: data.collectionLocation,
      checkpostId: data.checkpostId || ' ',
    });

    return newReceipt;
  });
};
