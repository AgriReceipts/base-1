import {Router} from 'express';
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
} from '../controllers/receiptsController';
import {authenticateUser} from '../middleware/auth';
import {authorizeRoles} from '../middleware/roleAccess';

const receiptRoutes = Router();

//middleware
receiptRoutes.use(authenticateUser);

receiptRoutes.post(
  '/createReceipt',
  authorizeRoles('deo,superviser,secretary'),
  createReceipt
);
receiptRoutes.get('/getAllReceipts', getAllReceipts);
receiptRoutes.get('/getReceipt/:id', getReceiptById);

export default receiptRoutes;
