// pacakges
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// my components
import FriendItem from './FriendItem';

// slices
import friendSlice from '../slices/friendSlice';

// api slices
import { useGetMyFriendsWithLastMsgQuery } from '../slices/userApiSlice';

// selectors
import { currentFriendSelector, userInfoSelector } from '../selectors';
import messageSlice from '../slices/messageSlice';
import { useSocket } from '../contexts/socketContext';
import { DEV_FROM_SERVER, SEEN_FROM_SERVER } from '../constants';

import apiSlice from '../slices/apiSlice';

const FriendList = ({ search }) => {
  const dispatch = useDispatch();

  const userInfo = useSelector(userInfoSelector);

  const currentFriend = useSelector(currentFriendSelector);

  // FRIENDS WITH LAST MESSAGE QUERY
  const friendsQuery = useGetMyFriendsWithLastMsgQuery(undefined, {
    // pollingInterval: 10000,
    // skipPollingIfUnfocused: true,
  });
  const [friends, setFriends] = useState(null);

  // search friends
  useEffect(() => {
    let friendForDisplay = friendsQuery.data?.data.users;

    if (friendsQuery.data) {
      friendForDisplay = friendForDisplay.filter((fr) =>
        fr.userName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFriends(friendForDisplay);
  }, [friendsQuery, search]);

  // Thông tin bạn bè đang nhắn tin
  useEffect(() => {
    if (friends)
      dispatch(
        friendSlice.actions.setCurrentFriend(currentFriend || friends[0])
      );
  }, [currentFriend, friends, dispatch]);

  useEffect(() => {
    if (friends) {
      const newMessagesFrom = friends
        .filter(
          (fr) =>
            fr.lastMsg &&
            fr.lastMsg.senderId !== userInfo._id &&
            fr.lastMsg.status !== 'seen'
        )
        .map((fr) => fr._id);

      dispatch(messageSlice.actions.setNewMessage(newMessagesFrom));
    }
  }, [friends, userInfo, dispatch]);

  const handleChangeFriend = (friend) => {
    dispatch(friendSlice.actions.setCurrentFriend(friend));
    dispatch(messageSlice.actions.setTyping(null));
  };

  return (
    <div className="friends">
      {(friendsQuery.isFetching || !currentFriend) && <span>Loading...</span>}
      {friends &&
        currentFriend &&
        friends.map((fd) => (
          <div
            key={fd._id}
            onClick={() => handleChangeFriend(fd)}
            className={
              currentFriend._id === fd._id
                ? 'hover-friend active'
                : 'hover-friend'
            }
          >
            <FriendItem friend={fd} />
          </div>
        ))}
    </div>
  );
};
export default FriendList;
