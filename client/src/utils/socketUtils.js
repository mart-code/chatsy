/**
 * Socket utility functions for chat operations
 */

export const socketEvents = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // User events
  NEW_USER: "newUser",
  NEW_USER_RESPONSE: "newUserResponse",
  GET_ONLINE_USERS: "getOnlineUsers",
  ONLINE_USERS: "onlineUsers",

  // Private message events
  PRIVATE_MESSAGE: "privateMessage",
  PRIVATE_MESSAGE_RESPONSE: "privateMessageResponse",
  GET_PRIVATE_CHAT_HISTORY: "getPrivateChatHistory",
  PRIVATE_CHAT_HISTORY: "privateChatHistory",
  MESSAGE_CONFIRM: "messageConfirm",
  MESSAGE_ERROR: "messageError",

  // Group events
  GROUP_MESSAGE: "groupMessage",
  GROUP_MESSAGE_RESPONSE: "groupMessageResponse",
  JOIN_GROUP: "joinGroup",
  LEAVE_GROUP: "leaveGroup",
  USER_JOINED_GROUP: "userJoinedGroup",
  USER_LEFT_GROUP: "userLeftGroup",
  GROUP_CHAT_HISTORY: "groupChatHistory",
  GROUP_ERROR: "groupError",

  // Typing events
  TYPING: "typing",
  USER_TYPING: "userTyping",
  STOP_TYPING: "stopTyping",
  USER_STOPPED_TYPING: "userStoppedTyping",
};

/**
 * Initialize socket connection and setup listeners
 */
export const initializeSocketListeners = (socket, chatContext) => {
  if (!socket) return;

  // Get online users on connect
  socket.emit(socketEvents.GET_ONLINE_USERS);

  // Listen for online users
  socket.on(socketEvents.ONLINE_USERS, (users) => {
    chatContext.setOnlineUsers(users);
  });

  socket.on(socketEvents.NEW_USER_RESPONSE, (users) => {
    chatContext.setOnlineUsers(users);
  });

  // Listen for incoming private messages
  socket.on(socketEvents.PRIVATE_MESSAGE_RESPONSE, (message) => {
    chatContext.addMessage(message);
  });

  // Listen for group messages
  socket.on(socketEvents.GROUP_MESSAGE_RESPONSE, (message) => {
    chatContext.addMessage(message);
  });

  // Listen for typing indicators
  socket.on(socketEvents.USER_TYPING, (data) => {
    chatContext.addTypingUser(
      data.userId,
      data.userName,
      data.groupId || `private_${data.userId}`,
    );
  });

  socket.on(socketEvents.USER_STOPPED_TYPING, (data) => {
    chatContext.removeTypingUser(data.groupId || `private_${data.userId}`);
  });

  // Listen for group history
  socket.on(socketEvents.GROUP_CHAT_HISTORY, (data) => {
    chatContext.setMessages(data.messages);
    chatContext.cacheMessages(`group_${data.groupId}`, data.messages);
  });

  // Listen for private chat history
  socket.on(socketEvents.PRIVATE_CHAT_HISTORY, (data) => {
    chatContext.setMessages(data.messages);
    chatContext.cacheMessages(data.chatId, data.messages);
  });

  // Listen for group events
  socket.on(socketEvents.USER_JOINED_GROUP, (data) => {
    console.log(`${data.userName} joined ${data.groupId}`);
  });

  socket.on(socketEvents.USER_LEFT_GROUP, (data) => {
    console.log(`${data.userName} left ${data.groupId}`);
  });

  // Error handlers
  socket.on(socketEvents.MESSAGE_ERROR, (data) => {
    console.error("Message error:", data.error);
  });

  socket.on(socketEvents.GROUP_ERROR, (data) => {
    console.error("Group error:", data.error);
  });
};

/**
 * Send a private message
 */
export const sendPrivateMessage = (socket, data) => {
  socket.emit(socketEvents.PRIVATE_MESSAGE, {
    senderId: data.senderId,
    senderName: data.senderName,
    receiverId: data.receiverId,
    text: data.text,
  });
};

/**
 * Request private chat history
 */
export const requestPrivateChatHistory = (socket, data) => {
  socket.emit(socketEvents.GET_PRIVATE_CHAT_HISTORY, {
    userId: data.userId,
    otherUserId: data.otherUserId,
    otherUserName: data.otherUserName,
  });
};

/**
 * Send a group message
 */
export const sendGroupMessage = (socket, data) => {
  socket.emit(socketEvents.GROUP_MESSAGE, {
    groupId: data.groupId,
    senderId: data.senderId,
    senderName: data.senderName,
    text: data.text,
  });
};

/**
 * Join a group
 */
export const joinGroup = (socket, data) => {
  socket.emit(socketEvents.JOIN_GROUP, {
    groupId: data.groupId,
    userId: data.userId,
    userName: data.userName,
  });
};

/**
 * Leave a group
 */
export const leaveGroup = (socket, data) => {
  socket.emit(socketEvents.LEAVE_GROUP, {
    groupId: data.groupId,
    userId: data.userId,
    userName: data.userName,
  });
};

/**
 * Send typing indicator
 */
export const sendTypingIndicator = (socket, data) => {
  socket.emit(socketEvents.TYPING, data);
};

/**
 * Send stop typing indicator
 */
export const sendStopTypingIndicator = (socket, data) => {
  socket.emit(socketEvents.STOP_TYPING, data);
};
