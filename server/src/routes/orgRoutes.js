import express from 'express';
import {
  getAllOrganizations,
  getOrganization,
  getChildOrganizations
} from '../controllers/orgController.js';
import { verifyToken } from '../middlewear/authMiddlewear.js';

const router = express.Router();

router.get('/', getAllOrganizations);
router.get('/:id', verifyToken, getOrganization);
router.get('/child/:id',verifyToken,getChildOrganizations)
export default router;
