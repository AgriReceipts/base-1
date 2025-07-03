import {Router} from 'express';
import {
  createReceipt,
  downloadReceipt,
  getAllReceipts,
  getReceiptById,
  getReceiptByReceiptNumber,
} from '../controllers/receiptsController';
import {authenticateUser} from '../middleware/auth';
import {authorizeRoles} from '../middleware/roleAccess';

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
