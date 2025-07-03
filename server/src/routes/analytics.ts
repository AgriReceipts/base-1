import {Router} from 'express';
import {
  getCommoditiesAnalytics,
  getMfAnalytics,
} from '../controllers/analyticsController';

const analyticsRoutes = Router();

analyticsRoutes.get('/commodityAnalysis/:committeeId', getCommoditiesAnalytics);
analyticsRoutes.get('/marketFeeAnalysis', getMfAnalytics);

export default analyticsRoutes;
