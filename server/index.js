const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

const http = require("http").Server(app);
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
try {
  const serviceAccount = require("./firebase/firebaseAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.error("Firebase initialization error:", err.message);
}

const db = admin.firestore();

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// Data structures for managing connections
let users = [];
let userSockets = {};
let rooms = {};

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // User joins
  socket.on("newUser", async (data) => {
    try {
      const existingUser = users.find((u) => u.userId === data.userId);
      if (!existingUser) {
        const userData = {
          socketID: socket.id,
          userId: data.userId,
          userName: data.userName,
          email: data.email,
          status: "online",
          joinedAt: new Date().toISOString(),
        };
        users.push(userData);
        userSockets[data.userId] = socket.id;

        // Save user status to Firebase
        await db.collection("users").doc(data.userId).set(
          {
            userId: data.userId,
            userName: data.userName,
            email: data.email,
            status: "online",
            lastSeen: new Date().toISOString(),
          },
          { merge: true },
        );
      }
      socketIO.emit("newUserResponse", users);
    } catch (err) {
      console.error("Error in newUser:", err);
    }
  });

  // Private message - one-to-one chat
  socket.on("privateMessage", async (data) => {
    try {
      const message = {
        id: `${socket.id}${Math.random()}`,
        senderId: data.senderId,
        senderName: data.senderName,
        receiverId: data.receiverId,
        text: data.text,
        timestamp: new Date().toISOString(),
        type: "private",
      };

      // Save to Firebase
      const chatId = [data.senderId, data.receiverId].sort().join("_");
      await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .add(message);

      // Send to receiver if online
      const receiverSocketId = userSockets[data.receiverId];
      if (receiverSocketId) {
        socketIO.to(receiverSocketId).emit("privateMessageResponse", message);
      }

      // Confirm to sender
      socket.emit("messageConfirm", { messageId: message.id, status: "sent" });
    } catch (err) {
      console.error("Error in privateMessage:", err);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  // Get private chat history
  socket.on("getPrivateChatHistory", async (data) => {
    try {
      const chatId = [data.userId, data.otherUserId].sort().join("_");
      const messages = [];

      const snapshot = await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();

      snapshot.forEach((doc) => {
        messages.unshift(doc.data());
      });

      socket.emit("privateChatHistory", {
        chatId,
        messages,
        otherUserId: data.otherUserId,
        otherUserName: data.otherUserName,
      });
    } catch (err) {
      console.error("Error fetching chat history:", err);
      socket.emit("chatHistoryError", { error: "Failed to load chat history" });
    }
  });

  // Group message
  socket.on("groupMessage", async (data) => {
    try {
      const message = {
        id: `${socket.id}${Math.random()}`,
        groupId: data.groupId,
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text,
        timestamp: new Date().toISOString(),
        type: "group",
      };

      // Save to Firebase
      await db
        .collection("groups")
        .doc(data.groupId)
        .collection("messages")
        .add(message);

      // Broadcast to all members in the group room
      socketIO
        .to(`group_${data.groupId}`)
        .emit("groupMessageResponse", message);
    } catch (err) {
      console.error("Error in groupMessage:", err);
      socket.emit("messageError", { error: "Failed to send group message" });
    }
  });

  // Join group
  socket.on("joinGroup", async (data) => {
    try {
      const groupRoomId = `group_${data.groupId}`;
      socket.join(groupRoomId);

      // Track user in group
      if (!rooms[groupRoomId]) {
        rooms[groupRoomId] = [];
      }
      rooms[groupRoomId].push({
        userId: data.userId,
        userName: data.userName,
        socketId: socket.id,
      });

      // Notify group members
      socketIO.to(groupRoomId).emit("userJoinedGroup", {
        groupId: data.groupId,
        userId: data.userId,
        userName: data.userName,
        members: rooms[groupRoomId],
      });

      // Send group history to user
      const messages = [];
      const snapshot = await db
        .collection("groups")
        .doc(data.groupId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();

      snapshot.forEach((doc) => {
        messages.unshift(doc.data());
      });

      socket.emit("groupChatHistory", {
        groupId: data.groupId,
        messages,
        members: rooms[groupRoomId],
      });
    } catch (err) {
      console.error("Error joining group:", err);
      socket.emit("groupError", { error: "Failed to join group" });
    }
  });

  // Leave group
  socket.on("leaveGroup", (data) => {
    try {
      const groupRoomId = `group_${data.groupId}`;
      socket.leave(groupRoomId);

      if (rooms[groupRoomId]) {
        rooms[groupRoomId] = rooms[groupRoomId].filter(
          (m) => m.socketId !== socket.id,
        );
        if (rooms[groupRoomId].length === 0) {
          delete rooms[groupRoomId];
        }
      }

      socketIO.to(groupRoomId).emit("userLeftGroup", {
        groupId: data.groupId,
        userId: data.userId,
        userName: data.userName,
        members: rooms[groupRoomId] || [],
      });
    } catch (err) {
      console.error("Error leaving group:", err);
    }
  });

  // Typing indicator
  socket.on("typing", (data) => {
    if (data.type === "private") {
      const receiverSocketId = userSockets[data.receiverId];
      if (receiverSocketId) {
        socketIO.to(receiverSocketId).emit("userTyping", {
          userId: data.userId,
          userName: data.userName,
          type: "private",
        });
      }
    } else if (data.type === "group") {
      socketIO.to(`group_${data.groupId}`).emit("userTyping", {
        userId: data.userId,
        userName: data.userName,
        groupId: data.groupId,
        type: "group",
      });
    }
  });

  // Stop typing
  socket.on("stopTyping", (data) => {
    if (data.type === "private") {
      const receiverSocketId = userSockets[data.receiverId];
      if (receiverSocketId) {
        socketIO.to(receiverSocketId).emit("userStoppedTyping", {
          userId: data.userId,
          type: "private",
        });
      }
    } else if (data.type === "group") {
      socketIO.to(`group_${data.groupId}`).emit("userStoppedTyping", {
        userId: data.userId,
        groupId: data.groupId,
        type: "group",
      });
    }
  });

  // Get all online users
  socket.on("getOnlineUsers", () => {
    socket.emit("onlineUsers", users);
  });

  // User disconnects
  socket.on("disconnect", async () => {
    try {
      console.log("🔥: A user disconnected");

      // Find and remove user
      const user = users.find((u) => u.socketID === socket.id);
      if (user) {
        users = users.filter((u) => u.socketID !== socket.id);
        delete userSockets[user.userId];

        // Update user status in Firebase
        await db.collection("users").doc(user.userId).set(
          {
            status: "offline",
            lastSeen: new Date().toISOString(),
          },
          { merge: true },
        );

        // Remove from all group rooms
        for (const roomId in rooms) {
          rooms[roomId] = rooms[roomId].filter((m) => m.socketId !== socket.id);
          if (rooms[roomId].length === 0) {
            delete rooms[roomId];
          }
        }
      }

      socketIO.emit("newUserResponse", users);
    } catch (err) {
      console.error("Error in disconnect:", err);
    }
  });
});

// API Routes

// Get all groups
app.get("/api/groups", async (req, res) => {
  try {
    const snapshot = await db.collection("groups").get();
    const groups = [];
    snapshot.forEach((doc) => {
      groups.push({ id: doc.id, ...doc.data() });
    });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new group
app.post("/api/groups", async (req, res) => {
  try {
    const { groupName, description, creatorId, creatorName, members } =
      req.body;

    const groupData = {
      groupName,
      description,
      creatorId,
      creatorName,
      members: [{ userId: creatorId, userName: creatorName }, ...members],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("groups").add(groupData);
    res.json({ id: docRef.id, ...groupData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get group details
app.get("/api/groups/:groupId", async (req, res) => {
  try {
    const doc = await db.collection("groups").doc(req.params.groupId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add member to group
app.post("/api/groups/:groupId/members", async (req, res) => {
  try {
    const { userId, userName } = req.body;
    const groupRef = db.collection("groups").doc(req.params.groupId);

    await groupRef.update({
      members: admin.firestore.FieldValue.arrayUnion({ userId, userName }),
      updatedAt: new Date().toISOString(),
    });

    const doc = await groupRef.get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove member from group
app.delete("/api/groups/:groupId/members/:userId", async (req, res) => {
  try {
    const groupRef = db.collection("groups").doc(req.params.groupId);
    const doc = await groupRef.get();
    const members = doc
      .data()
      .members.filter((m) => m.userId !== req.params.userId);

    await groupRef.update({
      members,
      updatedAt: new Date().toISOString(),
    });

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.post("/api", (req, res) => {
  res.json({
    message: "Chatsy Server Running",
    users: users.length,
    timestamp: new Date().toISOString(),
  });
});

http.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
