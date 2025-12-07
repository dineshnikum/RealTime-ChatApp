import express from 'express';
import {
  searchUsers,
  getAllUsers,
  getUserById,
  updateStatus,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/search', protect, searchUsers);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/status', protect, updateStatus);

export default router;

