import {Router} from 'express';
import {authorizeRoles} from '../middleware/roleAccess';
import {authenticateUser} from '../middleware/auth';
import {
  checkAuth,
  deleteUser,
  getAllUsers,
  login,
  logout,
  registerUser,
} from '../controllers/auth/authController';

const authRoutes = Router();

authRoutes.post(
  '/register',
  authenticateUser,
  authorizeRoles('ad'),
  registerUser
);
authRoutes.post('/login', login);
authRoutes.get('/me', checkAuth);
authRoutes.post('/logout', logout);
authRoutes.get('/users', authenticateUser, authorizeRoles('ad'), getAllUsers);
authRoutes.delete(
  '/delete/:id',
  authenticateUser,
  authorizeRoles('ad'),
  deleteUser
);

export default authRoutes;
