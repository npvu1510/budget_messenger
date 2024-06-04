// packages
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';
import randomstring from 'randomstring';

import { RiEmotionLine } from 'react-icons/ri';

// 3rd components
import {
  FaPlusCircle,
  FaFileImage,
  FaGift,
  FaPaperPlane,
} from 'react-icons/fa';

// my components

// contexts
import { useSocket } from '../contexts/socketContext';

// slices
import messageSlice from '../slices/messageSlice';

// api slices
import { useSendMutation } from '../slices/messageApiSlice';

// selectors
import { currentFriendSelector, userInfoSelector } from '../selectors';
import {
  MESSAGE_STATUS_TO_SERVER,
  MESSAGE_TO_SERVER,
  TYPING_TO_SERVER,
  UPDATE_MESSAGE_STATUS_TO_SERVER,
} from '../constants';

import useSound from 'use-sound';

import sendMessageSfx from '../audio/sending.mp3';
const ChatInputBar = () => {
  const dispatch = useDispatch();
  const [sendMessagePlayer] = useSound(sendMessageSfx);
  //
  const currentFriend = useSelector(currentFriendSelector);

  // contexts
  const socket = useSocket();

  // Authentication
  const userInfo = useSelector(userInfoSelector);

  // message content statef
  const [message, setMessage] = useState('');

  const handleTyping = (e) => {
    setMessage(e.target.value);

    // gửi tín hiệu typing
    socket.emit(TYPING_TO_SERVER, {
      senderId: userInfo._id,
      receiverId: currentFriend._id,
      isTyping: Boolean(e.target.value),
    });
  };

  const emojis = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '😝',
    '😜',
    '🧐',
    '🤓',
    '😎',
    '😕',
    '🤑',
    '🥴',
    '😱',
  ];

  const handleSelectEmoji = (e) => {
    setMessage(message + e.target.innerText);
  };

  // SEND MUTATION
  const [send, { isLoading: isSending }] = useSendMutation();

  const handleSend = async (e) => {
    try {
      if (e.target.type !== 'file') {
        if (!message) return;
        sendMessagePlayer();

        setMessage('');

        // gửi tín hiệu typing
        socket.emit(TYPING_TO_SERVER, {
          senderId: userInfo._id,
          receiverId: currentFriend._id,
          isTyping: false,
        });

        // Cập nhật tin nhắn là "sending"
        const sendingId = randomstring.generate();

        socket.emit(MESSAGE_STATUS_TO_SERVER, {
          sendingId,
          senderId: userInfo._id,
          receiverId: currentFriend._id,
          content: { text: message },
          status: 'sending',
        });

        // Gửi tin nhắn thật sự (lưu vào db)
        const res = await send({
          receiverId: currentFriend._id,
          text: message,
          status: 'sent',
        }).unwrap();

        // Cập nhật thành sent
        socket.emit(MESSAGE_TO_SERVER, {
          ...res.data.message,
          sendingId,
        });
      } else if (e.target.type === 'file') {
        sendMessagePlayer();

        const formData = new FormData();

        formData.append('receiverId', currentFriend._id);
        formData.append('image', e.target.files[0]);

        const res = await send(formData).unwrap();

        // Cập nhật thành sent
        socket.emit(MESSAGE_TO_SERVER, {
          ...res.data.message,
          content: { image: res.data.message.content.image },
        });
      }
      // console.log(res);
    } catch (err) {
      console.log('error from sending: ', err);
    }
  };

  return (
    <div className="message-send-section">
      <input type="checkbox" id="emoji" />
      <div className="file hover-attachment">
        <div className="add-attachment">Add Attachment</div>
        <FaPlusCircle />
      </div>

      <div className="file hover-image">
        <div className="add-image">Add Image</div>
        <input
          type="file"
          id="pic"
          className="form-control"
          onChange={handleSend}
        />
        <label htmlFor="pic">
          <FaFileImage />
        </label>
      </div>

      <div className="file hover-gift">
        <div className="add-gift">Add gift</div>
        <FaGift />
      </div>

      <div className="message-type">
        <input
          type="text"
          onChange={handleTyping}
          name="message"
          id="message"
          placeholder="Aa"
          className="form-control"
          value={message}
        />

        <div className="file hover-gift">
          <label htmlFor="emoji">
            <RiEmotionLine />
          </label>
        </div>
      </div>

      <div onClick={handleSend} className="file">
        <FaPaperPlane />
      </div>

      <div className="emoji-section">
        <div className="emoji">
          {emojis.map((e, idx) => (
            <span key={idx} onClick={handleSelectEmoji}>
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInputBar;
