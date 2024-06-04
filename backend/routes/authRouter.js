import express from 'express';

import { register, login, logout } from '../controllers/authController.js';

import upload from '../controllers/uploadController.js';

const router = express.Router();

router.route('/register').get().post(upload.single('image'), register);

router.route('/login').get().post(login);

router.route('/logout').get(logout);

export default router;
