import React, { useState } from "react";

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("");

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
    <div className="bg-white border-t border-green-200 p-6 shadow-lg">
      <form className="flex gap-3" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write a message..."
          className="flex-1 px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-md hover:shadow-lg">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
