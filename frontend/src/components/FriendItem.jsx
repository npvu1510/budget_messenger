import moment from 'moment';
import { useSelector } from 'react-redux';
import { activeFriendsSelector, userInfoSelector } from '../selectors';

import { FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';
import { newMessagesFromSelector } from '../selectors';
import { useEffect, useState } from 'react';

const FriendItem = ({ friend }) => {
  const userInfo = useSelector(userInfoSelector);
  const activeFriends = useSelector(activeFriendsSelector);
  const newMessagesFrom = useSelector(newMessagesFromSelector);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (activeFriends)
      setIsActive(activeFriends.find((fr) => fr._id === friend._id));
  }, [activeFriends, friend._id, setIsActive]);

  return (
    <div className="friend">
      <div className="friend-image">
        <div className="image">
          <img src={`${friend.image}`} alt="" />
          {isActive && <div className="active_icon"></div>}
        </div>
      </div>

      <div className="friend-name-seen">
        <div className="friend-name">
          {/* <h4>{friend.userName}</h4> */}
          <h4
            className={
              newMessagesFrom.includes(friend._id) ? 'unseen_message ' : ''
            }
          >
            {friend.userName}
          </h4>
          <div className="msg-time">
            {friend.lastMsg && friend.lastMsg.senderId === userInfo._id ? (
              <span>
                <strong>You: </strong>
              </span>
            ) : (
              <span
                className={
                  newMessagesFrom.includes(friend._id) ? 'unseen_message ' : ''
                }
              >
                <strong>{friend.userName + ': '}</strong>
              </span>
            )}
            {friend.lastMsg && friend.lastMsg.content.text ? (
              <span>{friend.lastMsg.content.text.slice(0, 10)} </span>
            ) : friend.lastMsg && friend.lastMsg.content.image ? (
              <span>Send A image </span>
            ) : (
              <span>Connect You </span>
            )}
            <span>
              {friend.lastMsg
                ? moment(friend.lastMsg.createdAt).startOf('mini').fromNow()
                : moment(friend.createdAt).startOf('mini').fromNow()}
            </span>
          </div>
        </div>
        {/* {friend.lastMsg && <h6>{JSON.stringify(friend.lastMsg.status)}</h6>} */}

        {/* Tin nhắn bạn nhận */}
        {userInfo && friend.lastMsg ? (
          userInfo._id !== friend.lastMsg.senderId ? (
            newMessagesFrom.includes(friend._id) && (
              <div className="seen-unseen-icon">
                <div className="seen-icon"></div>
              </div>
            )
          ) : (
            // Tin nhắn bạn gửi
            <div className="seen-unseen-icon">
              {friend.lastMsg.status === 'seen' && (
                <img src={`${friend.image}`} alt="" />
              )}

              {friend.lastMsg.status === 'delivered' && (
                <div className="delivared">
                  <FaCheckCircle />
                </div>
              )}

              {friend.lastMsg.status === 'sent' && (
                <div className="delivared">
                  <FaRegCheckCircle />
                </div>
              )}
            </div>
          )
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default FriendItem;
