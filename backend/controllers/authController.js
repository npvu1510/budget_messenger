import User from '../models/User.js';
import signToken from '../utils/signToken.js';

export const register = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;

    const isExist = await User.findOne({ email });

    if (isExist)
      return res
        .status(400)
        .json({ status: 'failed', message: 'Email is already registered' });

    const user = await User.create({
      userName,
      email,
      password,
      confirmPassword,
      image: req?.file?.path,
    });

    const token = signToken({ _id: user._id, email }, res);

    return res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          image: user.image,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 'error', message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error('Please provide your email address');
    if (!password) throw new Error('Please provide your password');

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Email address not found');

    if (!(await user.isPasswordMatched(password)))
      return res
        .status(401)
        .json({ status: 'failed', message: 'Password is incorrect' });

    const token = signToken({ _id: user._id, email }, res);
    return res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          image: user.image,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('jwt').status(200).json({ status: 'success' });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};
