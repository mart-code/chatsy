import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const GroupBar = ({
  socket,
  groups,
  selectedGroup,
  onSelectGroup,
  onShowCreateForm,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useTheme();

  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`h-full ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-gradient-to-b from-blue-50 to-slate-50 border-blue-200"
      } border-r flex flex-col p-6 transition-colors duration-200 w-64`}
    >
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-blue-800"
          }`}
        >
          Groups
        </h2>
        <div
          className={`h-1 w-12 rounded-full mt-2 ${
            isDarkMode
              ? "bg-blue-500"
              : "bg-linear-to-r from-blue-500 to-blue-500"
          }`}
        ></div>
      </div>

      {/* Create Group Button */}
      <button
        onClick={onShowCreateForm}
        className={`w-full mb-4 px-4 py-2 rounded-lg font-semibold transition ${
          isDarkMode
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        + New Group
      </button>

      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search groups..."
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
          className={`text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-blue-700"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              isDarkMode ? "bg-purple-500" : "bg-purple-500"
            }`}
          ></span>
          Your Groups ({filteredGroups.length})
        </h4>
        <div className="space-y-2 overflow-y-auto">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className={`p-3 rounded-lg border transition duration-200 cursor-pointer group ${
                selectedGroup?.id === group.id
                  ? isDarkMode
                    ? "bg-blue-600 border-blue-500"
                    : "bg-blue-500 border-blue-400"
                  : isDarkMode
                    ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-500"
                    : "bg-white border-blue-100 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <p
                className={`text-sm font-medium transition ${
                  selectedGroup?.id === group.id
                    ? "text-white"
                    : isDarkMode
                      ? "text-gray-100 group-hover:text-blue-400"
                      : "text-gray-700 group-hover:text-blue-700"
                }`}
              >
                {group.groupName}
              </p>
              <p
                className={`text-xs mt-1 ${
                  selectedGroup?.id === group.id
                    ? "text-blue-100"
                    : isDarkMode
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              >
                {group.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span
                  className={`px-2 py-1 rounded ${
                    selectedGroup?.id === group.id
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                        ? "bg-gray-600 text-gray-300"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {group.members?.length || 0} members
                </span>
              </div>
            </div>
          ))}
        </div>
        {filteredGroups.length === 0 && (
          <div className="flex items-center justify-center flex-1">
            <p
              className={`text-sm text-center ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {searchTerm ? "No groups found" : "No groups yet. Create one!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupBar;
