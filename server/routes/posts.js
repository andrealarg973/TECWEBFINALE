import express from 'express';

import { getPosts, getChannelPosts, getUnloggedPosts, getTemporalPosts, getPost, getReplyPost, getPostsBySearch, getPostsByUser, createPost, createAutomaticPost, updatePost, updateTemporal, deletePost, likePost, dislikePost, commentPost, updateVisual } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// http://localhost:5000/posts
router.get('/search', getPostsBySearch);
router.get('/:id/all', getPosts);
router.get('/unlogged', getUnloggedPosts);
router.get('/:id/getChannelPosts', getChannelPosts);
router.get('/:id/temporal', getTemporalPosts);
router.get('/:id', getPost);
router.get('/getReplyPost', getReplyPost);
router.get('/:id/posts', auth, getPostsByUser);
router.patch('/:id/visual', updateVisual);

router.post('/', auth, createPost);
router.post('/automatic', auth, createAutomaticPost);
router.patch('/:id', auth, updatePost);
router.patch('/:id/updateTemporal', auth, updateTemporal);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.patch('/:id/dislikePost', auth, dislikePost);
router.post('/:id/commentPost', auth, commentPost);

export default router;