import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      text: {
        type: String,
        default: '',
      },
      image: {
        type: String,
        default: '',
      },
    },
    status: {
      type: String,
      enum: ['sending', 'sent', 'delivered', 'seen'],
      default: 'sending',
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
