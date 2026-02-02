import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [currentChat, setCurrentChat] = useState(null); // { type: 'private' | 'group', id, name }
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState({}); // Cache messages by chatId

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setMessagesArray = useCallback((msgs) => {
    setMessages(msgs);
  }, []);

  const addTypingUser = useCallback((userId, userName, chatId) => {
    setTypingUsers((prev) => ({
      ...prev,
      [chatId]: { userId, userName },
    }));
  }, []);

  const removeTypingUser = useCallback((chatId) => {
    setTypingUsers((prev) => {
      const newState = { ...prev };
      delete newState[chatId];
      return newState;
    });
  }, []);

  const addGroup = useCallback((group) => {
    setGroups((prev) => {
      const exists = prev.some((g) => g.id === group.id);
      if (exists) return prev;
      return [...prev, group];
    });
  }, []);

  const removeGroup = useCallback((groupId) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }, []);

  const cacheMessages = useCallback((chatId, msgs) => {
    setChatHistory((prev) => ({
      ...prev,
      [chatId]: msgs,
    }));
  }, []);

  const getCachedMessages = useCallback(
    (chatId) => {
      return chatHistory[chatId] || [];
    },
    [chatHistory],
  );

  const value = {
    currentChat,
    setCurrentChat,
    messages,
    setMessages: setMessagesArray,
    addMessage,
    clearMessages,
    groups,
    setGroups,
    addGroup,
    removeGroup,
    typingUsers,
    addTypingUser,
    removeTypingUser,
    onlineUsers,
    setOnlineUsers,
    cacheMessages,
    getCachedMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
