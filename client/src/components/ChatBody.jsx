import React from "react";
import { useNavigate } from "react-router-dom";

const ChatBody = ({ messages, lastMessageRef, typingStatus }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 shadow-md flex items-center justify-between">
        <p className="text-lg font-semibold">Hangout with Colleagues</p>
        <button
          className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition duration-200 shadow-sm hover:shadow-md"
          onClick={handleLeaveChat}
        >
          Leave Chat
        </button>
      </header>

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-6 space-y-4">
        {messages.map((message) =>
          message.name === localStorage.getItem("userName") ? (
            <div className="flex justify-end" key={message.id}>
              <div className="flex flex-col max-w-xs">
                <p className="text-xs text-gray-400 mb-1 text-right">You</p>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg rounded-tr-none px-4 py-2 shadow-md z-20">
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-start" key={message.id}>
              <div className="flex flex-col max-w-xs">
                <p className="text-xs text-gray-500 mb-1">{message.name}</p>
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-tl-none px-4 py-2 shadow-sm">
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ),
        )}

        {typingStatus && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
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
