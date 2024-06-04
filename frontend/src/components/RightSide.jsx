// packages
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// 3rd components
import { FaPhoneAlt, FaVideo, FaRocketchat } from 'react-icons/fa';

// my components
import FriendInfo from './FriendInfo';
import ChatWindow from './ChatWindow';
import ChatInputBar from './ChatInputBar';

// selectors
import { activeFriendsSelector, currentFriendSelector } from '../selectors';
import { current } from '@reduxjs/toolkit';

// import {
//   useGetMessagesQuery,
//   useSendMessageMutation,
//   useSendImageMutation,
// } from '../slices/messageApiSlice';

// import messageSlice from '../slices/messageSlice';
// import { getMessages } from '../selectors';

const RightSide = () => {
  const currentFriend = useSelector(currentFriendSelector);
  const activeFriends = useSelector(activeFriendsSelector);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!currentFriend || !activeFriends) return;

    setIsActive(
      activeFriends?.find((friend) => friend._id === currentFriend._id)
    );
  }, [currentFriend, activeFriends]);

  return (
    <>
      {!currentFriend && <span>Loading...</span>}
      {currentFriend && (
        <div className="col-9">
          <div className="right-side">
            <input type="checkbox" id="dot" />
            <div className="row">
              <div className="col-8">
                <div className="message-send-show">
                  <div className="header">
                    <div className="image-name">
                      <div className="image">
                        <img src={currentFriend.image} alt="" />
                        {isActive && <div className="active-icon"></div>}
                      </div>
                      <div className="name">
                        <h3>{currentFriend.userName}</h3>
                      </div>
                    </div>
                    <div className="icons">
                      <div className="icon">
                        <FaPhoneAlt />
                      </div>
                      <div className="icon">
                        <FaVideo />
                      </div>
                      <div className="icon">
                        <label htmlFor="dot">
                          <FaRocketchat />
                        </label>
                      </div>
                    </div>
                  </div>
                  <ChatWindow />
                  <ChatInputBar />
                </div>
              </div>
              <div className="col-4">
                <FriendInfo />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RightSide;
