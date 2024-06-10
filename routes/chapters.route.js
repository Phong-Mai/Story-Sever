import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getchapter, gettitlechapter, } from '../controllers/chapters.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
// router.post('/addpost/:postId/:userId',verifyToken, addpost)
// router.get('/getposts', getposts)
router.get('/gettitlechapter', gettitlechapter)
router.get('/getchapter', getchapter)
// router.get('/getstorychapter', getstorychapter)
// router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
// router.put('/updatepost/:postId/:userId', verifyToken, updatepost)


export default router;