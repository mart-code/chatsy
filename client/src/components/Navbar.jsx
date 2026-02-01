import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("groups");

  const navItems = [
    {
      id: "private-chat",
      label: "Private Chat",
      icon: "💬",
      tooltip: "Private Chat",
      action: () => {setActiveNav("private-chat")
        navigate('/private-chat')
      }
    },
    {
      id: "groups",
      label: "Groups",
      icon: "👥",
      tooltip: "Groups",
      action: () => {setActiveNav("groups")
        navigate('/groups')
      },
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: "🏠",
      tooltip: "Rooms",
      action: () => {setActiveNav("rooms")
        navigate('/rooms')
      },
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: "📋",
      tooltip: "Manage Tasks",
      action: () => {setActiveNav("tasks")
        navigate('/tasks')
      },
    },
  ];


  return (
    <div
      className={`w-20 h-screen flex flex-col items-center justify-between py-6 border-r transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      {/* Top Navigation Items */}
      <div className="flex flex-col items-center gap-6">
        {/* Navigation Items */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 group relative ${
              activeNav === item.id
                ? isDarkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            title={item.tooltip}
          >
            <span className="text-2xl">{item.icon}</span>

            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 px-3 py-1 rounded whitespace-nowrap text-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-700 text-white"
              }`}
            >
              {item.tooltip}
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Navigation Items */}
      <div className="flex flex-col items-center gap-6">
        {/* Divider */}
        <div
          className={`w-10 h-px ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
        />

        {/* Theme Toggle */}
        <button
          className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 group relative ${
            isDarkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-800"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          title="Toggle Theme"
        >
          <span className="text-2xl">{isDarkMode ? "☀️" : "🌙"}</span>
          <div
            className={`absolute left-full ml-2 px-3 py-1 rounded whitespace-nowrap text-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-700 text-white"
            }`}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </div>
        </button>

        {/* Profile Settings */}
        <button
          onClick={() => navigate("/profile")}
          className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 group relative ${
            isDarkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-800"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          title="Profile Settings"
        >
          <span className="text-2xl">⚙️</span>
          <div
            className={`absolute left-full ml-2 px-3 py-1 rounded whitespace-nowrap text-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-700 text-white"
            }`}
          >
            Settings
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
