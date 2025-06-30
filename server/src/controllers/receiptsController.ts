import {Request, Response} from 'express';
import prisma from '../utils/database';
import {Prisma} from '@prisma/client';
import {CreateReceiptRequest, ReceiptQueryParams} from '../types/receipt';
import {handlePrismaError} from '../utils/helpers';

// @desc    Create a new receipt
// @route   POST /api/receipts/createReceipt
// @access  Private
export const createReceipt = async (req: Request, res: Response) => {
  try {
    const receiptData: CreateReceiptRequest = req.body;

    if (!receiptData.committeeId) {
      return res.status(400).json({message: 'committeeId is required'});
    }

    const user = await prisma.user.findUnique({
      where: {username: receiptData.generatedBy},
    });

    if (!user) {
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
        commodity: receiptData.commodity,
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
        generatedBy: user.id,
        committeeId: receiptData.committeeId,
        checkpostId: receiptData.checkpostId || null, // optional
      },
    });

    res.status(201).json({
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

// @desc    Get a single receipt by ID
// @route   GET /api/receipts/getReceipt/:id
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
