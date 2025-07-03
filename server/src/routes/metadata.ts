import {Router} from 'express';
import {getAllCommodities, getCheckPosts} from '../controllers/otherController';

const metaDataRoutes = Router();

metaDataRoutes.get('/commodities', getAllCommodities);
metaDataRoutes.get('/checkpost/:committeeId', getCheckPosts);

export default metaDataRoutes;
