import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("");
  const { isDarkMode } = useTheme();

  const handleTyping = () => {
    socket.emit("typing", { name: localStorage.getItem("userName") });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      socket.emit("message", {
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
  };
  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-green-200"} border-t p-6 shadow-lg transition-colors duration-200`}
    >
      <form className="flex gap-3" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write a message..."
          className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-transparent"
              : "border-green-200 focus:ring-green-500 focus:border-transparent"
          }`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button
          className={`text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
