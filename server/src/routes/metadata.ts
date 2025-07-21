import {Router} from 'express';
import {
  getAllCommitteesWithCheckposts,
  getAllCommitties,
  getAllCommodities,
  getAllTraders,
  getCheckPosts,
} from '../controllers/metadata/otherController';
import {cacheMiddleware} from '../middleware/cacheMiddleware';

const metaDataRoutes = Router();

metaDataRoutes.use(cacheMiddleware());

metaDataRoutes.get('/commodities', getAllCommodities);
metaDataRoutes.get('/committees', getAllCommitties);
metaDataRoutes.get('/checkpost/:committeeId', getCheckPosts);
metaDataRoutes.get('/getDetailedCommittees', getAllCommitteesWithCheckposts);
metaDataRoutes.get('/traders', getAllTraders);

export default metaDataRoutes;
