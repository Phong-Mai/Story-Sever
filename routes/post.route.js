import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, updatepost, addpost, getcategory, getstorychapter} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.post('/addpost/:postId/:userId',verifyToken, addpost)
router.get('/getposts', getposts)
router.get('/getcategory', getcategory)
router.get('/getstorychapter', getstorychapter)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)


export default router;