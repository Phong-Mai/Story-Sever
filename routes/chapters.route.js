import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getchapter, gettitlechapter, } from '../controllers/chapters.controller.js';

const router = express.Router();
// cũ
// router.post('/create', verifyToken, create)

// router.get('/gettitlechapter', gettitlechapter)
// router.get('/getchapter', getchapter)

// mới
router.post('/create', create)

router.get('/gettitlechapter', gettitlechapter)
router.get('/getchapter', getchapter)



export default router;