import express from 'express';
import { verifyToken } from '../middlewear/authMiddlewear.js';
import { verifyAuthority } from '../middlewear/taskMiddlewear.js';
import {
  createTask,
  editTask,
  getAllTasks,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/create', verifyToken, verifyAuthority, createTask);
router.get('/', verifyToken, getAllTasks);
router.patch('/edit/:id', verifyToken, verifyAuthority, editTask);
router.delete('/remove/:id', verifyToken, verifyAuthority, deleteTask);

export default router;
