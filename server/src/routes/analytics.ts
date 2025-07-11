import {Router} from 'express';

import {authenticateUser} from '../middleware/auth';
import {getCommitteAnalytics} from '../controllers/analytics/commities';

import {getDailyAnalytics} from '../controllers/analytics/daily';
import {
  getTopTradersAnalytics,
  getTraderDetailedAnalytics,
} from '../controllers/analytics/traders';
import {
  getDetailedCommodityAnalytics,
  getTopCommoditiesAnalytics,
} from '../controllers/analytics/commodities';
import {cacheMiddleware} from '../middleware/cacheMiddleware';

const analyticsRoutes = Router();

analyticsRoutes.use(authenticateUser);
analyticsRoutes.use(cacheMiddleware());

//committeAnalytics Endpoints
analyticsRoutes.get(
  '/committee/:committeeId/:year/:month',
  getCommitteAnalytics
);
//Todo for drillDown anlytics of each committe
// /api/analytics/committee/:id/:year/:month/drilldown that does basic aggregation from receipts table. Return only the essential fields you need.

//commodityAnalytics Endpoints
analyticsRoutes.get(
  '/commodityAnalytics/:committeeId',
  getTopCommoditiesAnalytics
);

analyticsRoutes.get(
  '/commodityDetailedAnalytics/:committeeId/:commodityId',
  getDetailedCommodityAnalytics
);

//TraderAnalytics Endpoints

analyticsRoutes.get('/traderAnalytics/:committeeId', getTopTradersAnalytics);
analyticsRoutes.get(
  '/traderDetailedAnalytics/:committeeId/:traderId',
  getTraderDetailedAnalytics
);

//Daily Analytics for each committee
analyticsRoutes.get('/dailyAnalytics/:committeeId/:date', getDailyAnalytics);

//Todo add seperate endpoints for disctrictwide Analytics
//analyticsRoutes.get('/districWide');

export default analyticsRoutes;
