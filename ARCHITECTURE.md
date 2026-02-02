# Chatsy - Architecture & Flow Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CHATSY APPLICATION                           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐    ┌────▼────┐    ┌────▼─────┐
              │   React   │    │ Socket  │    │ Firebase │
              │  Frontend │◄──►│   .io   │◄──►│  Backend │
              │  (Client) │    │ (Real   │    │          │
              └───────────┘    │  time)  │    └──────────┘
                               └────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼────┐   ┌─────▼────┐   ┌───▼──────┐
              │ Express  │   │ Firestore│   │   Auth   │
              │  Server  │   │Database  │   │          │
              │(Node.js) │   │(Firestore)   │          │
              └──────────┘   └──────────┘   └──────────┘
```

---

## 📊 Data Flow Diagram

### Private Message Flow

```
User A                          Socket Server                    Firebase
  │                                  │                               │
  ├─ Send Message ──────────────────►│                               │
  │                                  ├─ Validate ─────────────────────┤
  │                                  ├──────────── Store Message ────►│
  │                                  │                               │
  │                                  ├─ Find User B Socket ─────────────┤
  │                                  ├─ Send Message ────────────┐     │
  │                                  │                           │     │
  │                                  │                         User B
  │                                  │                           │
  │                          ◄─ Message Confirmation ────────────┘
  │
  └─ Display Message
```

### Group Message Flow

```
User A                          Socket Server                    Firebase
  │                                  │                               │
  ├─ Send Group Msg ─────────────────►│                               │
  │                                  ├─ Validate ─────────────────────┤
  │                                  ├──────────── Store Message ────►│
  │                                  │                               │
  │                                  ├─ Broadcast to Room ──────┐
  │                                  │                          │
  │         ┌────────────────────────┼──────────────────┐       │
  │         │                        │                  │       │
  │       User B                    User C            User D   │
  │         │                        │                  │       │
  │         └────────────────────────┼──────────────────┘       │
  │                                  │                          │
  │                                  ├─ Confirmation ────────────┘
  │
  └─ Display Message
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────┐
│         ChatContext                 │
│  ┌─────────────────────────────────┐│
│  │ • currentChat                   ││
│  │ • messages[]                    ││
│  │ • groups[]                      ││
│  │ • typingUsers{}                 ││
│  │ • onlineUsers[]                 ││
│  │ • chatHistory{}                 ││
│  └─────────────────────────────────┘│
└──────────────────┬──────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼─────┐         ┌─────▼────┐
   │ChatPage  │         │GroupPage │
   │          │         │          │
   │Uses      │         │Uses      │
   │Context   │         │Context   │
   │States    │         │States    │
   └──────────┘         └──────────┘
```

---

## 🔌 Socket.io Event Lifecycle

### Connection

```
Client                  Socket Server              Firebase
  │                          │                        │
  ├─ Connect ────────────────►│                        │
  │                          │                        │
  ├─ Emit 'newUser' ─────────►│                        │
  │                          ├─ Register User ───────►│
  │                          │                        │
  │                ◄─ 'newUserResponse' with all users
  │
  └─ Update Online Users List
```

### Message Exchange

```
Sender                  Socket Server              Firebase
  │                          │                        │
  ├─ Emit Message Event ─────►│                        │
  │                          ├─ Store Message ───────►│
  │                          │                        │
  │                          ├─ Emit 'Response' ──────┐
  │                          │                        │
  │                     ◄─────┴─ To Receiver          │
  │                          │
  │         ◄─ 'messageConfirm' ──┘
  │
  └─ Add to messages[]
```

### Typing Indicator

```
User Typing          Socket Server        Other Users
      │                   │                    │
      ├─ Emit 'typing' ──►│                    │
      │                  ├─ Broadcast ───────►│
      │                  │                    │
      │                  │              Display dots
      │                  │                    │
      ├─ Stop 'typing' ─►│                    │
      │                  ├─ Broadcast ───────►│
      │                  │                    │
      │                  │              Remove dots
```

---

## 📱 Component Hierarchy

```
App
├── ChatProvider
│   ├── AuthProvider
│   │   ├── ThemeProvider
│   │   │   └── BrowserRouter
│   │   │       ├── Routes
│   │   │       │   ├── Signin (/)
│   │   │       │   ├── PrivateRoute
│   │   │       │   │   ├── ChatPage
│   │   │       │   │   │   ├── Navbar
│   │   │       │   │   │   ├── ChatBar
│   │   │       │   │   │   │   └── User List
│   │   │       │   │   │   ├── ChatBody
│   │   │       │   │   │   │   └── Messages
│   │   │       │   │   │   └── ChatFooter
│   │   │       │   │   │       └── Message Input
│   │   │       │   │   ├── GroupPage
│   │   │       │   │   │   ├── Navbar
│   │   │       │   │   │   ├── GroupBar
│   │   │       │   │   │   │   └── Group List
│   │   │       │   │   │   ├── ChatBody
│   │   │       │   │   │   │   └── Messages
│   │   │       │   │   │   └── ChatFooter
│   │   │       │   │   │       └── Message Input
│   │   │       │   │   └── Profile
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────┐
│         User Authentication              │
└──────────────────────────────────────────┘
              │
         Sign In
              │
       ┌──────▼──────┐
       │ Firebase    │
       │ Auth Service│
       └──────┬──────┘
              │
         Validate
              │
       ┌──────▼──────────┐
       │  Auth Success   │
       └──────┬──────────┘
              │
       Update AuthContext
              │
       ┌──────▼──────────────────────┐
       │ Can Access Private Routes   │
       │ • ChatPage                  │
       │ • GroupPage                 │
       │ • Profile                   │
       └─────────────────────────────┘
```

---

## 💾 Firebase Data Structure

```
root
├── users/
│   ├── uid1/
│   │   ├── userId
│   │   ├── userName
│   │   ├── email
│   │   ├── status
│   │   └── lastSeen
│   └── uid2/
│       └── (same structure)
│
├── chats/
│   ├── uid1_uid2/
│   │   └── messages/
│   │       ├── msg1
│   │       │   ├── id
│   │       │   ├── senderId
│   │       │   ├── senderName
│   │       │   ├── text
│   │       │   └── timestamp
│   │       └── msg2
│   │           └── (same structure)
│   └── uid1_uid3/
│       └── messages/
│
└── groups/
    ├── groupId1/
    │   ├── groupName
    │   ├── description
    │   ├── creatorId
    │   ├── members[]
    │   ├── createdAt
    │   └── messages/
    │       ├── msg1
    │       │   ├── id
    │       │   ├── groupId
    │       │   ├── senderId
    │       │   ├── senderName
    │       │   ├── text
    │       │   └── timestamp
    │       └── msg2
    │           └── (same structure)
    └── groupId2/
        └── (same structure)
```

---

## 🔄 Real-time Message Update Cycle

```
Step 1: Send Message
├─ User types message in ChatFooter
├─ Click Send button
├─ Message data collected (senderId, text, etc.)
└─ Emit socket event

Step 2: Server Processing
├─ Server receives socket event
├─ Validate message data
├─ Store in Firebase Firestore
├─ Create message object with timestamp
└─ Route to recipient/group

Step 3: Message Reception
├─ Recipient receives socket event
├─ Add to messages array in ChatContext
├─ Render in ChatBody component
└─ Scroll to bottom

Step 4: UI Update
├─ Message appears in chat
├─ Shows sender name and time
├─ Both users see same message
└─ Ready for next message
```

---

## 🎯 User Actions & Their Flow

### Action: Send Private Message

```
1. Select user from ChatBar
   ↓
2. ChatPage updates currentChat
   ↓
3. Chat history loads from Firebase
   ↓
4. User types message
   ↓
5. Click Send / Press Enter
   ↓
6. sendPrivateMessage() emits event
   ↓
7. Server stores in Firestore
   ↓
8. Server emits to recipient
   ↓
9. Both clients update state
   ↓
10. Messages displayed in ChatBody
```

### Action: Create & Join Group

```
1. Click "+ New Group"
   ↓
2. Modal appears for input
   ↓
3. Enter name & description
   ↓
4. Click Create
   ↓
5. API POST request to /api/groups
   ↓
6. Server creates group in Firebase
   ↓
7. Return group data
   ↓
8. Update groups state
   ↓
9. Automatically join group
   ↓
10. joinGroup() emits socket event
    ↓
11. Server joins room
    ↓
12. Load group history
    ↓
13. Display in ChatBody
```

---

## 🔔 Notification System

```
User A sends message
    │
    ├─► Server receives
    │
    ├─► User B is online?
    │   ├─ YES: Send socket event
    │   │        ├─► User B receives instantly
    │   │        └─► Display in app
    │   │
    │   └─ NO: Message in Firestore
    │          └─ User B sees next login
    │
    └─► Firebase logs timestamp
        └─ Read receipts possible future
```

---

## 🎨 UI State Management

```
ChatContext {
  currentChat: {
    type: 'private' | 'group',
    id: 'uniqueId',
    name: 'Display Name'
  },
  messages: [{
    id: 'msgId',
    senderId: 'uid',
    senderName: 'Name',
    text: 'Message',
    timestamp: 'ISO8601'
  }],
  typingUsers: {
    'chatId': { userId, userName }
  },
  onlineUsers: [{
    userId: 'uid',
    userName: 'Name',
    email: 'email',
    status: 'online'
  }]
}
```

---

## 📈 Performance Optimization Paths

```
Initial Load
    ├─► Messages fetched from Firebase
    ├─► Cached in chatHistory
    └─► Re-renders skipped with useCallback

Message Send
    ├─► Optimistic UI update
    ├─► Server confirmation
    ├─► Final state update
    └─► No flashing/delays

Typing Indicators
    ├─► Debounced emission
    ├─► 3-second timeout
    └─► Prevents excessive updates

User Presence
    ├─► Update on connect/disconnect
    ├─► Cached online users
    └─► Efficient broadcasts
```

---

This architecture ensures:

- ✅ **Real-time Communication** via Socket.io
- ✅ **Data Persistence** via Firebase
- ✅ **State Consistency** via React Context
- ✅ **Scalable Design** via room-based architecture
- ✅ **Performance** via caching and optimization
- ✅ **User Experience** via instant updates
