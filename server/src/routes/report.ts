import {Router} from 'express';
import {generateDistrictReport} from '../controllers/reports/districtReport';

const reportRoutes = Router();

reportRoutes.get('/district', generateDistrictReport);

export default reportRoutes;
