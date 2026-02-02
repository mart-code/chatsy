import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import GroupBar from "../components/GroupBar";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import {
  initializeSocketListeners,
  joinGroup,
  leaveGroup,
} from "../utils/socketUtils";
import { fetchGroups, createGroup } from "../utils/apiUtils";

const GroupPage = ({ socket }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef(null);

  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const chatContext = useChatContext();
  const { messages, typingUsers, currentChat } = chatContext;

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

    // Load groups on mount
    loadGroups();
  }, [socket, currentUser, chatContext]);

  useEffect(() => {
    // Scroll to bottom when messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join group when selected
  useEffect(() => {
    if (selectedGroup && currentUser) {
      chatContext.setCurrentChat({
        type: "group",
        id: selectedGroup.id,
        name: selectedGroup.groupName,
      });

      joinGroup(socket, {
        groupId: selectedGroup.id,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
      });
    }

    return () => {
      if (selectedGroup && currentUser) {
        leaveGroup(socket, {
          groupId: selectedGroup.id,
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email,
        });
      }
    };
  }, [selectedGroup, currentUser, socket, chatContext]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await fetchGroups();
      setGroups(data);
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim() || !currentUser) {
      alert("Please enter a group name");
      return;
    }

    try {
      setLoading(true);
      const newGroup = await createGroup({
        groupName,
        description: groupDescription,
        creatorId: currentUser.uid,
        creatorName: currentUser.displayName || currentUser.email,
        members: [],
      });
      setGroups([...groups, newGroup]);
      setGroupName("");
      setGroupDescription("");
      setShowCreateForm(false);
      setSelectedGroup(newGroup);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-stretch h-screen">
      <Navbar />
      <GroupBar
        socket={socket}
        groups={groups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
        onShowCreateForm={() => setShowCreateForm(true)}
      />
      <div className="flex-1 flex flex-col h-screen">
        {!selectedGroup ? (
          <>
            <header
              className={`${
                isDarkMode
                  ? "bg-gray-800 text-white border-b border-gray-700"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              } px-6 py-4 shadow-md transition-colors duration-200`}
            >
              <p className="text-lg font-semibold">Groups</p>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <p
                  className={`text-xl mb-6 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Select a group or create a new one
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  + Create Group
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <ChatBody
              messages={messages}
              lastMessageRef={lastMessageRef}
              typingUsers={typingUsers}
              currentChat={currentChat}
            />
            <ChatFooter socket={socket} currentChat={currentChat} />
          </>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 w-96 shadow-lg`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Create New Group
            </h2>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Description
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Enter group description (optional)"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "border-gray-300 text-gray-800"
                  }`}
                  rows="4"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setGroupName("");
                    setGroupDescription("");
                  }}
                  className={`px-4 py-2 rounded-lg transition ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
