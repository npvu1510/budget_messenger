import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { FaEllipsisH, FaEdit, FaSistrix } from 'react-icons/fa';

import ActiveFriendList from '../components/ActiveFriendList';
// import FriendItem from '../components/FriendItem';
import FriendList from '../components/FriendList';
import RightSide from '../components/RightSide';

import friendSlice from '../slices/friendSlice';

import {
  currentFriendSelector,
  getFriends,
  setShowMessages,
  socketSelector,
  userInfoSelector,
} from '../selectors';

import useSound from 'use-sound';
import notSfx from '../audio/notification.mp3';
import sendSfx from '../audio/sending.mp3';

import { useSocket } from '../contexts/socketContext';

import {
  ACTIVE_USERS_FROM_SERVER,
  DEV_FROM_SERVER,
  TYPING_FROM_SERVER,
  LOGOUT_TO_SERVER,
  LOGIN_SIGNAL_TO_SERVER,
} from '../constants';

import { FaSignOutAlt } from 'react-icons/fa';
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

  const [hide, setHide] = useState(true);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Cấu hình socket
  useEffect(() => {
    if (!socket) return;

    // Nhận danh sách users active
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

                {/* <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                  <h3>Dark Mode </h3>
                  <div className="on">
                    <label htmlFor="dark">ON</label>
                    <input type="radio" value="dark" name="theme" id="dark" />
                  </div>

                  <div className="of">
                    <label htmlFor="white">OFF</label>
                    <input type="radio" value="white" name="theme" id="white" />
                  </div>

                  <div onClick={handleLogout} className="logout">
                    <FaSignOutAlt /> Logout
                  </div>
                </div> */}
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

            {/* <div className="active-friends">
              <ActiveFriendList />
            </div> */}

            {/* {friendsQuery.isFetching && <span>Loading...</span>} */}

            <FriendList search={search} />
          </div>
        </div>

        <RightSide />
      </div>
    </div>
  );
};

export default Messenger;
