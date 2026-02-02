import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const ChatBody = ({ messages, lastMessageRef, typingUsers, currentChat }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();

  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    navigate("/");
    window.location.reload();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTypingIndicatorKey = () => {
    if (!currentChat) return null;
    if (currentChat.type === 'private') {
      return `private_${currentChat.id}`;
    }
    return `group_${currentChat.id}`;
  };

  const typingKey = getTypingIndicatorKey();
  const isTyping = typingKey && typingUsers[typingKey];

  return (
   <>
      <header
        className={`${isDarkMode ? "bg-gray-800 text-white border-b border-gray-700" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"} px-6 py-4 shadow-md flex items-center justify-between transition-colors duration-200`}
      >
        <div>
          <p className="text-lg font-semibold">
            {currentChat ? currentChat.name : "Select a chat"}
          </p>
          {currentChat?.type === 'private' && (
            <p className="text-xs opacity-80">{currentChat.email}</p>
          )}
        </div>
        <button
          className={`font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md ${
            isDarkMode
              ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
              : "bg-white text-blue-600 hover:bg-blue-50"
          }`}
          onClick={handleLeaveChat}
        >
          Leave Chat
        </button>
      </header>

      <div
        className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"} p-6 space-y-4 transition-colors duration-200`}
      >
        {!currentChat && (
          <div className="flex items-center justify-center h-full">
            <p
              className={`text-lg ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              Select a user to start chatting
            </p>
          </div>
        )}

        {currentChat && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p
              className={`text-lg ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isOwnMessage = message.senderId === currentUser?.uid;
          return (
            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`} key={message.id}>
              <div className="flex flex-col max-w-xs">
                <p
                  className={`text-xs mb-1 ${
                    isOwnMessage
                      ? `text-right ${isDarkMode ? "text-gray-500" : "text-gray-400"}`
                      : `${isDarkMode ? "text-gray-400" : "text-gray-500"}`
                  }`}
                >
                  {isOwnMessage ? 'You' : message.senderName}
                  {message.timestamp && (
                    <span className="ml-2">{formatTime(message.timestamp)}</span>
                  )}
                </p>
                <div
                  className={`rounded-lg px-4 py-2 shadow-md ${
                    isOwnMessage
                      ? `${isDarkMode ? "bg-blue-600 text-white" : "bg-gradient-to-r from-blue-500 to-blue-500 text-white"} rounded-tr-none`
                      : `${isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"} rounded-tl-none`
                  }`}
                >
                  <p className="text-sm break-words">{message.text}</p>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div
            className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
          >
            <span className="inline-flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
              ></span>
              <span
                className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
                style={{ animationDelay: "0.4s" }}
              ></span>
            </span>
            <p>{isTyping.userName} is typing...</p>
          </div>
        )}
        </div>
        </>
  );
};

export default ChatBody;
