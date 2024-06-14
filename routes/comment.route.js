import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getcomments,
  likeComment,
} from '../controllers/comment.controller.js';

const router = express.Router();
// cũ
// router.post('/create', verifyToken, createComment);
// router.get('/getPostComments/:postId', getPostComments);
// router.put('/likeComment/:commentId', verifyToken, likeComment);
// router.put('/editComment/:commentId', verifyToken, editComment);
// router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
// router.get('/getcomments', verifyToken, getcomments);

// mới
router.post('/create', createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', likeComment);
router.put('/editComment/:commentId', editComment);
router.delete('/deleteComment/:commentId', deleteComment);
router.get('/getcomments', getcomments);

export default router;
