import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// package
import moment from 'moment';

// slices
import messageSlice from '../slices/messageSlice';

// api slices
import {
  useGetMessagesQuery,
  useUpdateMessageStatusMutation,
} from '../slices/messageApiSlice';

// selectors
import {
  currentFriendSelector,
  userInfoSelector,
  typingSelector,
  newMessagesFromSelector,
} from '../selectors';
import { useSocket } from '../contexts/socketContext';
import {
  TYPING_FROM_SERVER,
  MESSAGE_FROM_SERVER,
  MESSAGE_FROM_SERVER_FOR_MYSELF,
  MESSAGE_STATUS_TO_SERVER,
  SEEN_MESSAGE_OF_FROM_SERVER,
} from '../constants';

import apiSlice from '../slices/apiSlice';

import useSound from 'use-sound';
import newMessageSfx from '../audio/notification.mp3';

const ChatWindow = () => {
  const dispatch = useDispatch();

  const [newMessagePlayer] = useSound(newMessageSfx);

  // Authentication
  const userInfo = useSelector(userInfoSelector);
  const currentFriend = useSelector(currentFriendSelector);
  const newMessageFrom = useSelector(newMessagesFromSelector);

  // socket
  const socket = useSocket();

  // MESSAGES QUERY
  const messagesQuery = useGetMessagesQuery(currentFriend._id, {
    skip: !currentFriend,
  });
  const messages = messagesQuery && messagesQuery.data?.data.messages;

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateMessageStatusMutation();

  useEffect(() => {
    const handleMessageForMySelf = (payload) => {
      // console.log('MYSELF:');
      // console.log(payload);

      // GỬI TIN NHẮN
      const { _id, receiverId, status, sendingId } = payload;

      // CẬP NHẬT FRIEND LIST
      dispatch(
        apiSlice.util.updateQueryData(
          'getMyFriendsWithLastMsg',
          undefined,
          (draft) => {
            const friend = draft.data.users.find(
              (user) => user._id === receiverId
            );

            if (friend) {
              friend.lastMsg = payload;
            }
          }
        )
      );

      // CẬP NHẬT CHAT WINDOW
      dispatch(
        apiSlice.util.updateQueryData(
          'getMessages',
          currentFriend._id,
          (draft) => {
            if (receiverId !== currentFriend._id) return;
            if (sendingId) {
              console.log('CẬP NHẬT MY CHAT WINDOWS');
              console.log(payload);
              if (status === 'sending') draft.data.messages.push(payload);
              else {
                draft.data.messages.find((msg) => {
                  if (msg.sendingId === sendingId) {
                    msg.status = status;
                    return true;
                  }
                  return false;
                });
              }
            } else {
              const index = draft.data.messages.findIndex((msg) => {
                if (msg._id === _id) return true;

                return false;
              });

              if (index !== -1) draft.data.messages.at(index).status = status;
              else draft.data.messages.push(payload);
            }
          }
        )
      );
    };

    // NHẬN TIN NHẮN
    const handleMessage = (payload) => {
      newMessagePlayer();
      // console.log('NEW MESSAGE:');
      // console.log(payload);

      const { _id, senderId, receiverId, content, status } = payload;

      // Cập nhật tin nhan moi
      dispatch(messageSlice.actions.addMessage(senderId));

      dispatch(
        apiSlice.util.updateQueryData(
          'getMyFriendsWithLastMsg',
          undefined,
          (draft) => {
            const friend = draft.data.users.find(
              (user) => user._id === senderId
            );
            if (friend) {
              friend.lastMsg = payload;
              // DELIVERED
              if (currentFriend._id !== senderId) {
                updateStatus({ messageId: _id, status: 'delivered' });

                socket.emit(MESSAGE_STATUS_TO_SERVER, {
                  ...payload,
                  status: 'delivered',
                });
              }
            }
          }
        )
      );

      // Cập nhật chat windows
      dispatch(
        apiSlice.util.updateQueryData(
          'getMessages',
          currentFriend._id,
          (draft) => {
            if (currentFriend._id === senderId)
              draft.data.messages.push(payload);
          }
        )
      );
    };

    socket.on(MESSAGE_FROM_SERVER, handleMessage);
    socket.on(MESSAGE_FROM_SERVER_FOR_MYSELF, handleMessageForMySelf);

    return () => {
      socket.off(MESSAGE_FROM_SERVER, handleMessage);
      socket.off(MESSAGE_FROM_SERVER_FOR_MYSELF, handleMessageForMySelf);
    };
  }, [currentFriend, socket, dispatch, updateStatus, newMessagePlayer]);

  // seen tin nhắn khi bấm vào
  useEffect(() => {
    if (messages && messages.length > 0) {
      let status = 'seen';
      // console.log('chạy useEffect để seen tin nhắn');
      // console.log(`seen messsage from: ${messages.at(-1).senderId}`);
      // console.log(currentFriend._id);

      // console.log(newMessageFrom, currentFriend._id);
      if (messages.at(-1).senderId === currentFriend._id) {
        // console.log('Đang cập nhật seen');
        // console.log('chạy useEffect để seen tin nhắn');
        // console.log(currentFriend._id);
        // console.log(messages.at(-1));
        updateStatus({ messageId: messages.at(-1)._id, status: status });

        socket.emit(MESSAGE_STATUS_TO_SERVER, {
          ...messages.at(-1),
          status: status,
        });
        dispatch(messageSlice.actions.removeMessage(currentFriend._id));
      }
    }
  }, [
    messages,
    currentFriend,
    newMessageFrom,
    userInfo,
    socket,
    updateStatus,
    dispatch,
  ]);

  // Chuyển currentUser => tin nhắn không còn mới => xóa khỏi newMessages
  useEffect(() => {
    // console.log('chạy useEffect để xóa tin nhắn mới');
    dispatch(messageSlice.actions.removeMessage(currentFriend._id));
  }, [currentFriend, dispatch]);

  useEffect(() => {
    const handleSeenMessageOf = (senderId) => {
      dispatch(messageSlice.actions.removeMessage(senderId));
    };

    socket.on(SEEN_MESSAGE_OF_FROM_SERVER, handleSeenMessageOf);

    return () => {
      socket.off(SEEN_MESSAGE_OF_FROM_SERVER, handleSeenMessageOf);
    };
  }, [dispatch, socket]);

  const typing = useSelector(typingSelector);

  // Lắng nghe typing
  useEffect(() => {
    if (!socket) return;
    const typingHandler = ({ senderId, receiverId, isTyping }) => {
      if (senderId === currentFriend._id) {
        dispatch(
          messageSlice.actions.setTyping({
            isTyping,
            userTyping: currentFriend._id,
          })
        );
      }
    };

    socket.on(TYPING_FROM_SERVER, typingHandler);

    return () => {
      socket.off(TYPING_FROM_SERVER, typingHandler);
    };
  }, [currentFriend, socket, dispatch]);

  useEffect(() => {
    const refetchWhenChangeFriend = async () => {
      if (currentFriend) {
        await messagesQuery.refetch();
      }
    };
    refetchWhenChangeFriend();
  }, [currentFriend]);

  const scrollRef = useRef();
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // return null;
  return (
    <div className="message-show">
      {messagesQuery.isFetching && <span>Loading...</span>}
      {!messagesQuery.isFetching && messages && messages.length > 0
        ? messages.map((message, idx) =>
            message.senderId === userInfo._id ? (
              // TIN NHẮN DO MÌNH GỬI
              <div key={idx} className="my-message" ref={scrollRef}>
                <div className="image-message">
                  <div className="my-text">
                    <p className="message-text">
                      {message.content.text ? (
                        message.content.text
                      ) : (
                        <img
                          src={message.content.image}
                          alt={`${message.senderId}'s resource`}
                        />
                      )}{' '}
                    </p>

                    {/* HIỂN THỊ TRẠNG THÁI TIN NHẮN CHO TIN CUỐI CÙNG */}
                  </div>
                </div>

                <div className="time">
                  {moment(message.createdAt).startOf('mini').fromNow()}
                </div>
              </div>
            ) : (
              // TIN NHẮN DO NGƯỜI KIA GỬI
              <div key={idx} className="fd-message" ref={scrollRef}>
                <div className="image-message-time">
                  <img src={`${currentFriend.image}`} alt="" />
                  <div className="message-time">
                    <div className="fd-text">
                      <p className="message-text">
                        {message.content.text ? (
                          message.content.text
                        ) : (
                          <img
                            src={message.content.image}
                            alt={`${message.senderId}'s resource`}
                          />
                        )}{' '}
                      </p>
                    </div>
                    <div className="time">
                      {moment(message.createdAt).startOf('mini').fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        : ''}
      {/* {JSON.stringify(typing)} */}
      {/* TYPING */}
      {typing && typing.isTyping && typing.userTyping === currentFriend._id && (
        <div className="typing-message">
          <div className="fd-message">
            <div className="image-message-time">
              <img src={`${currentFriend.image}`} alt="" />
              <div className="message-time">
                <div className="fd-text">
                  <p className="time">Typing Message.... </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
