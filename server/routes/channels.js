import express from 'express';

import { getChannels, addChannel, getMyChannels, updateChannel } from '../controllers/channels.js';
//import auth from '../middleware/auth.js';

const router = express.Router();

// http://localhost:5000/channels
router.get('/:id/getChannels', getChannels);
router.get('/:id/getMyChannels', getMyChannels);
router.post('/addChannel', addChannel);
router.patch('/:id/updateChannel', updateChannel);

export default router;