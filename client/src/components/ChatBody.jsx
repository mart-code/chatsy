import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const ChatBody = ({ messages, lastMessageRef, typingStatus }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const {currentUser} = useAuth();

  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <header
        className={`${isDarkMode ? "bg-gray-800 text-white border-b border-gray-700" : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"} px-6 py-4 shadow-md flex items-center justify-between transition-colors duration-200`}
      >
        <p className="text-lg font-semibold">Hangout with Colleagues</p>
        <button
          className={`font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md ${
            isDarkMode
              ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
              : "bg-white text-green-600 hover:bg-green-50"
          }`}
          onClick={handleLeaveChat}
        >
          Leave Chat
        </button>
      </header>

      <div
        className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"} p-6 space-y-4 transition-colors duration-200`}
      >
        {messages.map((message) =>
          message.name === localStorage.getItem("userName") ? (
            <div className="flex justify-end" key={message.id}>
              <div className="flex flex-col max-w-xs">
                <p
                  className={`text-xs mb-1 text-right ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  You
                </p>
                <div
                  className={`rounded-lg rounded-tr-none px-4 py-2 shadow-md z-20 ${isDarkMode ? "bg-blue-600 text-white" : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"}`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-start" key={message.id}>
              <div className="flex flex-col max-w-xs">
                <p
                  className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {currentUser.displayName}
                </p>
                <div
                  className={`rounded-lg rounded-tl-none px-4 py-2 shadow-sm ${isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"}`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ),
        )}

        {typingStatus && (
          <div
            className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-blue-400" : "text-green-600"}`}
          >
            <span className="inline-flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-blue-400" : "bg-green-500"}`}
              ></span>
              <span
                className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-blue-400" : "bg-green-500"}`}
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-blue-400" : "bg-green-500"}`}
                style={{ animationDelay: "0.4s" }}
              ></span>
            </span>
            <p>{typingStatus}</p>
          </div>
        )}
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
