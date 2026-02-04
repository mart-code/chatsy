import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../firebase/auth";

const Profile = () => {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      setMessage("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      // Update Firebase user profile
      await currentUser.updateProfile({
        displayName: displayName.trim(),
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-200`}
    >
      <div className="max-w-md mx-auto pt-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/private-chat")}
            className={`flex items-center gap-2 mb-6 ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Chat
          </button>
          <h1
            className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Profile Settings
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            User Information
          </h2>

          {/* Email Display */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Email
            </label>
            <input
              type="email"
              value={currentUser?.email || ""}
              disabled
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-400" : "bg-gray-100 border-gray-300 text-gray-600"} cursor-not-allowed`}
            />
          </div>

          {/* Display Name Input */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500"
              } focus:outline-none focus:ring-2`}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveName}
            disabled={isSaving}
            className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
              isSaving
                ? "opacity-50 cursor-not-allowed"
                : isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSaving ? "Saving..." : "Save Name"}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`mt-3 p-2 rounded text-sm text-center ${message.includes("successfully") ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Theme Settings */}
        <div
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Theme
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p
                className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Dark Mode
              </p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {isDarkMode ? "Dark mode is enabled" : "Light mode is active"}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isDarkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? "tranblue-x-7" : "tranblue-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
            isDarkMode
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
