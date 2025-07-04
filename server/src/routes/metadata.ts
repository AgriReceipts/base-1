import {Router} from 'express';
import {
  getAllCommitties,
  getAllCommodities,
  getCheckPosts,
} from '../controllers/metadata/otherController';

const metaDataRoutes = Router();

metaDataRoutes.get('/commodities', getAllCommodities);
metaDataRoutes.get('/commities', getAllCommitties);
metaDataRoutes.get('/checkpost/:committeeId', getCheckPosts);

export default metaDataRoutes;
