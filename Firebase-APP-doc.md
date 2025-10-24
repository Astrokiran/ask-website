Firebase Firestore Chat Migration - Implementation Plan
Document Information
Created: October 8, 2025
Last Updated: October 8, 2025
Version: 1.1
Status: ✅ Decisions Approved - Ready for Implementation
Estimated Duration: 27-36 development days (Aggressive 2-week rollout)


Executive Summary
This document outlines a comprehensive plan to migrate from Agora Chat SDK to a hybrid Agora RTC + Firebase Firestore architecture for chat consultations in both the Customer App (user-app) and Guide App (guide-app).
Current State
✅ Backend: Firestore collections auto-initialized on consultation acceptance
✅ Frontend: Agora Chat SDK fully implemented in both apps
✅ Infrastructure: Firebase config files present
✅ Message Flow: Working end-to-end with Agora Chat
✅ Local Persistence: User app has ChatMessageService for offline storage
Target State
🎯 Messages stored in Firebase Firestore (persistent, real-time sync)
🎯 Presence/typing indicators managed through Firestore
🎯 Images stored in Firebase Storage
🎯 Agora RTC used for crash detection and connection monitoring
🎯 Hybrid approach: Best of both platforms
Key Benefits
Persistent Chat History - Messages survive app crashes/reinstalls
Offline Support - Firebase caches messages locally
Real-time Sync - Instant message delivery across devices
Crash Detection - Agora RTC monitors connection health
Cost Efficiency - Leverages existing Agora RTC for presence


Key Decisions Summary
All critical decisions have been approved. Here's a quick reference:
Technical Decisions
Decision
Choice
Rationale
Fallback Strategy
Keep Agora Chat for 2-3 releases
Safety net during migration
Message History
Start fresh (no migration)
Simpler, faster, lower risk
Feature Flags
Firebase Remote Config
Dynamic control over rollout
ChatMessageService
Remove after migration
Firebase provides offline caching
Typing Debouncing
300ms
Balance responsiveness & efficiency

Architecture Decisions
Decision
Choice
Rationale
Service Structure
Multiple files
Separation of concerns
Service Pattern
Static methods
Simpler, no instance management
Real-time Updates
EventEmitter
Flexible event handling
Listener Lifecycle
Scoped cleanup
Return unsubscribe functions

Rollout Decisions
Decision
Choice
Rationale
Timeline
Aggressive (2 weeks)
Fast development prioritized
User Communication
No notification
Silent upgrade
Active Consultations
Let finish with Agora
Safest approach
Budget
No constraints
Optimal implementation
Performance Targets
Approved as-is
Targets are acceptable



Table of Contents
Key Decisions Summary
Current State Assessment
Implementation Phases
Risk Assessment
Resource Requirements
Open Questions (All Answered)
Success Metrics
Approval Checklist


Current State Assessment
What's Already in Place
Backend Infrastructure
Firestore collections automatically created on consultation acceptance
Collections structure:
/consultations/{id} - Consultation metadata
/consultations/{id}/participants/{userId} - Participant presence/typing
/consultations/{id}/messages/{msgId} - Messages (auto-created on first send)
Agora tokens provided in API responses:
guide_agora_chat_token / customer_agora_chat_token
guide_agora_call_token / customer_agora_call_token
guide_agora_rtm_token / customer_agora_rtm_token
Frontend Implementation
AgoraChatService - Fully functional in both apps
SDK: react-native-agora-chat
App Key: 611351937#1564412
Features: Text/image messages, history fetch, real-time listeners
ChatScreen - Complete UI in both apps
Real-time message display
Send text/image messages
Connection status indicators
ConsultationService - Manages consultation lifecycle
Request, join, complete, cancel consultations
Integrates with Agora Chat for chat mode
Local Persistence (User app only)
ChatMessageService stores messages locally
Consistent chat ID generation using customer_id + guide_id
Firebase Configuration
GoogleService-Info.plist (iOS) ✅
google-services.json (Android) ✅
Firebase already used for analytics and performance monitoring
What Needs to Change
Message Storage Layer
❌ Currently: Agora Chat SDK stores messages
✅ Target: Firebase Firestore stores messages
Impact: Complete rewrite of message persistence layer
Presence & Typing System
❌ Currently: Agora Chat handles presence/typing (not explicitly implemented)
✅ Target: Firebase Firestore tracks presence/typing
✅ Bonus: Agora RTC events sync to Firestore for crash detection
Impact: New presence management system
Image Storage
❌ Currently: Agora servers store images
✅ Target: Firebase Storage stores images
Impact: Update image upload/download logic
Service Architecture
❌ Currently: AgoraChatService handles everything
✅ Target: FirestoreChatService + AgoraChatService (or retire latter)
Impact: New service layer, potential removal of old code


Implementation Phases
Phase 1: Dependencies & Configuration (2-3 days)
User App (Customer App)
Dependencies:

Install Firebase packages:

yarn add @react-native-firebase/firestore @react-native-firebase/storage

Verify gradle configuration:

android/build.gradle - Check google-services classpath
android/app/build.gradle - Verify plugin applied

Verify iOS configuration:

Ensure GoogleService-Info.plist in correct location
Check Podfile for Firebase pods

Configuration:

Create services/firebase/config.ts:

Initialize Firestore instance
Initialize Storage instance
Configure offline persistence settings
Set cache size limits

Test Firebase initialization:

Add console logs
Verify no errors on app startup
Test basic Firestore read operation
Guide App
Same steps as User App:

Install dependencies
Verify configuration files
Create firebase config
Test initialization

Verification Checklist:

Both apps build successfully with new dependencies
No Firebase initialization errors in console
Firebase instances accessible in dev tools
Offline persistence enabled

Deliverables:

services/firebase/config.ts (both apps)
Updated package.json with new dependencies
Verified build configurations


Phase 2: Type Definitions & Service Architecture (2-3 days)
Create Type Definitions
File: types/firestore-chat.types.ts

Interfaces to Define:

Message Interface

id: string (Firestore doc ID)
senderId: string (customer_id or guide_id)
senderType: 'guide' | 'customer'
senderName: string
type: 'text' | 'image' | 'system'
content: string
imageUrl?: string (Firebase Storage URL)
timestamp: Date (Firestore Timestamp)
status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
isDeleted: boolean

Participant Interface

userId: string
userType: 'guide' | 'customer'
displayName: string
xAuthId: number
isOnline: boolean
isTyping: boolean
typingAt: Date | null
lastSeen: Date
unreadCount: number
connectionState?: string (from Agora RTC)
disconnectReason?: string
networkQuality?: number

ConsultationMetadata Interface

consultationId: string
guideId: string
customerId: string
guideName: string
customerName: string
status: 'active' | 'completed'
mode: 'chat' | 'voice' | 'video'
totalMessages: number
lastMessageAt: Date | null
startTime: Date
endTime: Date | null
Design Service Architecture
File: services/FirestoreChatService.ts

Class Structure:

FirestoreChatService (singleton)

├── Message Operations

│   ├── sendMessage()

│   ├── sendImageMessage()

│   ├── subscribeToMessages()

│   ├── fetchMessageHistory()

│   └── deleteMessage()

├── Presence Management

│   ├── updatePresence()

│   ├── subscribeToParticipant()

│   ├── updateTypingStatus()

│   └── subscribeToPresence()

├── Read Receipts

│   ├── markMessagesAsRead()

│   └── getUnreadCount()

└── Utilities

    ├── uploadImage()

    ├── deleteImage()

    └── cleanup()

Architecture Decisions (APPROVED):

✅ Service Structure: Multiple files (separate concerns: messages, presence, storage)
✅ Service Pattern: Static methods (simpler, no instance management)
✅ Real-time Updates: EventEmitter pattern for flexible event handling
✅ Listener Lifecycle: Scoped cleanup (return unsubscribe functions from hooks)

Deliverables:

types/firestore-chat.types.ts (both apps)
Service architecture document
Class structure diagram
Method signatures defined


Phase 3: FirestoreChatService Implementation (4-5 days)
Core Messaging Methods
1. sendMessage() - Send text messages

Requirements:

Write to /consultations/{id}/messages subcollection
Update consultation metadata (totalMessages, lastMessageAt)
Return message ID for optimistic UI updates
Handle network errors gracefully
Support retry logic

Pseudocode:

1. Validate inputs (consultationId, content, senderId)

2. Create message object with Firestore timestamp

3. Add message to messages subcollection

4. Update consultation document (increment totalMessages)

5. Return message reference ID

6. Handle errors (network, permissions, quota)

2. sendImageMessage() - Send image messages

Requirements:

Upload image to Firebase Storage first
Get download URL
Create message with image URL
Update consultation metadata
Show upload progress
Handle upload cancellation

Pseudocode:

1. Validate image URI

2. Generate unique filename (consultationId/senderId_timestamp)

3. Upload to Firebase Storage with progress callback

4. Get download URL

5. Create message with imageUrl field

6. Add to messages subcollection

7. Update consultation metadata

8. Return message ID

3. subscribeToMessages() - Real-time message listener

Requirements:

Set up Firestore onSnapshot listener
Order by timestamp (ascending or descending)
Initial fetch limit (50 messages)
Transform Firestore documents to Message objects
Handle listener errors
Return unsubscribe function

Pseudocode:

1. Create Firestore query (orderBy timestamp, limit 50)

2. Attach onSnapshot listener

3. On snapshot update:

   - Transform docs to Message objects

   - Convert Firestore timestamps to Date

   - Sort messages by timestamp

   - Call callback with messages array

4. On error:

   - Log error

   - Call callback with empty array

   - Optionally retry

5. Return unsubscribe function

4. fetchMessageHistory() - Pagination support

Requirements:

Load older messages with cursor-based pagination
Support infinite scroll
Merge with existing messages (no duplicates)
Handle offline cache
Performance optimization (limit queries)

Pseudocode:

1. Accept cursor parameter (last visible doc)

2. Create query with startAfter(cursor)

3. Fetch next batch (20 messages)

4. Transform documents to Message objects

5. Return messages array and new cursor

6. Handle end of messages (hasMore flag)
Presence Management Methods
5. updatePresence() - Update online/offline status

Requirements:

Write to /consultations/{id}/participants/{userId}
Use serverTimestamp() for accuracy
Update isOnline field
Update lastSeen timestamp
Handle connection loss gracefully

Pseudocode:

1. Get participant document reference

2. Update fields:

   - isOnline: boolean

   - lastSeen: serverTimestamp()

3. Handle errors silently (don't block user)

4. Log errors for debugging

6. subscribeToParticipant() - Monitor other user

Requirements:

Real-time listener for participant document
Detect online/offline changes
Detect typing status changes
Call callback on updates
Return unsubscribe function

Pseudocode:

1. Get participant document reference

2. Attach onSnapshot listener

3. On document update:

   - Transform data to Participant object

   - Convert timestamps to Date

   - Call callback with participant data

4. On error:

   - Log error

   - Call callback with null

5. Return unsubscribe function

7. updateTypingStatus() - Typing indicators

Requirements:

Update isTyping field in participant document
Set typingAt timestamp when starting
Clear typingAt when stopping
Debounce rapid updates

Pseudocode:

1. Get participant document reference

2. Update fields:

   - isTyping: boolean

   - typingAt: serverTimestamp() or null

3. Handle errors silently

8. markMessagesAsRead() - Read receipts

Requirements:

Reset unreadCount to 0
Update participant document
Trigger read receipt notifications

Pseudocode:

1. Get participant document reference

2. Update unreadCount to 0

3. Optionally update lastReadAt timestamp

4. Handle errors
Image Upload Methods
9. uploadImage() - Firebase Storage upload

Requirements:

Accept image URI (local file path)
Generate unique storage path
Upload with progress callback
Compress image before upload
Return download URL

Pseudocode:

1. Validate image URI

2. Generate path: consultations/{id}/images/{userId}_{timestamp}.jpg

3. Create storage reference

4. Upload file with progress callback

5. Wait for upload completion

6. Get download URL

7. Return URL and metadata
Utility Methods
10. cleanup() - Resource cleanup

Requirements:

Unsubscribe from all listeners
Clear cached data
Reset internal state

11. Error Handling Strategy

Network errors → Retry with exponential backoff
Permission errors → Log and notify user
Quota exceeded → Show quota limit message
Offline → Queue operations, sync when online

Deliverables:

Complete FirestoreChatService.ts implementation
Unit tests for each method
Error handling documentation
Performance benchmarks


Phase 4: UI Integration - User App (5-6 days)
ChatScreen Modifications
File: screens/ChatScreen.tsx

1. Replace Message Sending Logic

Current:

sendMessage() → AgoraChatService.sendMessage()

Target:

sendMessage() → FirestoreChatService.sendMessage()

Changes Required:

Remove AgoraChatService.sendMessage() calls
Replace with FirestoreChatService.sendMessage()
Update message format from Agora to Firestore
Handle new message ID format
Update optimistic UI updates
Handle send errors differently

2. Replace Message Subscription

Current:

useEffect(() => {

  AgoraChatService.onMessageEvent(handleMessage)

}, [])

Target:

useEffect(() => {

  const unsubscribe = FirestoreChatService.subscribeToMessages(

    consultationId,

    (messages) => setMessages(messages)

  )

  return unsubscribe

}, [consultationId])

Changes Required:

Remove AgoraChatService.onMessageEvent
Add FirestoreChatService.subscribeToMessages
Update message state management
Handle Firestore message format
Update message rendering logic

3. Add Presence Indicators

New Feature:

useEffect(() => {

  const unsubscribe = FirestoreChatService.subscribeToParticipant(

    consultationId,

    guideId,

    (participant) => setGuideStatus(participant)

  )

  return unsubscribe

}, [consultationId, guideId])

UI Changes:

Add online/offline badge in header
Show green dot when guide is online
Show gray dot when guide is offline
Display "Last seen" timestamp when offline

4. Update Presence on Lifecycle Events

On Mount:

useEffect(() => {

  FirestoreChatService.updatePresence(consultationId, customerId, true)

  return () => {

    FirestoreChatService.updatePresence(consultationId, customerId, false)

  }

}, [consultationId, customerId])

On App State Change:

useEffect(() => {

  const subscription = AppState.addEventListener('change', (state) => {

    if (state === 'active') {

      FirestoreChatService.updatePresence(consultationId, customerId, true)

    } else if (state === 'background') {

      // Set to 'away' instead of offline

      FirestoreChatService.updatePresence(consultationId, customerId, false)

    }

  })

  return () => subscription.remove()

}, [consultationId, customerId])

5. Add Typing Indicators

On Text Input Change:

const handleTextChange = (text: string) => {

  setInputText(text)

  

  if (text.length > 0) {

    FirestoreChatService.updateTypingStatus(consultationId, customerId, true)

  } else {

    FirestoreChatService.updateTypingStatus(consultationId, customerId, false)

  }

}

Show Guide Typing:

{guideStatus?.isTyping && (

  <Text>Guide is typing...</Text>

)}

6. Update Image Sending Logic

Current:

ChatImagePicker.show((uri) => {

  AgoraChatService.sendMessage(targetUser, '', 'image', uri)

})

Target:

ChatImagePicker.show(async (uri) => {

  const messageId = await FirestoreChatService.sendImageMessage(

    consultationId,

    customerId,

    'customer',

    customerName,

    uri

  )

})

Changes Required:

Update image upload to Firebase Storage
Show upload progress bar
Handle upload errors
Display Firebase Storage URLs in messages

7. Message Rendering Updates

Changes Required:

Handle Firestore timestamp format
Display message status (sending/sent/delivered)
Show read receipts
Handle deleted messages
Update image display logic for Firebase URLs

8. Pagination Implementation

Add Load More:

const handleLoadMore = async () => {

  if (hasMore && !loadingMore) {

    const { messages: newMessages, cursor } = await FirestoreChatService.fetchMessageHistory(

      consultationId,

      lastCursor

    )

    setMessages([...messages, ...newMessages])

    setLastCursor(cursor)

  }

}

UI Changes:

Add "Load more" button or infinite scroll
Show loading indicator
Handle end of messages
Remove Agora Chat Dependencies
Files to Update:

Remove AgoraChatService imports where not needed
Update message format transformations
Remove ChatMessageService (local storage) if fully replaced by Firestore
Clean up unused Agora Chat specific code

Deliverables:

Updated ChatScreen.tsx with Firestore integration
Updated message rendering components
Updated image handling logic
Presence indicator UI
Typing indicator UI
Unit tests for UI components
Integration tests for message flow


Phase 5: UI Integration - Guide App (5-6 days)
ChatScreen Modifications
File: screens/ChatScreen.tsx

Same changes as User App with role adjustments:

Replace Message Sending → Use FirestoreChatService.sendMessage()
Replace Message Subscription → Use FirestoreChatService.subscribeToMessages()
Add Presence Indicators → Monitor customer presence instead of guide
Update Lifecycle Methods → Update guide's own presence
Add Typing Indicators → Show customer typing, update guide typing
Update Image Sending → Firebase Storage upload
Message Rendering → Firestore message format
Pagination → Load more messages

Key Differences from User App:

Monitor Customer Instead:

const unsubscribe = FirestoreChatService.subscribeToParticipant(

  consultationId,

  customerId, // Customer ID, not guide ID

  (participant) => setCustomerStatus(participant)

)

Update Guide's Presence:

FirestoreChatService.updatePresence(consultationId, guideId, true)

Show Customer Typing:

{customerStatus?.isTyping && (

  <Text>Customer is typing...</Text>

)}
Maintain Guide-Specific Features
1. Hand Image Viewer

Keep existing hand image dropdown
Ensure customer hand images still accessible
Maintain integration with GuideDetailsService

2. Chat Tabs Bar

Keep birth details, kundali, info, dosha tabs
Ensure customer profile data accessible
No changes needed (separate feature)

3. Customer Details Integration

Verify customer profile data still loads
Ensure kundali data accessible
Test ashtakvarga and dosha views
Additional Considerations
Consultation Request Modal:

Ensure modal still shows correctly
Verify consultation acceptance flow
Test navigation to ChatScreen with Firestore params

Order History:

Verify completed consultations show in order history
Ensure Firestore data syncs with order history service

Deliverables:

Updated ChatScreen.tsx for guide app
Verified hand image viewer functionality
Verified chat tabs bar integration
Customer details integration tested
Unit tests
Integration tests


Phase 6: Crash Detection & Presence Sync (4-5 days)
Agora RTC Integration for Voice Calls
File: services/AgoraAudioCallService.ts

Current State:

Voice calls use Agora RTC for audio
Connection events available but not used for presence

Target State:

Connection events sync to Firestore
Crash detection updates participant presence
Network quality monitored and stored
Event Handler Setup
1. connection-state-change Handler

Event Data:

State: CONNECTING, CONNECTED, RECONNECTING, DISCONNECTED
Reason: Normal, NetworkLost, TokenExpired, etc.

Action:

onConnectionStateChanged(state, reason) {

  // Update Firestore participant document

  FirestoreChatService.updatePresence(

    consultationId,

    userId,

    state === 'CONNECTED'

  )

  

  // Store additional metadata

  updateParticipantConnectionState(consultationId, userId, {

    connectionState: state,

    disconnectReason: state === 'DISCONNECTED' ? reason : null,

    lastUpdated: Date.now()

  })

}

Firestore Fields to Update:

isOnline: boolean
connectionState: string
disconnectReason: string | null
lastSeen: timestamp

2. user-joined Handler

Event Data:

uid: User ID who joined
elapsed: Time since channel creation

Action:

onUserJoined(uid, elapsed) {

  // Other user (guide) joined

  const otherUserId = getOtherUserId(uid)

  

  FirestoreChatService.updatePresence(

    consultationId,

    otherUserId,

    true

  )

  

  // Show "Guide joined" notification

  showNotification('Guide has joined the call')

}

Firestore Fields to Update:

isOnline: true
joinedAt: serverTimestamp()
connectionState: 'CONNECTED'

3. user-left Handler

Event Data:

uid: User ID who left
reason: Quit, ServerTimeOut, BecomeAudience

Action:

onUserLeft(uid, reason) {

  const otherUserId = getOtherUserId(uid)

  

  // Determine if crash or normal disconnect

  const isCrash = reason === 'ServerTimeOut'

  

  FirestoreChatService.updatePresence(

    consultationId,

    otherUserId,

    false

  )

  

  updateParticipantConnectionState(consultationId, otherUserId, {

    isOnline: false,

    disconnectReason: reason,

    disconnectedAt: Date.now(),

    isCrash: isCrash

  })

  

  if (isCrash) {

    // Show crash detection UI

    showCrashAlert('Guide lost connection. Waiting for reconnection...')

    startReconnectionGracePeriod()

  } else {

    // Normal disconnect

    showNotification('Guide left the call')

  }

}

Firestore Fields to Update:

isOnline: false
disconnectReason: string
disconnectedAt: timestamp
isCrash: boolean

4. network-quality Handler

Event Data:

uid: User ID
txQuality: Upload quality (0-6)
rxQuality: Download quality (0-6)

Action:

onNetworkQuality(uid, txQuality, rxQuality) {

  const quality = Math.max(txQuality, rxQuality)

  

  // Update Firestore if quality changed significantly

  if (Math.abs(quality - lastQuality) >= 2) {

    updateParticipantConnectionState(consultationId, userId, {

      networkQuality: quality

    })

  }

  

  // Show warning if poor quality

  if (quality > 4) {

    showWarning('Poor network connection. Call may disconnect.')

  }

  

  lastQuality = quality

}

Firestore Fields to Update:

networkQuality: number (0-6)
lastQualityCheck: timestamp

5. exception Handler

Event Data:

code: Error code
message: Error message

Action:

onException(code, message) {

  console.error('Agora RTC Exception:', code, message)

  

  // Log to error tracking service

  logError('agora_rtc_exception', { code, message })

  

  // Potentially trigger recovery logic

  if (code === 'FATAL_ERROR') {

    handleFatalError()

  }

}
App Lifecycle Handling
Purpose: Distinguish background vs crash

AppState Listener:

useEffect(() => {

  const subscription = AppState.addEventListener('change', (nextState) => {

    if (nextState === 'active') {

      // App came to foreground

      FirestoreChatService.updatePresence(consultationId, userId, true)

      resumePresenceHeartbeat()

    } else if (nextState === 'background') {

      // App went to background

      FirestoreChatService.updatePresence(consultationId, userId, false)

      pausePresenceHeartbeat()

    }

  })

  

  return () => subscription.remove()

}, [consultationId, userId])

Presence Heartbeat:

// Send presence update every 30 seconds

const startPresenceHeartbeat = () => {

  heartbeatInterval = setInterval(() => {

    if (isConnected) {

      FirestoreChatService.updatePresence(consultationId, userId, true)

    }

  }, 30000)

}

const stopPresenceHeartbeat = () => {

  if (heartbeatInterval) {

    clearInterval(heartbeatInterval)

  }

}
Grace Period Implementation
Purpose: Wait for reconnection before timeout

Reconnection Logic:

let reconnectionTimer = null

const startReconnectionGracePeriod = () => {

  // Show "Waiting for reconnection..." UI

  setReconnecting(true)

  

  // Wait 60 seconds for reconnection

  reconnectionTimer = setTimeout(() => {

    // User didn't reconnect in time

    handleReconnectionTimeout()

  }, 60000)

}

const cancelReconnectionGracePeriod = () => {

  if (reconnectionTimer) {

    clearTimeout(reconnectionTimer)

    setReconnecting(false)

  }

}

const handleReconnectionTimeout = () => {

  // Notify backend of timeout

  consultationApi.reportTimeout(consultationId)

  

  // Show timeout modal

  showTimeoutModal('Guide did not reconnect. Consultation ended.')

  

  // Navigate to home or feedback screen

  NavigationHelper.navigateToHome()

}

// If user rejoins within grace period

onUserJoined(uid) {

  cancelReconnectionGracePeriod()

  showNotification('Guide reconnected!')

}
UI Components for Presence
Connection Status Banner:

{connectionState === 'RECONNECTING' && (

  <View style={styles.banner}>

    <ActivityIndicator />

    <Text>Reconnecting...</Text>

  </View>

)}

{!isOnline && (

  <View style={styles.banner}>

    <Text>You are offline. Messages will send when connected.</Text>

  </View>

)}

{reconnecting && (

  <View style={styles.banner}>

    <Text>Guide disconnected. Waiting for reconnection...</Text>

    <Button onPress={handleEndCall}>End Call</Button>

  </View>

)}

{networkQuality > 4 && (

  <View style={styles.warningBanner}>

    <Text>⚠️ Poor connection. Call may disconnect.</Text>

  </View>

)}
Testing Crash Detection
Test Scenarios:

Force-close guide app

Expected: Customer sees "Guide disconnected" within 1-2 seconds
Verify: Firestore participant document updated
Verify: Grace period starts

Turn off guide's WiFi

Expected: Customer sees disconnect notification
Verify: Network quality warning shows first
Verify: Disconnect happens after timeout

Put guide app in background

Expected: Status shows "away" not "offline"
Verify: Connection stays active
Verify: Can send/receive messages

Guide reconnects quickly

Expected: No timeout, resume normally
Verify: Grace period cancelled
Verify: "Reconnected" message shows

Poor network

Expected: Warning shown but connection active
Verify: Network quality updates in Firestore
Verify: Messages queue and send when network improves

Deliverables:

Updated AgoraAudioCallService with presence sync
Presence heartbeat implementation
Grace period logic
UI components for connection status
Comprehensive test suite
Testing documentation


Phase 7: ConsultationService Integration (2-3 days)
User App Updates
File: services/ConsultationService.ts

1. Update joinConsultations() Method

Current Implementation:

static async joinConsultations(consultation_id: string, mode: string) {

  // ...existing code...

  

  if (mode === "chat") {

    // Set Agora Chat tokens

    AgoraChatService.chatToken = response.data.data.data.customer_agora_chat_token

    AgoraChatService.targetUserId = response.data.data.data.guide_agora_chat_user_id

    AgoraChatService.userId = response.data.data.data.customer_agora_chat_user_id

    

    // Set customer_id and guide_id

    this.customerId = response.data.data.data.customer_id

    this.guideId = response.data.data.data.guide_id

  }

}

Target Implementation:

static async joinConsultations(consultation_id: string, mode: string) {

  // ...existing code...

  

  if (mode === "chat") {

    // Remove Agora Chat token setup

    // Keep only for backward compatibility if needed

    

    // Set consultation context for Firestore

    this.consultation_id = consultation_id

    this.customerId = response.data.data.data.customer_id

    this.guideId = response.data.data.data.guide_id

    this.customerName = response.data.data.data.customer_name || "Customer"

    this.guideName = response.data.data.data.guide_name || "Guide"

    

    // Initialize Firestore presence

    await FirestoreChatService.updatePresence(

      consultation_id,

      this.customerId,

      true

    )

  } else if (mode === "voice") {

    // Keep Agora RTC token setup

    AgoraVoiceService.token = response.data.data.data.customer_agora_call_token

    AgoraVoiceService.uid = response.data.data.data.customer_x_auth_id

    AgoraVoiceService.channelName = response.data.data.data.channel_name

  }

}

2. Update onComplete() Method

Current Implementation:

static async onComplete(showFeedbackModal: boolean = false) {

  // Complete consultation via API

  const response = await api.patch(`/consultation/customers/${this._consultation_id}/complete`)

  

  // Update wallet balance in background

  WalletService.getWalletBalance(true)

  

  // Update past consultations

  PastConsultationsService.getPastConsultations(true)

  

  // Show feedback modal if requested

  if (showFeedbackModal) {

    this.isFeedbackModalOpen = true

  }

}

Target Implementation:

static async onComplete(showFeedbackModal: boolean = false) {

  // Clean up Firestore listeners first

  await FirestoreChatService.cleanup()

  

  // Update presence to offline

  if (this._consultation_id && this.customerId) {

    await FirestoreChatService.updatePresence(

      this._consultation_id,

      this.customerId,

      false

    )

  }

  

  // Complete consultation via API

  const response = await api.patch(`/consultation/customers/${this._consultation_id}/complete`)

  

  // ...existing background updates...

}

3. Add Consultation Context Getters

New Properties:

private static _customerName: string | null = null

private static _guideName: string | null = null

static set customerName(name: string | null) {

  this._customerName = name

}

static get customerName() {

  return this._customerName

}

static set guideName(name: string | null) {

  this._guideName = name

}

static get guideName() {

  return this._guideName

}
Guide App Updates
File: services/ConsultationService.ts

1. Update onAccept() Method

Current Implementation:

static async onAccept(param: string, mode?: ConsultationEnum) {

  const response = await api.post(`/consultation/${param}/accept`)

  const data = response.data.data.data

  

  if (mode === ConsultationEnum.CHAT) {

    this.agora_user_id = data.guide_agora_chat_user_id

    this.agora_target_id = data.customer_agora_chat_user_id

    AgoraChatService.chatToken = data.guide_agora_chat_token

    AgoraChatService.userId = data.guide_agora_chat_user_id

  }

}

Target Implementation:

static async onAccept(param: string, mode?: ConsultationEnum) {

  const response = await api.post(`/consultation/${param}/accept`)

  const data = response.data.data.data

  

  this._consultation_id = data.id

  

  if (mode === ConsultationEnum.CHAT) {

    // Remove Agora Chat setup

    

    // Set consultation context for Firestore

    this.guideId = data.guide_id

    this.customerId = data.customer_id

    this.guideName = data.guide_name || "Guide"

    this.customerName = data.customer_name || "Customer"

    

    // Initialize Firestore presence

    await FirestoreChatService.updatePresence(

      data.id,

      this.guideId,

      true

    )

  } else {

    // Keep Agora RTC setup for voice

    AgoraVoiceService.token = data.guide_agora_call_token

    AgoraVoiceService.uid = data.guide_x_auth_id

    AgoraVoiceService.channelName = data.channel_name

  }

  

  // Fetch customer profile details

  await GuideDetailsService.getUserDetailsByProfileId(

    data.customer_id.toString(),

    data.customer_profile_id.toString()

  )

}

2. Update onComplete() Method

Current Implementation:

static async onComplete() {

  const response = await api.patch(`/consultation/guides/${this._consultation_request_id}/complete`)

  

  this.pendingConsultations()

  this._isOnConsultation = false

  this.getOrderHistory()

  GuideDetailsService.GuideProfile()

  WalletService.getTransactionHistory()

}

Target Implementation:

static async onComplete() {

  // Clean up Firestore first

  await FirestoreChatService.cleanup()

  

  // Update presence to offline

  if (this._consultation_id && this.guideId) {

    await FirestoreChatService.updatePresence(

      this._consultation_id,

      this.guideId,

      false

    )

  }

  

  // Complete consultation via API

  const response = await api.patch(`/consultation/guides/${this._consultation_request_id}/complete`)

  

  // ...existing updates...

}
ConsultationEventHandler Updates
User App - File: services/ConsultationEventHandler.ts

Update handleConsultationComplete:

private async handleConsultationComplete(event: ConsultationCompleteEvent): Promise<void> {

  // Clean up Agora services

  if (event.mode === "voice") {

    AgoraVoiceService.release()

  } else if (event.mode === "chat") {

    // Clean up Firestore instead of Agora Chat

    await FirestoreChatService.cleanup()

    store.set(shouldShowChatScreenKeyboardAtom, false)

  }

  

  // ...existing code...

}

Guide App - File: services/ConsultationEventHandler.ts

Similar updates to handleConsultationComplete

Deliverables:

Updated ConsultationService in both apps
Updated ConsultationEventHandler in both apps
Navigation params include Firestore context
Cleanup methods properly called
Integration tests for consultation flow


Phase 8: Migration Strategy (3-4 days)
Decision Point: Message History
Option A: Start Fresh (Recommended)

Pros:

Simpler implementation
No data transformation needed
Cleaner codebase
Faster deployment

Cons:

Existing in-progress consultations lose history
Users might ask "where are my messages?"

Implementation:

New consultations use Firestore from day 1
Active consultations continue with Agora Chat
Once completed, next consultation uses Firestore

Option B: Migrate Recent Messages

Pros:

Preserves message history
Better user experience
No data loss

Cons:

Complex implementation
Data transformation required
Migration errors possible
Slower deployment

Implementation:

Fetch messages from Agora Chat API
Transform to Firestore format
Batch write to Firestore
Mark consultation as "migrated"
Handle edge cases (duplicates, failures)

Recommendation: Start with Option A (Fresh Start)

Reason: Simpler, faster, lower risk
Active consultations can finish with Agora Chat
New consultations start clean with Firestore
Can add migration later if needed
Phased Rollout Strategy
Phase 1: Internal Testing (Week 1-2)

Deploy with feature flag USE_FIRESTORE_CHAT = false
Test internally with test accounts
Verify all flows work correctly
Monitor Firebase quotas and performance

Phase 2: Beta Testing (Week 3)

Enable for beta testers (5-10 users)
Monitor closely for errors
Gather user feedback
Fix critical bugs

Phase 3: Gradual Rollout (Week 4-6)

Enable for 10% of users
Monitor metrics (crash rate, message latency, user complaints)
If stable, increase to 25%
If stable, increase to 50%
If stable, increase to 100%

Phase 4: Full Deployment (Week 7)

Enable for all users
Monitor for 1 week
Remove Agora Chat code after stability confirmed
Feature Flag Implementation
Config File: config/features.ts

export const FeatureFlags = {

  USE_FIRESTORE_CHAT: false, // Master switch

  FIRESTORE_CHAT_ROLLOUT_PERCENTAGE: 0, // 0-100

}

Usage in Code:

if (FeatureFlags.USE_FIRESTORE_CHAT) {

  // Use FirestoreChatService

  await FirestoreChatService.sendMessage(...)

} else {

  // Use AgoraChatService (legacy)

  await AgoraChatService.sendMessage(...)

}

User Bucketing:

const shouldUseFirestoreChat = () => {

  if (!FeatureFlags.USE_FIRESTORE_CHAT) return false

  

  // Use user ID to determine if in rollout percentage

  const userIdHash = hashUserId(customerId)

  const bucket = userIdHash % 100

  return bucket < FeatureFlags.FIRESTORE_CHAT_ROLLOUT_PERCENTAGE

}
Rollback Plan
If Critical Issues Found:

Immediate Rollback (< 5 minutes)

Set USE_FIRESTORE_CHAT = false in feature flags
Deploy config update
All users revert to Agora Chat
Monitor for stabilization

Data Consistency Check

Verify no messages lost in Firestore
Check for partial writes
Ensure users can continue conversations

Post-Mortem

Document what went wrong
Fix root cause
Re-test thoroughly
Plan new rollout

Keeping Agora Chat Code:

Don't delete Agora Chat code for 2-3 releases
Keep it as fallback
Remove only after Firestore proven stable
Migration Monitoring
Metrics to Track:

Functional Metrics

Message delivery rate (target: 100%)
Message latency p50, p95, p99 (target: < 500ms)
Presence update accuracy (target: > 99%)
Image upload success rate (target: > 95%)

Performance Metrics

App crash rate (should not increase)
Memory usage (should not significantly increase)
Network data usage
Battery drain

Firebase Metrics

Firestore read/write operations
Storage read/write bandwidth
Quota usage
Costs

User Experience Metrics

Support tickets related to chat
Consultation completion rate
User complaints
App store ratings

Monitoring Tools:

Firebase Console - Real-time metrics
Datadog/Sentry - Error tracking
Google Analytics - User behavior
Custom dashboard - Migration progress

Alert Thresholds:

Message delivery rate < 95% → Alert
Message latency p95 > 1000ms → Alert
Crash rate increase > 1% → Alert
Firestore quota > 80% → Warning
Support tickets increase > 50% → Warning
Deliverables
Migration strategy document (this section)
Feature flag implementation
Rollout schedule
Rollback procedures
Monitoring dashboard
Alert configuration


Phase 9: Testing & Quality Assurance (5-7 days)
Unit Tests
FirestoreChatService Tests

File: services/__tests__/FirestoreChatService.test.ts

Test Cases:

sendMessage()

✅ Sends text message successfully
✅ Returns message ID
✅ Updates consultation metadata
❌ Handles empty content
❌ Handles network error
❌ Handles permission denied error
❌ Handles quota exceeded error

sendImageMessage()

✅ Uploads image successfully
✅ Creates message with imageUrl
❌ Handles invalid image URI
❌ Handles upload failure
❌ Handles storage quota exceeded

subscribeToMessages()

✅ Receives messages in real-time
✅ Transforms Firestore docs correctly
✅ Returns unsubscribe function
❌ Handles subscription error
✅ Handles empty messages

updatePresence()

✅ Updates isOnline field
✅ Updates lastSeen timestamp
❌ Handles offline scenario
❌ Handles permission error

updateTypingStatus()

✅ Sets isTyping to true
✅ Clears isTyping when false
✅ Updates typingAt timestamp
❌ Handles rapid updates

fetchMessageHistory()

✅ Fetches paginated messages
✅ Returns cursor for next page
✅ Handles end of messages
❌ Handles network error

Mocking Strategy:

Mock Firestore with @react-native-firebase/firestore mocks
Mock Storage with @react-native-firebase/storage mocks
Use Jest for test framework
Use test data generators
Integration Tests
Test Scenarios:

1. End-to-End Message Flow

User sends message → Message appears in Firestore → Guide receives message

Steps:

1. User opens chat screen

2. User types and sends message

3. Verify message written to Firestore

4. Guide's listener receives update

5. Message displays in guide's chat

6. Verify timestamps correct

7. Verify message order preserved

2. Image Sending Flow

User selects image → Upload to Storage → Message with URL sent

Steps:

1. User taps image picker

2. Selects image from gallery

3. Image uploads to Firebase Storage

4. Progress shown to user

5. Download URL obtained

6. Message created with imageUrl

7. Guide receives image message

8. Image displays correctly

3. Presence Indicators

User joins → Presence updated → Guide sees online status

Steps:

1. User joins consultation

2. Presence set to online in Firestore

3. Guide's listener receives update

4. Green dot shows in guide's UI

5. User leaves

6. Presence set to offline

7. Gray dot shows, last seen displayed

4. Typing Indicators

User starts typing → Guide sees indicator → User stops → Indicator disappears

Steps:

1. User focuses on input

2. User types first character

3. isTyping set to true in Firestore

4. Guide sees "Customer is typing..."

5. User sends message

6. isTyping set to false

7. Guide's typing indicator disappears

5. Offline Sync

User loses network → Sends message → Regains network → Message syncs

Steps:

1. User turns off WiFi

2. User sends message

3. Message queued locally by Firebase

4. User turns on WiFi

5. Message automatically syncs to Firestore

6. Guide receives delayed message

7. Timestamps reflect actual send time

6. Pagination

User scrolls to top → Loads older messages → Displays correctly

Steps:

1. User opens chat with 100+ messages

2. Initial 50 messages loaded

3. User scrolls to top

4. "Load more" triggered

5. Next 20 messages fetched

6. Messages prepended to list

7. Scroll position maintained

8. No duplicate messages
Edge Case Testing
1. Network Loss During Send

User sends message
Network disconnects mid-send
Verify message queued
Network reconnects
Verify message sends automatically
Verify no duplicate messages

2. App Crash During Consultation

User in active consultation
Force close app
Other user sees offline status
User reopens app
Verify can rejoin consultation
Verify messages preserved

3. Background/Foreground Transitions

User sends message
Switches to another app
Receives message notification
Returns to app
Verify messages loaded
Verify scroll position maintained

4. Simultaneous Messages

User and guide send messages at exact same time
Verify both messages delivered
Verify correct order (by timestamp)
Verify no race conditions

5. Large Message Volumes

Send 1000 messages rapidly
Verify all delivered
Verify performance acceptable
Verify memory usage reasonable
Verify Firestore quota not exceeded

6. Firestore Quota Limits

Simulate quota exceeded error
Verify graceful error handling
Verify user notified
Verify app doesn't crash
Verify recovery when quota available

7. Image Upload Failures

Select very large image (> 10MB)
Verify size validation
Verify compression applied
Verify upload error handled
User can retry

8. Expired Consultation

User keeps app open past consultation end
Send message after consultation ended
Verify error message shown
Verify no partial data written
Performance Testing
Metrics to Measure:

1. Message Latency

Test: Send 100 messages from user to guide

Measure: Time from send to receive

Target: 

  - p50 < 200ms

  - p95 < 500ms

  - p99 < 1000ms

2. Memory Usage

Test: Load chat with 1000 messages

Measure: Memory usage over time

Target: 

  - < 100MB increase

  - No memory leaks

  - Stable over 30 minutes

3. Offline Cache Size

Test: Cache 500 messages with 50 images

Measure: Total cache size on device

Target:

  - < 100MB for messages

  - < 500MB for images

4. Image Upload Speed

Test: Upload 10 images of varying sizes

Measure: Upload time per image

Target:

  - 1MB image < 2 seconds

  - 5MB image < 5 seconds

  - 10MB image < 10 seconds

5. Presence Update Latency

Test: User goes offline, measure time until guide notified

Measure: Time from offline to UI update

Target: < 2 seconds

6. App Startup Time

Test: Cold start app, load chat screen

Measure: Time to interactive

Target: < 3 seconds
Test Environment Setup
Test Accounts:

5 customer test accounts
5 guide test accounts
Different device types (iOS, Android)
Different network conditions (WiFi, 4G, 3G, offline)

Test Data:

Test consultations
Test messages (various types)
Test images
Mock Firestore data

Test Tools:

Jest for unit tests
Detox for E2E tests
Firebase Emulator for integration tests
Charles Proxy for network simulation
Flipper for debugging
Test Documentation
Test Plan Document:

Test objectives
Test scope
Test cases
Expected results
Actual results
Pass/fail criteria

Bug Report Template:

Bug description
Steps to reproduce
Expected behavior
Actual behavior
Screenshots/videos
Device/OS information
Firebase logs
Priority level

Deliverables:

Unit test suite (80%+ coverage)
Integration test suite
Performance test results
Bug reports and fixes
Test documentation


Phase 10: Cleanup & Optimization (2-3 days)
Code Cleanup
Remove Unused Code:

AgoraChatService - Conditional Removal

If fully migrated: Remove entire service
If keeping as fallback: Mark as deprecated
Remove unused imports across codebase
Clean up type definitions

ChatMessageService - Evaluate Need

Firebase Firestore provides offline caching
Local persistence might be redundant
Decision: Keep, modify, or remove?
If removing, migrate any local-only features

Agora Chat UI Components

Remove Agora-specific message rendering
Remove Agora connection status displays
Update to Firestore-specific components

Old Type Definitions

Remove Agora ChatMessage types
Remove Agora-specific interfaces
Update imports across codebase

Files to Update/Remove:

services/AgoraChatService.ts (conditional)
services/ChatMessageService.ts (evaluate)
types/agora-chat.types.ts (if exists)
Any Agora Chat specific helpers/utils

Update Imports:

// Before

import { AgoraChatService } from '@/services/AgoraChatService'

// After  

import { FirestoreChatService } from '@/services/FirestoreChatService'

Update Documentation:

README.md - Update architecture section
MOBILE_APP_FIREBASE_CHAT_IMPLEMENTATION.md - Mark as implemented
Code comments - Update outdated references
API documentation - Update integration guides
Firestore Query Optimization
1. Composite Indexes

Create Index for Message Queries:

Collection: consultations/{id}/messages

Fields:

  - consultationId (Ascending)

  - timestamp (Descending)

Create Index for Participant Queries:

Collection: consultations/{id}/participants

Fields:

  - consultationId (Ascending)

  - isOnline (Descending)

  - lastSeen (Descending)

Firebase Console Steps:

Go to Firestore → Indexes
Click "Create Index"
Add fields as specified
Wait for index to build
Test query performance

2. Query Optimization

Pagination Efficiency:

// Before: Fetching all messages

const messages = await firestore()

  .collection('consultations')

  .doc(consultationId)

  .collection('messages')

  .get()

// After: Paginated with limit

const messages = await firestore()

  .collection('consultations')

  .doc(consultationId)

  .collection('messages')

  .orderBy('timesmp', 'desc')

  .limit(50) // Only fetch what's needed

  .get()

Reduce Listener Queries:

// Before: Listening to all fields

const unsubscribe = firestore()

  .collection('consultations')

  .doc(consultationId)

  .onSnapshot(...)

// After: Only listen to specific fields

const unsubscribe = firestore()

  .collection('consultations')

  .doc(consultationId)

  .collection('participants')

  .doc(userId)

  .onSnapshot(...) // More specific

3. Offline Persistence Tuning

Cache Size Configuration:

await firestore().settings({

  cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache

  persistence: true,

})

Cache Cleanup Strategy:

// Clear old cached consultations

const clearOldCache = async () => {

  const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days ago

  

  // Let Firebase handle automatic cleanup

  // Or implement manual cleanup if needed

  await firestore().clearPersistence()

}
Firebase Storage Optimization
1. Image Compression

Compress Before Upload:

import ImageResizer from 'react-native-image-resizer'

const compressImage = async (imageUri: string) => {

  const result = await ImageResizer.createResizedImage(

    imageUri,

    1200, // max width

    1200, // max height

    'JPEG',

    80, // quality

    0, // rotation

    null, // output path

    false, // keep metadata

  )

  return result.uri

}

// Use before upload

const compressedUri = await compressImage(selectedImageUri)

await FirestoreChatService.sendImageMessage(..., compressedUri)

2. Thumbnail Generation

Create Thumbnails on Upload:

const uploadImageWithThumbnail = async (imageUri: string) => {

  // Upload full image

  const fullImageUrl = await uploadImage(imageUri)

  

  // Create and upload thumbnail

  const thumbnail = await ImageResizer.createResizedImage(

    imageUri,

    300,

    300,

    'JPEG',

    60,

  )

  const thumbnailUrl = await uploadImage(thumbnail.uri, '_thumb')

  

  return { fullImageUrl, thumbnailUrl }

}

3. CDN Caching

Use Firebase CDN:

Images automatically served through Google CDN
Configure cache headers for optimal performance
Set Cache-Control: public, max-age=31536000 for images

4. Storage Rules Optimization

Restrict Upload Sizes:

rules_version = '2';

service firebase.storage {

  match /b/{bucket}/o {

    match /consultations/{consultationId}/images/{imageId} {

      allow write: if request.auth != null 

                   && request.resource.size < 10 * 1024 * 1024; // 10MB limit

      allow read: if request.auth != null;

    }

  }

}
Performance Monitoring
1. Firebase Performance Monitoring

Already Configured? (Check existing setup)

Add Custom Traces:

import perf from '@react-native-firebase/perf'

// Trace message sending

const sendMessageTrace = async () => {

  const trace = await perf().startTrace('firestore_send_message')

  

  try {

    await FirestoreChatService.sendMessage(...)

    trace.putAttribute('success', 'true')

  } catch (error) {

    trace.putAttribute('success', 'false')

    trace.putAttribute('error', error.message)

  } finally {

    await trace.stop()

  }

}

// Trace image upload

const uploadImageTrace = async () => {

  const trace = await perf().startTrace('firebase_storage_upload')

  trace.putMetric('image_size', imageSizeBytes)

  

  try {

    const url = await uploadImage(...)

    trace.putAttribute('success', 'true')

  } catch (error) {

    trace.putAttribute('success', 'false')

  } finally {

    await trace.stop()

  }

}

2. Analytics Events

Track Key Events:

import analytics from '@react-native-firebase/analytics'

// Message sent

await analytics().logEvent('chat_message_sent', {

  consultation_id: consultationId,

  message_type: 'text',

  duration_seconds: durationSinceJoin,

})

// Image sent

await analytics().logEvent('chat_image_sent', {

  consultation_id: consultationId,

  image_size_kb: imageSizeKB,

  upload_duration_seconds: uploadDuration,

})

// Consultation chat completed

await analytics().logEvent('chat_consultation_completed', {

  consultation_id: consultationId,

  total_messages: messageCount,

  duration_minutes: durationMinutes,

})

3. Error Tracking

Log Firestore Errors:

import crashlytics from '@react-native-firebase/crashlytics'

const handleFirestoreError = (error: any, context: string) => {

  console.error(`Firestore error in ${context}:`, error)

  

  // Log to Crashlytics

  crashlytics().recordError(error, {

    context,

    consultationId,

    userId,

    errorCode: error.code,

  })

}
Memory Management
1. Listener Cleanup

Ensure All Listeners Unsubscribe:

useEffect(() => {

  const unsubscribers: Array<() => void> = []

  

  // Messages listener

  unsubscribers.push(

    FirestoreChatService.subscribeToMessages(consultationId, setMessages)

  )

  

  // Presence listener

  unsubscribers.push(

    FirestoreChatService.subscribeToParticipant(consultationId, guideId, setGuideStatus)

  )

  

  return () => {

    // Unsubscribe all on unmount

    unsubscribers.forEach(unsub => unsub())

  }

}, [consultationId, guideId])

2. Message List Optimization

Virtualized List:

<FlatList

  data={messages}

  renderItem={renderMessage}

  keyExtractor={(item) => item.id}

  

  // Performance optimizations

  initialNumToRender={20}

  maxToRenderPerBatch={10}

  windowSize={10}

  removeClippedSubviews={true}

  

  // Memory optimization

  onEndReached={handleLoadMore}

  onEndReachedThreshold={0.5}

/>

3. Image Caching

Use Fast Image:

import FastImage from 'react-native-fast-image'

<FastImage

  source={{ 

    uri: imageUrl,

    priority: FastImage.priority.normal,

    cache: FastImage.cacheControl.immutable

  }}

  style={styles.image}

  resizeMode={FastImage.resizeMode.cover}

/>
Final Verification
Checklist:

All Agora Chat code removed/deprecated
All imports updated
Firestore indexes created
Query optimization verified
Image compression working
Performance traces added
Analytics events logging
Memory leaks fixed
Documentation updated
Build successful (iOS and Android)

Deliverables:

Cleaned up codebase
Optimized Firestore queries
Performance monitoring configured
Updated documentation
Final performance report


Risk Assessment
High Risk Items
1. Breaking Existing Consultations

Risk: Users mid-chat lose messages or can't send
Impact: High - Immediate user complaints, bad reviews
Probability: Medium - If not careful with deployment
Mitigation:
Feature flag for gradual rollout
Allow active consultations to finish with Agora Chat
Extensive testing before rollout
Quick rollback plan ready

2. Firestore Quota Exceeded

Risk: Hit Firebase free tier limits or budget limits
Impact: High - Chat stops working, costs spike
Probability: Medium - Depends on usage patterns
Mitigation:
Set up quota alerts at 50%, 75%, 90%
Monitor costs daily during rollout
Implement query optimization
Budget approved before rollout

3. Performance Degradation

Risk: Chat becomes slow, messages delayed
Impact: High - Poor user experience
Probability: Low-Medium - Real-time listeners can be expensive
Mitigation:
Performance testing before rollout
Monitor latency metrics
Optimize queries proactively
Cache aggressively

4. Data Loss During Migration

Risk: Messages lost during cutover
Impact: Critical - Loss of user data
Probability: Low - If proper precautions taken
Mitigation:
Backup existing Agora Chat data
Don't migrate in-progress consultations
Extensive testing of data flow
Rollback plan ready
Medium Risk Items
5. Incomplete Feature Parity

Risk: Firestore missing features from Agora Chat
Impact: Medium - Some features don't work
Probability: Medium - Different platforms, different capabilities
Mitigation:
Feature comparison checklist
Test all features thoroughly
Document known limitations
Plan for feature additions

6. Firebase Configuration Issues

Risk: Wrong credentials, misconfigured rules
Impact: Medium - Features fail, security issues
Probability: Low - Easy to verify
Mitigation:
Configuration checklist
Test in staging environment first
Security rules review
Permissions testing

7. Network Reliability

Risk: Poor network causes offline issues
Impact: Medium - Users can't send/receive messages
Probability: Medium - Users on poor networks
Mitigation:
Offline persistence enabled
Queue messages for retry
Show clear offline indicators
Test on various network conditions

8. Third-party Service Downtime

Risk: Firebase goes down
Impact: High - Chat completely broken
Probability: Very Low - Firebase has good uptime
Mitigation:
Monitor Firebase status
Show clear error messages
Fallback to Agora Chat if needed
Inform users of outage
Low Risk Items
9. Type Definition Mismatches

Risk: TypeScript errors from incorrect types
Impact: Low - Caught at compile time
Probability: Low - Testing catches these
Mitigation:
Strong typing throughout
Comprehensive tests
Code review

10. UI Rendering Issues

Risk: Messages display incorrectly
Impact: Low-Medium - Affects UX but not critical
Probability: Low - Testing catches these
Mitigation:
Visual regression testing
Manual QA testing
User feedback during beta


Resource Requirements
Development Time Estimates
Phase
Description
Estimated Days
Phase 1
Dependencies & Configuration
2-3 days
Phase 2
Type Definitions & Architecture
2-3 days
Phase 3
FirestoreChatService Implementation
4-5 days
Phase 4
UI Integration - User App
5-6 days
Phase 5
UI Integration - Guide App
5-6 days
Phase 6
Crash Detection & Presence Sync
4-5 days
Phase 7
ConsultationService Integration
2-3 days
Phase 8
Migration Strategy
3-4 days
Phase 9
Testing & QA
5-7 days
Phase 10
Cleanup & Optimization
2-3 days
Buffer
Unexpected issues, meetings
5 days
TOTAL
End-to-end implementation
39-50 days

Team Requirements
Development Team:

1-2 Senior React Native Developers

Lead implementation
Code review
Architecture decisions
Estimated: 2 people × 50 days = 100 person-days

1 Backend Developer

Firestore security rules
Firebase configuration
Backend API updates if needed
Monitoring setup
Estimated: 1 person × 10 days = 10 person-days

Quality Assurance:

1 QA Engineer
Test plan creation
Manual testing
Test automation
Bug reporting
Regression testing
Estimated: 1 person × 30 days = 30 person-days

Des/Infrastructure:

1 DevOps Engineer
Firebase project setup
Deployment pipelines
Monitoring configuration
Alert setup
Estimated: 1 person × 5 days = 5 person-days

Project Management:

1 Product Manager
Requirements clarification
Priority decisions
Stakeholder communication
Release coordination
Estimated: 1 person × 10 days (part-time) = 10 person-days

TOTAL EFFORT: ~155 person-days (~7 months for 1 person, or ~2 months for team)
Infrastructure Requirements
Firebase:

Firebase Blaze (Pay-as-you-go) plan quired
Estimated costs (per month):
Firestore: $50-200 (depends on reads/writes)
Storage: $25-100 (depends on image volume)
Bandwidth: $10-50
Total: $85-350/month

Development Tools:

Firebase Emulator (free)
Test devices (iOS and Android)
Staging Firebase project
Production Firebase project

Monitoring Tools:

Firebase Console (included)
Crashlytics (included)
Analytics (included)
Performance Monitoring (included)
Optional: Datadog, Sentry (if existing)
Budget Summary
Category
Cost
Development
Team salary costs
Firebase
$85-350/month ongoing
Tools/Services
Existing infrastructure
Buffer
20% contingency



Open Questions for Discussion ✅ (All Answered)
1. Agora Chat Fallback Strategy
Question: Should we maintain Agora Chat as a fallback or completely remove it?

Options:

A. Keep as fallback - Safer but more code to maintain
B. Remove completely - Cleaner but riskier

Recommendation: Keep for 2-3 releases, then remove if stable

DECISION: ✅ Keep as fallback - Maintain Agora Chat code for 2-3 releases as sy net


2. Message History Migration
Question: Should we migrate existing Agora Chat conversations to Firestore?

Options:

A. Start fresh - Simpler, faster, lower risk
B. Migrate all history - Better UX but complex
C. Migrate only last 7 days - Compromise

Recommendation: Option A (Start Fresh)

DECISION: ✅ Option A - Start Fresh - New consultations use Firestore, no migration of old messages


3. Feature Flag Framework
Question: Do we have an existing feature flag system?

If Yes:

Use existing system
Dument integration points

If No:

Implement simple config-based flags
Or use Firebase Remote Config

DECISION: ✅ Use Firebase Remote Config - Implement feature flags using Firebase Remote Config for dynamic control


4. Firebase Budget & Quotas
Question: What's the approved budget for Firebase costs?

Current Usage: (Need data)

Firestore operations/day: ?
Storage bandwidth/day: ?
Expected growth: ?

Projected Costs: $85-350/month

DECISION: ✅ Budget Approved - No budget constraints, proceed with optimaplementation


5. Performance Benchmarks
Question: What are acceptable performance thresholds?

Proposed Targets:

Message latency p95: < 500ms
App crash rate: No increase
Memory usage: < 100MB increase
Image upload: < 5s for 5MB

DECISION: ✅ Approved as-is - Performance targets accepted without modifications


6. Rollout Timeline
Question: Aggressive (2 weeks) or cautious (4-6 weeks) rollout?

Aggressive (2 weeks):

Pros: Faster to market
Cons: Higher risk

Cautious (4-6 weeks):

Pros: Lower risk, more da
Cons: Longer timeline

Recommendation: Cautious approach (4-6 weeks)

DECISION: ✅ Option A - Aggressive (2 weeks) - Fast development and deployment prioritized


7. User Communication
Question: Should we notify users about the chat upgrade?

Options:

A. No notification - Silent upgrade
B. In-app notification - "New and improved chat!"
C. Release notes only - For those who check

Recommendation: Option B (In-app notification)

DECISION: ✅ Option A - No notification - Silent upgrade, no user communicatneeded


8. Existing Consultations During Migration
Question: How to handle active consultations during rollout?

Options:

A. Let them finish with Agora Chat - Safest
B. Force migration mid-consultation - Risky
C. Disable chat for active, wait for completion - User impact

Recommendation: Option A (Let finish)

DECISION: ✅ Option A - Let them finish with Agora Chat - Active consultations complete with existing system


9. ChatMessageService Future
Question: Keep, modify, or remove local persistence layer
Context: Firebase Firestore provides offline caching

Options:

A. Remove - Rely on Firestore cache
B. Keep - Additional reliability layer
C. Modify - Use for Firestore backup

Recommendation: Option A (Remove) after verification

DECISION: ✅ Option A - Remove - Use Firebase offline caching, remove ChatMessageService


10. Typing Indicator Debouncing
Question: How aggressive should typing indicator debouncing be?

Options:

A. Update immediately - Most responsive, more writes
B. Debounce 300ms - Good balce
C. Debounce 1000ms - Less responsive, fewer writes

Recommendation: Option B (300ms)

DECISION: ✅ Option B - Debounce 300ms - Balanced approach for responsiveness and efficiency


Success Metrics
Functional Metrics
1. Message Delivery Rate

Target: 100%
Measurement: (Successful sends / Total send attempts) × 100
Tracking: Firebase Analytics custom event
Alert Threshold: < 95%

2. Message Latency

Targets:
p50 (median): < 200ms
p95: < 500ms
p99: < 1000ms
Measurement: Time from send to receive
Tracking:rebase Performance custom trace
Alert Threshold: p95 > 1000ms

3. Presence Update Accuracy

Target: > 99%
Measurement: (Correct status updates / Total updates) × 100
Tracking: Manual verification + logs
Alert Threshold: < 95%

4. Image Upload Success Rate

Target: > 95%
Measurement: (Successful uploads / Total upload attempts) × 100
Tracking: Firebase Analytics custom event
Alert Threshold: < 90%
Performance Metrics
1. App Crash Rate

Target: No increase from baseline
Baseline: Current crash rate (need da)
Measurement: Crashes per user session
Tracking: Firebase Crashlytics
Alert Threshold: > 10% increase

2. Memory Usage

Target: < 100MB increase from baseline
Baseline: Current memory usage (need data)
Measurement: Peak memory during chat session
Tracking: Manual profiling + performance monitoring
Alert Threshold: > 150MB increase

3. Chat Screen Load Time

Target: < 2 seconds to interactive
Measurement: Time from navigation to first message displayed
Tracking: Firebase Performance custom trace
Alert Threshold: > 3 seconds

4. Offline Sync Time

Target: < 2 seconds after reconnection
Measurement: Time from network restore to messages synced
Tracking: Firebase Performance custom trace
Alert Threshold: > 5 seconds
Business Metrics
1. Support Tickets (Chat-Related)

Target: No increase from baseline
Baseline: Current ticket volume (need data)
Measurement: Tickets tagged "chat" or "messages"
Tracking: Support ticket system
Alert Threshold: > 50% increase

2. Consultation Completion Rate

Target: No decrease from baseline
Baseline: Current completion rate (need data)
Measurement: (Completed consultations / Started consultations) × 100
Tracking: Backend analytics
Alert Threshold: > 5% decrease

3. User Complaints

Target: < 1% of users
Measurement: Users reporting chat issues / Total active users
Tracking: App store reviews, support tickets, in-app feedback
Alert Threshold: > 2% of users

4. App Store Ratings

Target: No rating decrease
Baseline: Current rating (check App Store/Play Store)
Measurement: Average ratig (1-5 stars)
Tracking: App store analytics
Alert Threshold: > 0.2 star decrease
Cost Metrics
1. Firebase Firestore Costs

Target: < $200/month
Measurement: Monthly Firestore bill (reads + writes + storage)
Tracking: Firebase Console billing
Alert Threshold: > $250/month

2. Firebase Storage Costs

Target: < $100/month
Measurement: Monthly Storage bill (storage + bandwidth)
Tracking: Firebase Console billing
Alert Threshold: > $150/month

3. Cost Per Consultation

Target: < $0.10 per consultation
Measurement: Total Firebase costs / Total consultations
Tracking: Manual calculation
Alert Threshold: > $0.15 per consultation
Reliability Metrics
1. Firebase Downtime

Target: 0 incidents
Measurement: Firebase service outages affecting chat
Tracking: Firebase status dashboard + incident reports
Alert: Real-time monitoring

2. Rollback Frequency

Target: 0 rollbacks
Measurement: Number of times reverted to Agora Chat
Tracking: Deployment logs
Alert: Any rollback triggers review

3. Data Loss Incidents

Target: 0 incidents
Measurement: Messages lost/not delivered
Tracking: User reports + audit logs
Alert: Any incident triggers immediate investigation


Approval Checklist
Technical Review
Architecture approved - Hybrid Agora RTC + Firestore approach
Service design reviewed - FirestoreChatService structure
Type definitions approved - Message, Participant, Metadata interfaces
Error handling strategy - Retry logic, graceful degradation
Performance targets set - Latency, memory, crash rate
Resource Allocation
Team assigned - 2 RN devs, 1 backend, 1 QA, 1 DevOps
Timeline approved - 39-50 days (2 months with team)
Budget approved - $85-350/month Firebase costs
Tools available - Test devices, Firebase projects, monitoring
Risk Mitigation
Rollback plan documented - Feature flag, quick revert process
Testing strategy approved - Unit, integration, E2E tests
Migration plan approved - Start fresh approach
Monitoring setup planned - Metrics, alerts, dashboards
Open Questions Answered
Fallback strategy decided - Keep Agora Chat as fallback for 2-3 releases
Message history approach - Start fresh, no migration
Feature flag framework - Use Firebase Remote Config
Budget approved - No budget constraints
Performance benchmarks - Approved as-is
Rollout timeline - Aggressive (2 weeks)
User communication - No notification (silent upgrade)
Active consultations - Let them finish with Agora Chat
ChatMessageService - Remove after migration
Typing indicator debouncing - 300ms debounce
Architecture decisions - All approved (multiple files, static methods, EventEmitter, scoped cleanup)
Stakeholder Sign-off
Engineering Lead - Technical feasibility confirmed
Product Manager - Business value justified
Finance - Budget approved
QA Lead - Testing plan acceptable
DevOps - Infrastructure ready


Next Steps After Approval
Immediate Actions (Week 1)
Kick-off Meeting

Review plan with full team
Assign roles and responsibilities
Set up communication channels
Schedule daily standups

Environment Setup

Create Firebase staging project
Configure Firestore security rules
Set up Firebase emulators
Prepare test accounts

Begin Phase 1

Install dependencies
Configure Firebase
Create config files
Verify builds
Weekly Milestones
Week 1-2: Phases 1-2 complete (Setup & Architecture) Week 3-4: Phase 3 complete (Service Implementation) Week 5-6: Phases 4-5 complete (UI Integration) Week 7-8: Phases 6-7 complete (Presence & Integration) Week 9-10: Phases 8-9 complete (Migration & Testing) Week 11: Phase 10 complete (Cleanup & Optimization) Week 12: Gradual rollout begins
Communication Plan
Daily:

Standup meetings (15 min)
Slack updates on progress
Blocker identification

Weekly:

Demo of completed work
Metrics review
Risk assessment update
Stakeholder update

Bi-weekly:

Sprint planning
Retrospective
Roadmap adjustment


Conclusion
This implementation plan provides a comprehensive roadmap for migrating from Agora Chat to Firebase Firestore. The plan is designed to:

✅ Minimize risk through gradual rollout and feature flags ✅ Maintain quality with extensive testing and monitoring sure reliability with fallback strategies and error handling ✅ Optimize performance through query optimization and caching ✅ Control costs with budget monitoring and alerts

Estimated Timeline: 2-3 months (with team of 4-5 people) Estimated Cost: $85-350/month (Firebase) + team costs Risk Level: Medium (with mitigation strategies in place)



Document Status: ✅ APPROVED - READY FOR IMPLEMENTATION

Key Stakeholder Decisions:

All critical technical decisions made
All architecture decisions approved
Allut decisions confirmed
Budget approved (no constraints)
Performance targets accepted

Next Steps:

Begin Phase 1 immediately - Dependencies & Configuration
Set up development environment
Create Firebase staging project
Install required packages
Start implementation following the approved plan



End of Document


