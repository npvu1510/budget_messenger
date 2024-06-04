import User from '../models/User.js';
import Message from '../models/Message.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: 'success', data: { users } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getFriends = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const users = await User.find({ _id: { $ne: _id } });
    res.status(200).json({ status: 'success', data: { users } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getFriendsWithLastMessage = async (req, res, next) => {
  try {
    const { _id } = req.user;

    let users = await User.find({ _id: { $ne: _id } });
    users = await Promise.all(
      users.map(async (user) => {
        const lastMsg = await Message.findOne({
          $or: [
            { $and: [{ senderId: _id }, { receiverId: user._id }] },
            { $and: [{ senderId: user._id }, { receiverId: _id }] },
          ],
        }).sort({ createdAt: -1 });
        if (lastMsg) user._doc.lastMsg = lastMsg;
        return user;
      })
    );

    console.log(users);

    res.status(200).json({ status: 'success', data: { users } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
