import {Router} from 'express';
import {
  deleteTarget,
  getTargets,
  setTarget,
  updateTarget,
} from '../controllers/targets/targetController';
import {authenticateUser} from '../middleware/auth';
import {authorizeRoles} from '../middleware/roleAccess';

const targetRoutes = Router();
targetRoutes.use(authenticateUser);
targetRoutes.use(authorizeRoles('ad'));
targetRoutes.post('/setTarget', setTarget);
targetRoutes.get('/getTargets', getTargets);
targetRoutes.put('/updateTarget/:targetId', updateTarget);
targetRoutes.delete('/target/deleteTarget/:targetId', deleteTarget);

export default targetRoutes;
