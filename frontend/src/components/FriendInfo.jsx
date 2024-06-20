import { useState, useEffect } from 'react';
import { FaCaretSquareDown, FaCaretSquareUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { activeFriendsSelector, currentFriendSelector } from '../selectors';

import { useGetMessagesQuery } from '../slices/messageApiSlice';

const FriendInfo = () => {
  const currentFriend = useSelector(currentFriendSelector);
  const activeFriends = useSelector(activeFriendsSelector);

  const [isActive, setIsActive] = useState(false);

  const messagesQuery = useGetMessagesQuery(currentFriend._id, {
    skip: !currentFriend,
  });

  const [images, setImages] = useState(false);

  useEffect(() => {
    if (!messagesQuery.data) return;

    const imagesForDisplay = messagesQuery.data?.data.messages
      .filter((msg) => msg.content.image)
      .map((msg) => msg.content.image);

    // console.log(imagesForDisplay);
    setImages(imagesForDisplay);
  }, [messagesQuery]);

  const [expandImages, setExpandImages] = useState(false);

  useEffect(() => {
    if (!currentFriend || !activeFriends) return;

    setIsActive(
      activeFriends?.find((friend) => friend._id === currentFriend._id)
    );
  }, [currentFriend, activeFriends]);
  return (
    <div className="friend-info">
      <input type="checkbox" id="gallery" />
      <div className="image-name">
        <div className="image">
          <img src={currentFriend.image} alt="" />
        </div>

        {isActive && <div className="active-user">Active</div>}
        <div className="name">
          <h4>{currentFriend.userName} </h4>
        </div>
      </div>
      <div className="others">
        <div className="custom-chat">
          <h3>Coustomise Chat </h3>
          <FaCaretSquareDown />
        </div>
        <div className="privacy">
          <h3>Privacy and Support </h3>
          <FaCaretSquareDown />
        </div>
        <div
          className="media"
          onClick={() => setExpandImages((expandImages) => !expandImages)}
        >
          <h3>Shared Media </h3>
          <label htmlFor="gallery">
            {expandImages ? <FaCaretSquareDown /> : <FaCaretSquareUp />}
          </label>
        </div>
      </div>
      {expandImages && (
        <div className="gallery">
          {images &&
            images.map((image) => <img key={image} src={image} alt="" />)}
        </div>
      )}
    </div>
  );
};

export default FriendInfo;
