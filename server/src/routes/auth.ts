import {Router} from 'express';
import {authorizeRoles} from '../middleware/roleAccess';
import {authenticateUser} from '../middleware/auth';
import {login, registerUser} from '../controllers/authController';

const authRoutes = Router();

authRoutes.post(
  '/register',
  //authenticateUser,
  //authorizeRoles('ad'),
  registerUser
);
authRoutes.post('/login', login);
//authRoutes.post('/deactivate/:id',deactivate)
//authRoutes.post('/delete/:id',deleteAccount)

export default authRoutes;
