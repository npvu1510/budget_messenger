import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// slices
import friendSlice from '../slices/friendSlice';

// selectors
import { activeFriendsSelector } from '../selectors';

const ActiveFriend = () => {
  const dispatch = useDispatch();
  const activeFriends = useSelector(activeFriendsSelector);

  const handleChangeCurrentFriend = (friend) => {
    dispatch(friendSlice.actions.setCurrentFriend(friend));
  };

  if (!activeFriends) return null;

  return (
    <div className="active-friend">
      <div className="image-active-icon">
        {activeFriends.map((friend) => (
          <div
            className="image"
            key={friend._id}
            onClick={() => {
              handleChangeCurrentFriend(friend);
            }}
          >
            <img src={friend.image} alt="" />
            <div className="active-icon"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFriend;
