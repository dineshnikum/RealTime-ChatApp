import express from 'express';
import {
  signup,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

export default router;

