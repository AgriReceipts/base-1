import {Request, Response} from 'express';
import prisma from '../utils/database';
import {Prisma} from '@prisma/client';
import {CreateReceiptRequest, ReceiptQueryParams} from '../types/receipt';

// @desc    Create a new receipt
// @route   POST /api/receipts/createReceipt
// @access  Private
export const createReceipt = async (req: Request, res: Response) => {
  try {
    const receiptData: CreateReceiptRequest = req.body;
    // TODO: Add validation for the request body

    const newReceipt = await prisma.receipt.create({
      data: receiptData as unknown as Prisma.ReceiptCreateInput,
    });

    res.status(201).json(newReceipt);
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({message: 'Server error while creating receipt'});
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
    console.error('Error fetching receipts:', error);
    res.status(500).json({message: 'Server error while fetching receipts'});
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
      return res.status(404).json({message: 'Receipt not found'});
    }

    res.status(200).json(receipt);
  } catch (error) {
    console.error('Error fetching receipt by ID:', error);
    res.status(500).json({message: 'Server error'});
  }
};
