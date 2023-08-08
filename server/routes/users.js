import express from 'express';

import { signin, signup, updateQuota, getCar, getUsers, getSMM, setSMM, getMySMM } from '../controllers/users.js';

const router = express.Router();

// http://localhost:5000/users
router.get('/getSMM', getSMM);
router.get('/:id/getSMM', getMySMM);
router.get('/:id/getUsers', getUsers);
router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/updateQuota', updateQuota);
router.patch('/caratteri', getCar);
router.patch('/:id/setSMM', setSMM);


export default router;