import {Router} from 'express';
import {
  getAllCommitties,
  getAllCommodities,
  getAllTraders,
  getCheckPosts,
} from '../controllers/metadata/otherController';

const metaDataRoutes = Router();

metaDataRoutes.get('/commodities', getAllCommodities);
metaDataRoutes.get('/committees', getAllCommitties);
metaDataRoutes.get('/checkpost/:committeeId', getCheckPosts);
metaDataRoutes.get('/traders', getAllTraders);

export default metaDataRoutes;
