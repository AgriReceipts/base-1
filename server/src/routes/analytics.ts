import {Router} from 'express';
import {
  getCommoditiesAnalytics,
  getMfAnalytics,
} from '../controllers/analytics/analyticsController';
import {authenticateUser} from '../middleware/auth';

const analyticsRoutes = Router();

analyticsRoutes.use(authenticateUser);

analyticsRoutes.get('/commodityAnalysis/:committeeId', getCommoditiesAnalytics);
analyticsRoutes.get('/marketFeeAnalysis', getMfAnalytics);

export default analyticsRoutes;
