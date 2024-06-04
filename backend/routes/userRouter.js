import express from 'express';

import {
  getFriends,
  getUsers,
  getFriendsWithLastMessage,
} from '../controllers/userController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/get-friends', authMiddleware, getFriends);
router.get(
  '/get-friends-with-last-msg',
  authMiddleware,
  getFriendsWithLastMessage
);

export default router;
