# Chatsy - Real-time Chat Application

A full-featured real-time chat application with private messaging and group chats built with React, Node.js, Socket.io, and Firebase.

## Features

### 🔐 Authentication

- Firebase Authentication with email/password
- Secure user sessions
- Protected routes with PrivateRoute component

### 💬 Private Chats

- One-to-one real-time messaging
- Message history stored in Firebase
- Online user list
- Typing indicators
- User search functionality
- Message timestamps

### 👥 Group Chats

- Create and manage groups
- Real-time group messaging
- Group member management
- Join/leave group functionality
- Group chat history
- Multiple concurrent group participation

### 🎨 User Interface

- Dark mode / Light mode toggle
- Responsive design
- Smooth animations and transitions
- Intuitive navigation

### 🔔 Real-time Features

- Real-time message delivery via Socket.io
- Live typing indicators
- Online/offline status
- User presence awareness

## Project Structure

```
Chatsy/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── ChatBar.jsx        # Private chat user list
│   │   │   ├── ChatBody.jsx       # Message display area
│   │   │   ├── ChatFooter.jsx     # Message input
│   │   │   ├── GroupBar.jsx       # Group list
│   │   │   └── Navbar.jsx         # Main navigation
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx       # Private chat page
│   │   │   ├── GroupPage.jsx      # Group chat page
│   │   │   ├── Signin.jsx         # Login page
│   │   │   └── Profile.jsx        # User profile
│   │   ├── utils/
│   │   │   ├── socketUtils.js     # Socket.io event handlers
│   │   │   └── apiUtils.js        # API utilities
│   │   └── App.jsx                # Main app component
│   ├── context/
│   │   ├── ChatContext.jsx        # Chat state management
│   │   ├── AuthContext.jsx        # Authentication state
│   │   ├── ThemeContext.jsx       # Theme management
│   │   └── PrivateRoute.jsx       # Route protection
│   ├── config/
│   │   └── firebase-config.js     # Firebase configuration
│   └── package.json
│
└── server/                          # Node.js backend
    ├── index.js                    # Main server file
    ├── firebase/
    │   ├── firebase.js            # Firebase admin setup
    │   └── firebaseAccountKey.json # Service account key
    ├── package.json
    └── .env.example               # Environment variables template
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with authentication enabled
- Firebase service account key

### Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Set the `FIREBASE_ACCOUNT_URL` to your Firebase service account key path
   - Set `PORT` (default: 4000)

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Update `config/firebase-config.js` with your Firebase credentials

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The client will typically run on `http://localhost:5173`

## Socket.io Events

### Connection Events

- `newUser` - Register a new user
- `disconnect` - Handle user disconnection

### Private Message Events

- `privateMessage` - Send a private message
- `privateMessageResponse` - Receive a private message
- `getPrivateChatHistory` - Request chat history
- `privateChatHistory` - Receive chat history

### Group Events

- `joinGroup` - Join a group
- `leaveGroup` - Leave a group
- `groupMessage` - Send a group message
- `groupMessageResponse` - Receive a group message
- `userJoinedGroup` - Notification when user joins
- `userLeftGroup` - Notification when user leaves
- `groupChatHistory` - Receive group message history

### Typing Indicators

- `typing` - Send typing indicator
- `userTyping` - Receive typing indicator
- `stopTyping` - Stop typing indicator
- `userStoppedTyping` - Receive stop typing

## API Endpoints

### Groups Management

- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/:groupId` - Get group details
- `POST /api/groups/:groupId/members` - Add member to group
- `DELETE /api/groups/:groupId/members/:userId` - Remove member from group

### Health Check

- `POST /api` - Server health check

## Firebase Structure

### Collections

#### `users`

```json
{
  "userId": "string",
  "userName": "string",
  "email": "string",
  "status": "online|offline",
  "lastSeen": "ISO timestamp"
}
```

#### `chats`

Subcollection `messages`:

```json
{
  "id": "string",
  "senderId": "string",
  "senderName": "string",
  "receiverId": "string",
  "text": "string",
  "timestamp": "ISO timestamp",
  "type": "private"
}
```

#### `groups`

```json
{
  "groupName": "string",
  "description": "string",
  "creatorId": "string",
  "creatorName": "string",
  "members": [
    {
      "userId": "string",
      "userName": "string"
    }
  ],
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

Subcollection `messages`:

```json
{
  "id": "string",
  "groupId": "string",
  "senderId": "string",
  "senderName": "string",
  "text": "string",
  "timestamp": "ISO timestamp",
  "type": "group"
}
```

## Key Features Implementation

### State Management

Uses React Context API with `ChatContext` for managing:

- Current active chat
- Messages
- Groups
- Typing users
- Online users
- Message caching

### Real-time Communication

Socket.io handles:

- Room-based group messaging
- Direct one-to-one messaging
- Typing indicators
- User presence
- Automatic reconnection

### Persistence

Firebase Firestore stores:

- All messages (private and group)
- User profiles and status
- Group information and members
- Message history (up to 50 most recent)

## Usage

### Starting a Private Chat

1. Go to "Private Chat" section
2. Select a user from the active users list
3. Start typing and sending messages
4. Messages are synced in real-time and stored

### Creating a Group

1. Go to "Groups" section
2. Click "+ New Group"
3. Enter group name and description
4. Group is created and you become the creator
5. Other users can join by selecting the group

### Joining/Leaving Groups

- Click on a group to join and view messages
- When navigating away, you automatically leave the group
- Join/leave events are broadcast to all group members

## Troubleshooting

### Socket Connection Issues

- Ensure server is running on port 4000
- Check CORS configuration allows frontend origin
- Verify firewall settings

### Firebase Connection Issues

- Validate Firebase service account key path
- Check Firebase project has Firestore enabled
- Ensure authentication is properly configured

### Message Not Sending

- Verify user is authenticated
- Check socket is connected
- Look for error messages in console
- Ensure Firebase has write permissions

### Group Messages Not Appearing

- Confirm you've joined the group
- Check group permissions in Firebase
- Verify socket is connected to correct room
- Look for socket errors in server logs

## Development Tips

### Hot Module Replacement

The client uses Vite with HMR enabled for instant updates during development.

### Server Auto-reload

Nodemon watches server files and automatically restarts on changes.

### Console Logging

Both client and server have console logging for debugging:

- Client: Open browser DevTools
- Server: Check terminal output

### Socket.io Debugging

Enable debug logging:

```javascript
// Client
import io from "socket.io-client";
io.on("*", (event, ...args) => console.log(event, args));

// Server
const socketIO = require("socket.io")(http, {
  transports: ["websocket"],
  debug: true,
});
```

## Performance Optimizations

- Message caching to reduce Firebase queries
- Efficient state updates using useCallback
- Lazy loading of chat history
- Room-based broadcasting for group messages
- Connection pooling for database

## Security Considerations

- Firebase security rules should be properly configured
- User authentication required for all operations
- CORS properly configured for production
- Socket.io events validated on server
- User IDs verified before operations

## Future Enhancements

- [ ] File/image sharing
- [ ] Message reactions (emojis)
- [ ] Edit/delete messages
- [ ] Message search
- [ ] User mentions
- [ ] Read receipts
- [ ] Voice/video calls
- [ ] Message encryption
- [ ] Admin controls for groups
- [ ] User blocking/muting
- [ ] Notifications

## License

MIT

## Support

For issues or questions, please refer to the troubleshooting section or check the console logs for detailed error messages.
