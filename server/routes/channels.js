import express from 'express';

import { getChannels } from '../controllers/channels.js';
//import auth from '../middleware/auth.js';

const router = express.Router();

// http://localhost:5000/channels
router.get('/getChannels', getChannels);

export default router;