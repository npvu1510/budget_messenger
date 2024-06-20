import { Server } from 'socket.io';
import {
  ACTIVE_USERS_FROM_SERVER,
  LOGIN_SIGNAL_TO_SERVER,
  LOGOUT_TO_SERVER,
  MESSAGE_FROM_SERVER,
  MESSAGE_FROM_SERVER_FOR_MYSELF,
  MESSAGE_STATUS_TO_SERVER,
  MESSAGE_TO_SERVER,
  TYPING_FROM_SERVER,
  TYPING_TO_SERVER,
} from './constants.js';

let users = {};
let socket_to_user = {};

const addUsers = (userInfo, socketInfo) => {
  if (!userInfo) return;

  const { _id } = userInfo;

  if (!users[_id]) {
    users[_id] = { ...userInfo, socketIds: [] };
  }

  if (!users[_id].socketIds.includes(socketInfo.id))
    users[_id].socketIds.push(socketInfo.id);

  socket_to_user[socketInfo.id] = userInfo._id;
};

const removeUsers = (socketId) => {
  const userId = socket_to_user[socketId];

  if (!userId || !users[userId]) return;

  users[userId].socketIds = users[userId].socketIds.filter(
    (id) => id !== socketId
  );
  if (users[userId].socketIds.length === 0) delete users[userId];
  delete socket_to_user[socketId];

  console.log('DANH SACH SAU KHI XOA');
};

const io = new Server(1510, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // console.log(`Socket id: ${socket.id} is established`);

  // Nhận thông tin đăng nhập
  socket.on(LOGIN_SIGNAL_TO_SERVER, (userInfo) => {
    if (!userInfo) return;

    addUsers(userInfo, socket);
    // console.log('DANH SACH SAU HIEN TAI');
    // console.log(users);

    io.emit(ACTIVE_USERS_FROM_SERVER, users);
  });

  // Nhận message với status là sending
  socket.on(MESSAGE_STATUS_TO_SERVER, (payload) => {
    const { senderId, receiverId, status } = payload;

    const senders = users[senderId]?.socketIds;

    // gửi đến tất cả bản thân để cập nhật giao diện
    if (senders) {
      senders.forEach((id) =>
        io.to(id).emit(MESSAGE_FROM_SERVER_FOR_MYSELF, payload)
      );
    }
  });

  // Nhận message và gửi đi
  socket.on(MESSAGE_TO_SERVER, (payload) => {
    const { senderId, receiverId, status } = payload;

    const senders = users[senderId]?.socketIds;

    // gửi đến tất cả bản thân để cập nhật giao diện
    if (senders) {
      // console.log(senders);
      senders.forEach((id) => {
        io.to(id).emit(MESSAGE_FROM_SERVER_FOR_MYSELF, payload);
      });
    }

    const receivers = users[receiverId]?.socketIds;

    // gửi đến người nhận
    if (receivers) {
      receivers.forEach((id) => io.to(id).emit(MESSAGE_FROM_SERVER, payload));
    }
  });

  // Nhận tín hiệu typing
  socket.on(TYPING_TO_SERVER, (payload) => {
    const { receiverId } = payload;
    const receivers = users[receiverId]?.socketIds;

    if (receivers)
      receivers.forEach((id) => io.to(id).emit(TYPING_FROM_SERVER, payload));
  });

  socket.on(LOGOUT_TO_SERVER, (payload) => {
    // const { userId } = payload;

    removeUsers(socket.id);

    // if (!users[userId]) return;

    // delete users[userId];
    // console.log('xóa vì logout');
    io.emit(ACTIVE_USERS_FROM_SERVER, users);

    // const { senderId } = payload;
    // const senders = users[senderId]?.socketIds;
  });

  // Seen message
  socket.on('seenMessageOf', (payload) => {
    const { _id, lastMsg } = payload;

    if (!lastMsg) return;

    const senders = users[lastMsg.receiverId]?.socketIds;

    if (senders)
      senders.forEach((id) => io.to(id).emit('seenMessageOfFromServer', _id));
  });

  socket.on('disconnect', () => {
    // console.log(`${socket.id} disconnected`);
    removeUsers(socket.id);

    // console.log(users);
    io.emit(ACTIVE_USERS_FROM_SERVER, users);
  });
});
