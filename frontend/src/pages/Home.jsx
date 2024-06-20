import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FaEdit, FaSistrix } from 'react-icons/fa';
// import FriendItem from '../components/FriendItem';
import FriendList from '../components/FriendList';
import RightSide from '../components/RightSide';

import friendSlice from '../slices/friendSlice';

import { userInfoSelector } from '../selectors';

import { useSocket } from '../contexts/socketContext';

import {
  ACTIVE_USERS_FROM_SERVER,
  LOGOUT_TO_SERVER,
  LOGIN_SIGNAL_TO_SERVER,
} from '../constants';

import { IoLogOutOutline } from 'react-icons/io5';

import { useLogoutMutation } from '../slices/authApiSlice';
import userSlice from '../slices/userSlice';

const Messenger = () => {
  const dispatch = useDispatch();

  // contexts
  const socket = useSocket();

  // Authentication -> CHƯA CHECK ĐỂ REDIRECT KHI EXPIRED
  const userInfo = useSelector(userInfoSelector);

  const [logout, { isLoading }] = useLogoutMutation();

  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Cấu hình socket
  useEffect(() => {
    if (!socket) return;

    // Nhận danh sách users dang hoat dong
    socket.on(ACTIVE_USERS_FROM_SERVER, (users) => {
      const values = Object.values(users);
      const filteredUsers = values.filter((user) => user._id !== userInfo._id);

      dispatch(friendSlice.actions.setActiveFriends(filteredUsers));
    });
  }, [socket, userInfo, dispatch]);

  useEffect(() => {
    if (userInfo && socket) socket.emit(LOGIN_SIGNAL_TO_SERVER, userInfo);
  }, [userInfo, socket]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      socket.emit(LOGOUT_TO_SERVER, { userId: userInfo._id });

      dispatch(userSlice.actions.removeUser());
      window.location.assign('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="messenger">
      <div className="row">
        <div className="col-3">
          <div className="left-side">
            <div className="top">
              <div className="image-name">
                <div className="image">
                  <img src={`${userInfo.image}`} alt="" />
                </div>
                <div className="name">
                  <h3>{userInfo.userName} </h3>
                </div>
              </div>

              <div className="icons">
                <div onClick={handleLogout} className="icon">
                  {/* <FaEllipsisH /> */}
                  <IoLogOutOutline />
                </div>

                <div className="icon">
                  <FaEdit />
                </div>
              </div>
            </div>

            <div className="friend-search">
              <div className="search">
                <button>
                  <FaSistrix />
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control"
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <FriendList search={search} />
          </div>
        </div>

        <RightSide />
      </div>
    </div>
  );
};

export default Messenger;
