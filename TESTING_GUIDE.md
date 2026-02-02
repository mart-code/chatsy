# 🧪 Chatsy - Testing Guide

## Pre-Testing Setup

### Ensure Everything is Running

```bash
# Terminal 1: Server
cd server
npm start
# Should see: ✅ Server listening on port 4000

# Terminal 2: Client
cd client
npm run dev
# Should see: Local: http://localhost:5173
```

### Prepare Test Users

1. Create at least 2 Firebase user accounts
2. Note their email addresses
3. Have them ready for login

---

## 🧑 Single User Testing

### Test 1: Authentication

**Steps:**

1. Open browser to `http://localhost:5173`
2. You should see Signin page
3. Click on "Create an account"
4. Enter email and password
5. Click Create Account / Sign Up

**Expected Results:**

- ✅ Account created successfully
- ✅ Redirected to chat page
- ✅ Navbar shows all icons
- ✅ See "Select a chat" message

**Troubleshooting:**

- If error: Check Firebase configuration
- If stuck: Check browser console (F12)

---

### Test 2: Dark Mode

**Steps:**

1. Click moon icon in bottom of Navbar
2. Page should turn dark
3. Click again to toggle back

**Expected Results:**

- ✅ Dark mode applied to all pages
- ✅ Text remains readable
- ✅ Smooth color transition
- ✅ Toggle works consistently

---

### Test 3: Navigation

**Steps:**

1. In Navbar, click 💬 (Private Chat)
2. Should show ChatBar with users
3. Click 👥 (Groups)
4. Should show GroupBar with groups
5. Click 📋 (Profile)
6. Should show profile page

**Expected Results:**

- ✅ All pages load
- ✅ Navbar icon highlights active page
- ✅ Layout changes appropriately

---

## 👥 Two User Testing

### Setup

**Use 2 Browsers/Windows:**

- Browser 1: Logged in as User A
- Browser 2: Logged in as User B

**Tip:** Use Incognito windows for different profiles

---

### Test 4: Private Chat - Send Message

**Steps (User A):**

1. Go to Private Chat
2. In ChatBar, click on User B
3. Type message: "Hello from User A"
4. Press Enter or click Send

**Expected Results (User A):**

- ✅ Message appears on right side
- ✅ Shows "You" as sender
- ✅ Timestamp appears
- ✅ Chat history saved

**Expected Results (User B):**

- ✅ Message appears on left side
- ✅ Shows "User A" as sender
- ✅ Message appears in real-time
- ✅ Can reply

---

### Test 5: Private Chat - Reply

**Steps (User B):**

1. User B should see message from User A
2. Type reply: "Hello from User B"
3. Press Enter

**Expected Results (User A):**

- ✅ See User B's message on left
- ✅ Conversation flows naturally
- ✅ Both users see same conversation

**Expected Results (User B):**

- ✅ Message appears on right
- ✅ Message sent successfully

---

### Test 6: Chat History

**Steps (User A):**

1. Click on another user
2. Then click back on User B
3. Previous conversation should load

**Expected Results:**

- ✅ Old messages appear
- ✅ Conversation history complete
- ✅ Timestamps preserved
- ✅ Correct order (oldest first)

---

### Test 7: Typing Indicator

**Steps (User A):**

1. Start typing but don't send
2. Watch Browser B

**Expected Results (User B):**

- ✅ See "User A is typing..." with dots
- ✅ Dots animate
- ✅ After 3 seconds of no typing, message disappears

**Expected Results (User A):**

- ✅ Typing dots only show to User B
- ✅ Not visible to sender

---

### Test 8: Online Users

**Steps:**

1. Open Browser C (User C account)
2. User C logs in
3. Look at Browser A and B

**Expected Results:**

- ✅ User C appears in user list
- ✅ Green dot shows online status
- ✅ All 3 users can see each other

**Steps:**

1. Close Browser C

**Expected Results:**

- ✅ User C disappears from user lists
- ✅ Updates in both Browser A and B

---

### Test 9: User Search

**Steps (User A):**

1. In ChatBar, type in search box
2. Type partial name like "B"
3. List should filter

**Expected Results:**

- ✅ Only users matching search appear
- ✅ Case insensitive
- ✅ Clear search to see all

---

## 👫 Group Testing

### Test 10: Create Group

**Steps (User A):**

1. Go to Groups page
2. Click "+ New Group"
3. Enter: Group Name: "Test Group"
4. Enter: Description: "Testing group chat"
5. Click Create

**Expected Results (User A):**

- ✅ Modal closes
- ✅ Group appears in GroupBar
- ✅ Group is automatically selected
- ✅ Joins group automatically

**Expected Results (User B):**

- ✅ See "Test Group" in their GroupBar
- ✅ Can click to join

---

### Test 11: Join Group

**Steps (User B):**

1. Go to Groups page
2. Click on "Test Group"

**Expected Results (User B):**

- ✅ Group selected (highlighted)
- ✅ Chat history loads
- ✅ Ready to message

**Expected Results (User A):**

- ✅ See notification "User B joined Test Group"
- ✅ User B appears in member list

---

### Test 12: Group Messages

**Steps (User A):**

1. Type message: "Group test from A"
2. Send

**Expected Results (User A):**

- ✅ Message appears on right
- ✅ Sent to group

**Expected Results (User B):**

- ✅ Message appears on left immediately
- ✅ Shows "User A" as sender
- ✅ Timestamp present

---

### Test 13: Group Typing Indicator

**Steps (User A):**

1. Start typing in group (don't send)
2. Watch User B

**Expected Results (User B):**

- ✅ See "User A is typing..."
- ✅ After 3 seconds, disappears

---

### Test 14: Group Search

**Steps:**

1. In GroupBar, search box
2. Type to filter groups

**Expected Results:**

- ✅ Groups filter by name
- ✅ Case insensitive
- ✅ Works as expected

---

### Test 15: Leave Group

**Steps (User B):**

1. Go to Private Chat
2. Return to Groups

**Expected Results (User B):**

- ✅ No longer in group room

**Expected Results (User A):**

- ✅ Notification: "User B left Test Group"

---

## 🔄 Edge Cases & Error Handling

### Test 16: Empty Message

**Steps:**

1. Click Send with empty input

**Expected Results:**

- ✅ Send button disabled
- ✅ Message not sent
- ✅ No error message needed

---

### Test 17: Disconnect/Reconnect

**Steps:**

1. Disconnect internet on User A (or close browser)
2. Wait 3-5 seconds
3. Reconnect

**Expected Results:**

- ✅ User A disappears from User B's list
- ✅ Message "User A disconnected" (implicit)
- ✅ When User A reconnects, appears in list
- ✅ Socket reconnects automatically

---

### Test 18: Rapid Messages

**Steps:**

1. User A sends multiple messages quickly
2. User B sends messages while A is typing

**Expected Results:**

- ✅ All messages delivered
- ✅ Correct order maintained
- ✅ No messages lost
- ✅ Timestamps accurate

---

### Test 19: Long Message

**Steps:**

1. Copy a long paragraph
2. Paste in message box
3. Send

**Expected Results:**

- ✅ Message wraps correctly
- ✅ Sent successfully
- ✅ Displays properly
- ✅ No overflow issues

---

### Test 20: Special Characters

**Steps:**

1. Send messages with: 😀 emoji
2. Send: !@#$%^&\*()
3. Send: "quotes" and 'apostrophes'

**Expected Results:**

- ✅ All special characters display
- ✅ Emojis render correctly
- ✅ No encoding issues

---

## 📱 Responsive Design Testing

### Test 21: Mobile View

**Steps:**

1. Open DevTools (F12)
2. Click responsive design mode
3. Select iPhone 12 Pro
4. Test UI

**Expected Results:**

- ✅ Layout reflows
- ✅ ChatBar readable
- ✅ ChatBody messages visible
- ✅ ChatFooter input accessible
- ✅ Navbar navigation works
- ✅ No horizontal scroll

---

### Test 22: Tablet View

**Steps:**

1. Select iPad Pro
2. Test UI

**Expected Results:**

- ✅ Layout adapts
- ✅ Sidebar visible
- ✅ Messages display well
- ✅ Touch targets adequate

---

## ⚡ Performance Testing

### Test 23: Multiple Messages

**Steps:**

1. Send 50+ messages rapidly
2. Load chat history multiple times

**Expected Results:**

- ✅ No lag or stuttering
- ✅ Scrolling smooth
- ✅ UI responsive
- ✅ Memory usage reasonable

---

### Test 24: Large Groups

**Steps:**

1. Create multiple groups
2. Join several groups
3. Switch between quickly

**Expected Results:**

- ✅ Switches instantly
- ✅ Messages load quickly
- ✅ No delays

---

## 🔐 Security Testing

### Test 25: Unauthenticated Access

**Steps:**

1. Delete localStorage
2. Try accessing /private-chat
3. Try accessing /groups

**Expected Results:**

- ✅ Redirected to signin
- ✅ Cannot access protected pages

---

### Test 26: Message Privacy

**Steps:**

1. User A sends private message to User B
2. User C tries to see the conversation

**Expected Results:**

- ✅ User C cannot see private message
- ✅ Only recipients can view
- ✅ Messages not broadcast

---

## 📊 Data Persistence Testing

### Test 27: Message Persistence

**Steps:**

1. User A and B chat
2. Refresh page
3. Go back to chat

**Expected Results:**

- ✅ Old messages still there
- ✅ Chat history complete
- ✅ Timestamps preserved

---

### Test 28: Group Persistence

**Steps:**

1. Create group
2. Refresh page
3. Go to Groups

**Expected Results:**

- ✅ Group still exists
- ✅ Can rejoin group
- ✅ Messages still there

---

## ✅ Final Verification Checklist

### Functionality

- [ ] Private messages send/receive
- [ ] Group messages send/receive
- [ ] Message history loads
- [ ] Typing indicators work
- [ ] Users appear/disappear
- [ ] Groups can be created
- [ ] Can join/leave groups
- [ ] Dark mode toggles

### UI/UX

- [ ] All pages load
- [ ] Navigation works
- [ ] Responsive on mobile
- [ ] No layout breaks
- [ ] Smooth animations
- [ ] Clear error messages
- [ ] "Select chat" message shown

### Performance

- [ ] No lag with messages
- [ ] Switches instant
- [ ] Scrolling smooth
- [ ] Loading responsive

### Data

- [ ] Messages saved
- [ ] History persists
- [ ] Timestamps correct
- [ ] Conversations separate

### Real-time

- [ ] Messages instant
- [ ] Status updates live
- [ ] Typing indicators responsive
- [ ] Socket reconnects

---

## 🐛 Debugging Tips

### Browser Console (F12)

```javascript
// Watch socket events
console.log("Check Network tab -> WS");

// Check messages
console.log("Check Application -> localStorage");

// View state
// Add breakpoints in DevTools
```

### Server Terminal

```bash
# Should see connection logs
⚡: socket-id user just connected!

# Should see message logs
# [timestamp] Message received...
```

### Firebase Console

```
1. Go to firestore.firebase.google.com
2. Select project
3. View 'users' collection
4. View 'chats' collection
5. View 'groups' collection
```

---

## 📈 Test Coverage Summary

| Area           | Tests  | Status |
| -------------- | ------ | ------ |
| Authentication | 1      | ✅     |
| UI/UX          | 2      | ✅     |
| Private Chat   | 5      | ✅     |
| Group Chat     | 5      | ✅     |
| Edge Cases     | 5      | ✅     |
| Responsive     | 2      | ✅     |
| Performance    | 2      | ✅     |
| Security       | 2      | ✅     |
| Data           | 2      | ✅     |
| **Total**      | **26** | **✅** |

---

## 🎯 Testing Scenarios by Role

### Product Manager

- [ ] Can create and manage groups
- [ ] Users appear online instantly
- [ ] Messages deliver reliably
- [ ] UI is intuitive

### Developer

- [ ] Socket events working
- [ ] Firebase data correct
- [ ] No console errors
- [ ] Performance acceptable

### QA Tester

- [ ] All features work
- [ ] Edge cases handled
- [ ] Error messages clear
- [ ] Responsive design

---

## 🎉 Success Criteria

✅ **All tests pass** = Application Ready for Use
✅ **No console errors** = Code quality good
✅ **Messages instant** = Real-time working
✅ **All devices** = Responsive confirmed

---

**Happy Testing! 🚀**
