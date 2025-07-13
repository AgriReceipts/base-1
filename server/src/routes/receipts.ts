import {Router} from 'express';

import {authenticateUser} from '../middleware/auth';
import {authorizeRoles} from '../middleware/roleAccess';
import {createReceipt} from '../controllers/receipts/createReceipts';
import {
  getAllReceipts,
  getReceiptById,
  getReceiptByReceiptNumber,
} from '../controllers/receipts/getReceipts';
import {downloadReceipt} from '../controllers/receipts/downloadReceipt';
import {verifyReceipt} from '../controllers/receipts/verifyReceipt';
//import {cacheMiddleware} from '../middleware/cacheMiddleware';

const receiptRoutes = Router();

receiptRoutes.post(
  '/createReceipt',
  authenticateUser,
  authorizeRoles('deo', 'supervisor', 'secretary'),
  createReceipt
);
receiptRoutes.get('/getAllReceipts', authenticateUser, getAllReceipts);
receiptRoutes.get('/getReceipt/:id', getReceiptById);
receiptRoutes.get('/getReceiptByRn/:receiptNumber', getReceiptByReceiptNumber);
receiptRoutes.get('/download/:id', authenticateUser, downloadReceipt);
receiptRoutes.get('/verifyReceipt', verifyReceipt);

export default receiptRoutes;
