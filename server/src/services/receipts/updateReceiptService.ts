import prisma from "../../utils/database";
import { CreateReceiptRequest } from "../../types/receipt";
import { updateAnalyticsOnReceiptUpdate } from "../analytics/analyticsOnReceiptUpdate";
import { CollectionLocation } from "@prisma/client";

export const updateReceiptWithAnalytics = async (
  receiptId: string,
  data: CreateReceiptRequest,
  userId: string,
  committeeId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.receipt.findUnique({
      where: { id: receiptId },
    });

    if (!existing) {
      throw new Error("Receipt not found");
    }

    // Recalculate traderId and commodityId
    let traderId =
      data.traderName === "New" && data.newTraderName
        ? (
            await tx.trader.upsert({
              where: { name: data.newTraderName },
              update: {},
              create: {
                name: data.newTraderName,
                address: data.traderAddress ?? "",
              },
            })
          ).id
        : (await tx.trader.findUnique({ where: { name: data.traderName } }))
            ?.id;

    if (!traderId) throw new Error("Invalid trader");

    let commodityId =
      data.commodity === "Other" && data.newCommodityName
        ? (
            await tx.commodity.upsert({
              where: { name: data.newCommodityName },
              update: {},
              create: { name: data.newCommodityName },
            })
          ).id
        : (await tx.commodity.findUnique({ where: { name: data.commodity } }))
            ?.id;

    if (!commodityId) throw new Error("Invalid commodity");
    //Handle Weight and total weight

    let totalWeight: number;
    if (data.unit === "bags" && data.weightPerBag) {
      totalWeight = data.quantity * data.weightPerBag;
    } else if (data.unit === "kilograms") {
      totalWeight = data.quantity;
    } else if (data.unit === "quintals") {
      totalWeight = data.quantity * 100;
    } else {
      totalWeight = 0;
    }

    // Update receipt
    const updatedReceipt = await tx.receipt.update({
      where: { id: receiptId },
      data: {
        receiptDate: new Date(data.receiptDate),
        bookNumber: data.bookNumber,
        receiptNumber: data.receiptNumber,
        traderId,
        payeeName: data.payeeName,
        payeeAddress: data.payeeAddress ?? "",
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
    });

    await updateAnalyticsOnReceiptUpdate(tx, {
      old: {
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
      },
      new: {
        committeeId: updatedReceipt.committeeId,
        traderId: updatedReceipt.traderId,
        commodityId: updatedReceipt.commodityId!,
        receiptDate: updatedReceipt.receiptDate,
        value: updatedReceipt.value.toNumber(),
        feesPaid: updatedReceipt.feesPaid.toNumber(),
        totalWeightKg: updatedReceipt.totalWeightKg!.toNumber(),
        natureOfReceipt: updatedReceipt.natureOfReceipt,
        collectionLocation: updatedReceipt.collectionLocation,
        checkpostId: updatedReceipt.checkpostId,
      },
    });

    return updatedReceipt;
  });
};
