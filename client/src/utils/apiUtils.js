/**
 * API utility functions for Chatsy backend
 */

const API_BASE_URL = "http://localhost:4000/api";

/**
 * Get all groups
 */
export const fetchGroups = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) {
      throw new Error("Failed to fetch groups");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

/**
 * Create a new group
 */
export const createGroup = async (groupData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData),
    });
    if (!response.ok) {
      throw new Error("Failed to create group");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

/**
 * Get group details
 */
export const getGroupDetails = async (groupId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch group details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching group details:", error);
    throw error;
  }
};

/**
 * Add member to group
 */
export const addGroupMember = async (groupId, userId, userName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, userName }),
    });
    if (!response.ok) {
      throw new Error("Failed to add member to group");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding member to group:", error);
    throw error;
  }
};

/**
 * Remove member from group
 */
export const removeGroupMember = async (groupId, userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/groups/${groupId}/members/${userId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      throw new Error("Failed to remove member from group");
    }
    return await response.json();
  } catch (error) {
    console.error("Error removing member from group:", error);
    throw error;
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Server health check failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error during health check:", error);
    throw error;
  }
};
