import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useChatContext } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

const ChatBar = ({ socket, onlineUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useTheme();
  const { setCurrentChat } = useChatContext();
  const { currentUser } = useAuth();

  // Filter out current user from the list
  const filtered = (onlineUsers || []).filter(
    (user) => user.userId !== currentUser?.uid,
  );

  const filteredUsers = searchTerm.trim()
    ? filtered.filter((user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : filtered;

  const handleSelectUser = (user) => {
    setCurrentChat({
      type: "private",
      id: user.userId,
      name: user.userName,
      email: user.email,
    });
  };

  return (
    <div
      className={`h-full ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-linear-to-b from-blue-50 to-slate-50 border-blue-200"} border-r flex flex-col p-6 transition-colors duration-200 w-64`}
    >
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-blue-800"}`}
        >
          Direct Messages
        </h2>
        <div
          className={`h-1 w-12 rounded-full mt-2 ${isDarkMode ? "bg-blue-500" : "bg-linear-to-r from-blue-500 to-blue-500"}`}
        ></div>
      </div>

      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
              : "border-blue-200 focus:ring-blue-500"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <h4
          className={`text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-blue-700"}`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? "bg-green-500" : "bg-green-500"}`}
          ></span>
          Active Users ({filteredUsers.length})
        </h4>
        <div className="space-y-2 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.userId}
              className={`p-3 rounded-lg border transition duration-200 cursor-pointer group ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-500"
                  : "bg-white border-blue-100 hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => handleSelectUser(user)}
            >
              <p
                className={`text-sm font-medium transition ${isDarkMode ? "text-gray-100 group-hover:text-blue-400" : "text-gray-700 group-hover:text-blue-700"}`}
              >
                {user.userName}
              </p>
              <p
                className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                {user.email}
              </p>
              <span
                className={`inline-block w-2 h-2 rounded-full mt-2 transition ${isDarkMode ? "bg-green-500 group-hover:bg-green-400" : "bg-green-500 group-hover:bg-green-600"}`}
              ></span>
            </div>
          ))}
        </div>
        {filteredUsers.length === 0 && (
          <div className="flex items-center justify-center flex-1">
            <p
              className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              {searchTerm ? "No users found" : "No active users"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBar;
