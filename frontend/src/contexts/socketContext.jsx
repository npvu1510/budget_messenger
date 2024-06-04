// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

import { LOGIN_SIGNAL_TO_SERVER } from '../constants';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '../selectors';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const userInfo = useSelector(userInfoSelector);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:1510');
    setSocket(socketInstance);

    socketInstance.emit(LOGIN_SIGNAL_TO_SERVER, userInfo);

    // socketInstance.on('connect', () => {
    //   console.log('Connected to socket server');
    // });

    // socketInstance.on('disconnect', () => {
    //   console.log('Disconnected from socket server');
    // });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
