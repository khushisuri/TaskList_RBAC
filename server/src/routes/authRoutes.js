import express from 'express';
import { getUser, loginUser, registerUser } from '../controllers/authController.js';
import { verifyToken } from '../middlewear/authMiddlewear.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/user/:id',verifyToken, getUser);

export default router;
