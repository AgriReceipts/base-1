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

const receiptRoutes = Router();

//middleware
receiptRoutes.use(authenticateUser);

receiptRoutes.post(
  '/createReceipt',
  authorizeRoles('deo', 'supervisor', 'secretary'),
  createReceipt
);
receiptRoutes.get('/getAllReceipts', getAllReceipts);
receiptRoutes.get('/getReceipt/:id', getReceiptById);
receiptRoutes.get('/getReceiptByRn/:receiptNumber', getReceiptByReceiptNumber);
receiptRoutes.get('/download/:id', downloadReceipt);

export default receiptRoutes;
