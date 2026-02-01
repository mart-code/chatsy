import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";


const GroupBar = ({ socket }) => {
  const [users, setUsers] = useState([]);
  const { isDarkMode } = useTheme();


  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users]);

  return (
    <div
      className={`h-full ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gradient-to-b from-blue-50 to-slate-50 border-blue-200"} border-r flex flex-col p-6 transition-colors duration-200`}
    >
      <div className="mb-8">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-blue-800"}`}
        >
          Open Chat
        </h2>
        <div
          className={`h-1 w-12 rounded-full mt-2 ${isDarkMode ? "bg-blue-500" : "bg-gradient-to-r from-blue-500 to-blue-500"}`}
        ></div>
      </div>

      <div className="flex-1 flex flex-col">
        <h4
          className={`text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-blue-700"}`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? "bg-blue-500" : "bg-blue-500"}`}
          ></span>
          Active Users
        </h4>
        <div className="space-y-2 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.socketID}
              className={`p-3 rounded-lg border transition duration-200 cursor-pointer group ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-500"
                  : "bg-white border-blue-100 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <p
                className={`text-sm font-medium transition ${isDarkMode ? "text-gray-100 group-hover:text-blue-400" : "text-gray-700 group-hover:text-blue-700"}`}
              >
                {user.userName}
              </p>
              <span
                className={`inline-block w-2 h-2 rounded-full mt-1 transition ${isDarkMode ? "bg-blue-500 group-hover:bg-blue-400" : "bg-blue-500 group-hover:bg-blue-600"}`}
              ></span>
            </div>
          ))}
        </div>
        {users.length === 0 && (
          <div className="flex items-center justify-center flex-1">
            <p
              className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              No active users
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default GroupBar;
