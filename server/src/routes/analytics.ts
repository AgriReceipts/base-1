import {Router} from 'express';

import {authenticateUser} from '../middleware/auth';
import {getCommitteAnalytics} from '../controllers/analytics/commities';
import {getTraderAnalytics} from '../controllers/analytics/traders';
import {getCommodityAnalytics} from '../controllers/analytics/commodities';

const analyticsRoutes = Router();

analyticsRoutes.use(authenticateUser);

analyticsRoutes.get('/commodityAnalysis/:committeeId');
analyticsRoutes.get('/committee/:committeeId', getCommitteAnalytics);
analyticsRoutes.get('/traders', getTraderAnalytics);
analyticsRoutes.get('/commodity', getCommodityAnalytics);

export default analyticsRoutes;
