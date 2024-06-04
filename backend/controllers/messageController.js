import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const { friendId } = req.query;
    const { _id: myId } = req.user;

    let filter = friendId
      ? {
          $or: [
            { $and: [{ senderId: myId }, { receiverId: friendId }] },
            { $and: [{ senderId: friendId }, { receiverId: myId }] },
          ],
        }
      : {};

    const messages = await Message.find(filter);
    res.status(200).json({ status: 'success', data: { messages } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { _id: senderId } = req.user;
    const { receiverId, text, status } = req.body;

    // console.log(receiverId, req.file ? req.file.path : content);

    if (`${senderId}` === `${receiverId}`)
      return res.status(400).json({
        status: 'fail',
        message: "You can't send messages to yourself",
      });

    const message = await Message.create({
      senderId,
      receiverId,
      content: {
        text,
        image: req?.file?.path,
      },
      status: 'sent',
    });
    res.status(200).json({ status: 'success', data: { message } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// export const sendImage = async (req, res) => {
//   console.log(req.file);

//   try {
//     const { _id: senderId } = req.user;
//     const { receiverId } = req.body;

//     if (`${senderId}` === `${receiverId}`)
//       return res.status(400).json({
//         status: 'fail',
//         message: "You can't send messages to yourself",
//       });

//     const message = await Message.create({
//       senderId,
//       receiverId,
//       content: { image: req.file.path },
//     });
//     res.status(200).json({ status: 'success', data: { message } });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ status: 'error', message: err.message });
//   }
// };

export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId, status } = req.body;
    const message = await Message.findOne({ _id: messageId });
    message.status = status;

    const newMessage = await message.save();

    // Cập nhật tất cả tin nhắn cũ thành 'seen'
    if (status === 'seen')
      await Message.updateMany(
        {
          _id: { $ne: newMessage._id },
          $or: [
            {
              senderId: { $eq: newMessage.senderId },
              receiverId: { $eq: newMessage.receiverId },
            },
            {
              senderId: { $eq: newMessage.receiverId },
              receiverId: { $eq: newMessage.senderId },
            },
          ],
        },
        { status: status }
      );

    // const messages = await Message.find({
    //   _id: { $ne: newMessage._id },
    //   status: { $ne: 'seen' },
    //   $or: [
    //     {
    //       senderId: { $eq: newMessage.senderId },
    //       receiverId: { $eq: newMessage.receiverId },
    //     },
    //     {
    //       senderId: { $eq: newMessage.receiverId },
    //       receiverId: { $eq: newMessage.senderId },
    //     },
    //   ],
    // });
    // console.log(messages.length);

    res.status(200).json({
      status: 'success',
      data: {
        message: newMessage,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};
