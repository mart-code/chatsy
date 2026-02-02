import React from "react";
import Navbar from "../components/Navbar";
import ChatBar from "../components/ChatBar";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import {
  initializeSocketListeners,
  requestPrivateChatHistory,
} from "../utils/socketUtils";

const ChatPage = ({ socket }) => {
  const lastMessageRef = useRef(null);
  const { currentUser } = useAuth();
  const chatContext = useChatContext();
  const { messages, currentChat, typingUsers, onlineUsers } = chatContext;

  useEffect(() => {
    // Initialize socket listeners
    initializeSocketListeners(socket, chatContext);

    // Register user when they join
    if (currentUser) {
      socket.emit("newUser", {
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        email: currentUser.email,
        socketID: socket.id,
      });
    }
  }, [socket, currentUser, chatContext]);

  // Load chat history when current chat changes
  useEffect(() => {
    if (currentChat && currentChat.type === "private" && currentUser) {
      requestPrivateChatHistory(socket, {
        userId: currentUser.uid,
        otherUserId: currentChat.id,
        otherUserName: currentChat.name,
      });
    }
  }, [currentChat, socket, currentUser]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex items-stretch h-screen">
      <Navbar />
      <ChatBar socket={socket} onlineUsers={onlineUsers} className="flex-1/4" />
      <div className="flex-3/4 flex flex-col h-screen">
        <ChatBody
          messages={messages}
          lastMessageRef={lastMessageRef}
          typingUsers={typingUsers}
          currentChat={currentChat}
        />
        <ChatFooter socket={socket} currentChat={currentChat} />
      </div>
    </div>
  );
};

export default ChatPage;
