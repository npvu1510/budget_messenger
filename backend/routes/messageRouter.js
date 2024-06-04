import express from 'express';

import {
  getMessages,
  sendMessage,
  // sendImage,
  updateMessageStatus,
} from '../controllers/messageController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

import upload from '../controllers/uploadController.js';

const router = express.Router();
// router.post('/send-image', authMiddleware, upload.single('image'), sendImage);

router
  .route('/')
  .get(authMiddleware, getMessages)
  .post(authMiddleware, authMiddleware, upload.single('image'), sendMessage);

router.route('/status').patch(updateMessageStatus);

export default router;
