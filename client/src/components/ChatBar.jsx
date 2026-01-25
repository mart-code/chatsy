import React, { useState, useEffect } from "react";

const ChatBar = ({ socket }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users]);

  return (
    <div className="h-full bg-gradient-to-b from-green-50 to-emerald-50 border-r border-green-200 flex flex-col p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-800">Open Chat</h2>
        <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2"></div>
      </div>

      <div className="flex-1 flex flex-col">
        <h4 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Active Users
        </h4>
        <div className="space-y-2 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.socketID}
              className="p-3 bg-white rounded-lg border border-green-100 hover:border-green-300 hover:bg-green-50 transition duration-200 cursor-pointer group"
            >
              <p className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition">
                {user.userName}
              </p>
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1 group-hover:bg-green-600 transition"></span>
            </div>
          ))}
        </div>
        {users.length === 0 && (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            <p className="text-sm">No active users</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBar;
