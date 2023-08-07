import express from 'express';

import { signin, signup, updateQuota, getCar, getUsers } from '../controllers/users.js';

const router = express.Router();

// http://localhost:5000/users
router.get('/:id/getUsers', getUsers);
router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/updateQuota', updateQuota);
router.patch('/caratteri', getCar);


export default router;