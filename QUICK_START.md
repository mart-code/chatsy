# Chatsy - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Server

```bash
cd server
npm install
npm start
```

✅ Server should be running on `http://localhost:4000`

### Step 2: Start the Client (new terminal)

```bash
cd client
npm install
npm run dev
```

✅ Client will be running on `http://localhost:5173` (or similar)

### Step 3: Open in Browser

Navigate to `http://localhost:5173` and sign in with your Firebase credentials.

---

## 📝 Using the Chat Application

### Private Chats

1. Click on **Private Chat** in the left sidebar
2. Select a user from the "Active Users" list
3. Type your message and hit Send
4. Messages appear in real-time!

**Features:**

- 📍 See all online users
- 🔍 Search users by name
- ⏱️ See typing indicators
- 💾 Messages are saved automatically
- ⏰ Timestamps on all messages

### Group Chats

1. Click on **Groups** in the left sidebar
2. Click **+ New Group** to create one
3. Enter group name and optional description
4. Click Create
5. Start messaging with the group!

**Features:**

- 👥 Add multiple members
- 💬 Real-time group messaging
- 🔔 See who joins/leaves
- ⏱️ Typing indicators for all members
- 💾 Full message history

---

## 🔧 Troubleshooting

### "Cannot connect to server"

- Make sure server is running on port 4000
- Check terminal for error messages
- Restart both server and client

### "Messages not sending"

- Verify you're logged in with Firebase
- Check browser console for errors (F12)
- Ensure socket connection is established

### "Can't see other users"

- Make sure other users are logged in
- Both users need to be on same app instance
- Check server is running

### "Firebase errors"

- Verify Firebase config in `config/firebase-config.js`
- Check service account key in server
- Ensure Firestore is enabled in Firebase console

---

## 🎯 Key Shortcuts

| Action                   | Shortcut                  |
| ------------------------ | ------------------------- |
| Send Message             | Enter key                 |
| Search Users             | Ctrl+F                    |
| Toggle Dark Mode         | (Click theme icon in nav) |
| Navigate to Private Chat | Click 💬 icon             |
| Navigate to Groups       | Click 👥 icon             |

---

## 📦 Project Files to Know

**Frontend:**

- `src/App.jsx` - Main component with routing
- `src/pages/ChatPage.jsx` - Private chat interface
- `src/pages/GroupPage.jsx` - Group chat interface
- `context/ChatContext.jsx` - Chat state management
- `src/utils/socketUtils.js` - Socket event handlers

**Backend:**

- `server/index.js` - Main server with Socket.io
- All endpoints handle private/group messaging
- Firebase stores all chat history

---

## 🎨 Customization

### Change Server Port

Edit `server/index.js` and change:

```javascript
const PORT = process.env.PORT || 4000;
```

### Change Client URL

Edit `client/src/App.jsx`:

```javascript
const socket = socketIO.connect("http://your-server:4000");
```

### Theme Colors

Edit Tailwind classes in components:

- Primary: `from-blue-500 to-blue-600`
- Secondary: `bg-gray-800` (dark mode)

---

## 🔐 Security Notes

- Never expose Firebase credentials
- Keep service account key secure
- Use environment variables for config
- Validate all user inputs
- Enable Firebase Security Rules

---

## 📊 Architecture Overview

```
┌─────────────┐
│   Client    │
│ (React App) │
└──────┬──────┘
       │
       │ WebSocket (Socket.io)
       │
┌──────▼──────┐
│   Server    │
│ (Node.js)   │
└──────┬──────┘
       │
       │ REST API
       │
┌──────▼──────────┐
│  Firebase       │
│  (Auth & DB)    │
└─────────────────┘
```

---

## 📚 Learn More

- [Socket.io Documentation](https://socket.io/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com/)

---

## 💡 Pro Tips

1. **Use Incognito/Private windows** to test with multiple users simultaneously
2. **Open DevTools** (F12) to see real-time socket events
3. **Check Server Terminal** for detailed logs and errors
4. **Test Typing Indicators** by typing slowly in one window, watching in another
5. **Monitor Firebase** in console to see messages being saved

---

## 🐛 Report Issues

If you encounter issues:

1. Check console logs (F12 in browser)
2. Check server terminal output
3. Look at SETUP_GUIDE.md for detailed troubleshooting
4. Verify all dependencies are installed
5. Ensure Firebase is properly configured

---

**Happy Chatting! 🎉**
