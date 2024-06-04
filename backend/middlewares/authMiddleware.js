import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in',
    });
  }
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!payload)
      return res.status(401).json({
        status: 'fail',
        message: 'Token is invalid',
      });

    const user = await User.findOne({ _id: payload._id });

    if (!user)
      return res
        .status(401)
        .json({ status: 'fail', message: 'This user no longer exists' });

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export default authMiddleware;
