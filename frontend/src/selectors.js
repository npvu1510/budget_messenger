// auth selectors
export const userInfoSelector = (state) => state.user?.userInfo;

// message selectors
export const showMessagesSelector = (state) => state.message.showMessages;
export const typingSelector = (state) => state.message.typing;
export const newMessagesFromSelector = (state) => state.message.newMessagesFrom;

// friend selectors
export const currentFriendSelector = (state) => state.friend.currentFriend;
export const activeFriendsSelector = (state) => state.friend?.activeFriends;
