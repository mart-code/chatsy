import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  sendPrivateMessage,
  sendGroupMessage,
  sendTypingIndicator,
  sendStopTypingIndicator,
} from "../utils/socketUtils";

const ChatFooter = ({ socket, currentChat }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const typingTimeoutRef = React.useRef(null);

  const handleTyping = () => {
    if (!currentChat || !socket) return;

    if (!isTyping) {
      setIsTyping(true);

      const typingData = {
        userId: currentUser?.uid,
        userName: currentUser?.displayName || currentUser?.email,
      };

      if (currentChat.type === "private") {
        typingData.receiverId = currentChat.id;
        typingData.type = "private";
      } else if (currentChat.type === "group") {
        typingData.groupId = currentChat.id;
        typingData.type = "group";
      }

      sendTypingIndicator(socket, typingData);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const stopTypingData = {
        userId: currentUser?.uid,
      };

      if (currentChat.type === "private") {
        stopTypingData.receiverId = currentChat.id;
        stopTypingData.type = "private";
      } else if (currentChat.type === "group") {
        stopTypingData.groupId = currentChat.id;
        stopTypingData.type = "group";
      }

      sendStopTypingIndicator(socket, stopTypingData);
    }, 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || !currentChat || !socket || !currentUser) {
      return;
    }

    const messageData = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email,
      text: message,
    };

    if (currentChat.type === "private") {
      messageData.receiverId = currentChat.id;
      sendPrivateMessage(socket, messageData);
    } else if (currentChat.type === "group") {
      messageData.groupId = currentChat.id;
      sendGroupMessage(socket, messageData);
    }

    setMessage("");
    setIsTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  if (!currentChat) {
    return (
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-blue-200"} border-t p-6 shadow-lg transition-colors duration-200`}
      >
        <p
          className={`text-center ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-blue-200"} border-t p-6 shadow-lg transition-colors duration-200`}
    >
      <form className="flex gap-3" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write a message..."
          className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-transparent"
              : "border-blue-200 focus:ring-blue-500 focus:border-transparent"
          }`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") {
              handleTyping();
            }
          }}
        />
        <button
          type="submit"
          className={`text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          }`}
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
