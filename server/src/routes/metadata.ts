import {Router} from 'express';
import {
  getAllCommitteesWithCheckposts,
  getAllCommitties,
  getAllCommodities,
  getAllTraders,
  getCheckPosts,
} from '../controllers/metadata/otherController';

const metaDataRoutes = Router();

metaDataRoutes.get('/commodities', getAllCommodities);
metaDataRoutes.get('/committees', getAllCommitties);
metaDataRoutes.get('/checkpost/:committeeId', getCheckPosts);
metaDataRoutes.get('/getDetailedCommittees', getAllCommitteesWithCheckposts);
metaDataRoutes.get('/traders', getAllTraders);

export default metaDataRoutes;
