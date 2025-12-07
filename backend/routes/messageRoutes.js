import express from 'express';
import {
  sendMessage,
  getMessages,
  markAsSeen,
  searchMessages,
  uploadImage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages);
router.put('/seen', protect, markAsSeen);
router.get('/search/:chatId', protect, searchMessages);
router.post('/upload', protect, upload.single('image'), uploadImage);

export default router;

