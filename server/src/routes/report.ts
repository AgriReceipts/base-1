import {Router} from 'express';
import {generateDistrictReport} from '../controllers/reports/districtReport';
import {cacheMiddleware} from '../middleware/cacheMiddleware';

const reportRoutes = Router();

reportRoutes.get('/district', cacheMiddleware(600), generateDistrictReport); // Cache for 10 minutes

export default reportRoutes;
