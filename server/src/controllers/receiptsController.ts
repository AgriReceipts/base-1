import {Request, Response} from 'express';
import prisma from '../utils/database';
import {Prisma} from '@prisma/client';
import {
  CreateReceiptRequest,
  CreateReceiptSchema,
  ReceiptQueryParams,
} from '../types/receipt';
import {handlePrismaError} from '../utils/helpers';
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

    if (!receiptData.committeeId) {
      return res.status(400).json({message: 'committeeId is required'});
    }

    let commodityId: string | undefined;

    // Handle "other" commodity
    if (receiptData.commodity === 'other' && receiptData.newCommodityName) {
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

    const userId = await prisma.user.findUnique({
      where: {username: receiptData.generatedBy},
      select: {id: true},
    });

    if (!userId) {
      return res.status(404).json({message: 'User not found'});
    }

    const newReceipt = await prisma.receipt.create({
      data: {
        receiptDate: new Date(receiptData.receiptDate),
        bookNumber: receiptData.bookNumber,
        receiptNumber: receiptData.receiptNumber,
        traderName: receiptData.traderName,
        traderAddress: receiptData.traderAddress ?? '',
        payeeName: receiptData.payeeName,
        payeeAddress: receiptData.payeeAddress ?? '',
        commodityId,
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
        generatedBy: userId.id,
        committeeId: receiptData.committeeId,
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

// @desc    Get all receipts with filtering and pagination
// @route   GET /api/receipts/getAllReceipts
// @access  Private
export const getAllReceipts = async (req: Request, res: Response) => {
  try {
    const {page = 1, limit = 10, ...filters}: ReceiptQueryParams = req.query;

    // TODO: Build a dynamic where clause based on filters

    const receipts = await prisma.receipt.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      // where: whereClause, // Add your dynamic filters here
      orderBy: {
        receiptDate: 'desc',
      },
    });

    const totalReceipts = await prisma.receipt.count({
      /* where: whereClause */
    });

    res.status(200).json({
      data: receipts,
      pagination: {
        total: totalReceipts,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalReceipts / Number(limit)),
      },
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

// @desc    Get a single receipt by receiptNumber
// @route   GET /api/receipts/getReceiptByRn/:receiptNumber
// @access  Private
export const getReceiptByReceiptNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const receiptNumber = req.params.receiptNumber;
    const receipt = await prisma.receipt.findMany({
      where: {receiptNumber},
    });

    if (!receipt) {
      return res.status(404).json({message: 'Receipt not found'});
    }

    res.status(200).json(receipt);
  } catch (error) {
    console.error('Error fetching receipt by Receipt Number:', error);
    res.status(500).json({message: 'Server error'});
  }
};

// @desc    Get a single receipt by ID
// @route   GET /api/receipts/getReceipt/:id
// @access  Private

export const getReceiptById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const receipt = await prisma.receipt.findUnique({
      where: {id},
    });

    if (!receipt) {
      return res.status(400).json({message: 'Receipt not found'});
    }
    res.status(200).json(receipt);
  } catch (error) {
    console.error('Error fetching receipt by Id', error);
    res.status(500).json({message: 'Server error'});
  }
};
