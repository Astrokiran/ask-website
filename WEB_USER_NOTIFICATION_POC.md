# **🌐 Web User Notification Strategy POC Document**

## **🎯 Objective**

Implement web browser notifications for consultation customers using the **existing notification-gateway infrastructure** with **minimal changes**. Web users should receive browser notifications when guides accept consultation requests, while mobile app notifications remain unchanged.

---

## **📋 Current State Analysis**

### **✅ What Already Works:**
- Mobile app notifications via FCM (Firebase Cloud Messaging)
- Complete notification gateway with Kafka, escalation, delivery tracking
- Consultation event handling (guide accepts, rejects, etc.)
- In-app notifications for mobile apps
- Delivery attempt tracking and retry mechanisms

### **🎯 What We Need to Add:**
- Web browser push notifications using VAPID protocol
- Web push subscription management
- Browser-based notification delivery
- Web user detection and routing logic

---

## **🏗️ Architecture Strategy**

### **Core Principle: REUSE EXISTING INFRASTRUCTURE**

```
Existing Flow (Mobile App):
Guide App → Notification Gateway → FCM → Mobile Device

New Flow (Web User):
Guide App → Notification Gateway → Web Push (VAPID) → Web Browser
```

**Key Insight:** Only the **delivery channel changes**. Everything else (events, routing, tracking, escalation) stays the same.

---

## **🔧 Backend Changes Required**

### **Phase 1: Add Web Push Subscription Storage**

#### **Step 1.1: Create Single New Table**
```sql
-- ONLY new table needed
CREATE TABLE web_push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id TEXT NOT NULL,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh_key TEXT NOT NULL,
    auth_key TEXT NOT NULL,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_web_push_subscriptions_user_id ON web_push_subscriptions(auth_user_id);
CREATE INDEX idx_web_push_subscriptions_active ON web_push_subscriptions(is_active);
```

#### **Step 1.2: Add Web Push Repository**
- Create `WebPushSubscriptionRepository` interface and implementation
- Handle CRUD operations for web push subscriptions
- Manage subscription lifecycle (create, update, deactivate, cleanup)

#### **Step 1.3: Add Web Push Provider**
- Create `WebPushProvider` that implements VAPID protocol
- Handle communication with browser push services
- Manage VAPID keys and authentication
- Convert notification payload to web push format

### **Phase 2: Enhance Notification Routing**

#### **Step 2.1: Update Target Type Logic**
- Extend existing `NotificationService` to handle new target types
- Add `web_user` as a target type alongside existing `user` and `astrologer`
- Implement routing logic to determine delivery channel based on user type

#### **Step 2.2: User Type Detection Strategy**
**Option A: Device-Based Detection (Recommended)**
- Check if user has active web push subscriptions
- Check if user has active mobile FCM tokens
- Route to appropriate channel(s) based on available devices

**Option B: Context-Based Detection**
- Include user context in consultation requests
- Store context with consultation data
- Use context to determine notification channel

#### **Step 2.3: Channel Routing Enhancement**
```go
// Enhanced routing logic in existing NotificationService
switch notification.TargetType {
case "web_user":
    channels = ["web_push", "in_app"]
case "user":
    channels = ["push", "in_app"]  // Existing mobile behavior
case "astrologer":
    channels = ["push", "in_app"]  // Existing guide behavior
}
```

### **Phase 3: Add Web Push APIs**

#### **Step 3.1: Subscription Management Endpoints**
- `POST /api/v1/web-push/subscribe` - Register browser push subscription
- `POST /api/v1/web-push/unsubscribe` - Remove browser push subscription
- `GET /api/v1/web-push/status` - Check subscription status

#### **Step 3.2: Integration with Existing APIs**
- No changes needed to existing `/v1/notify` endpoint
- Web user notifications work through existing notification flow
- Just need to set correct `target_type` and `channels`

### **Phase 4: VAPID Configuration**

#### **Step 4.1: Generate VAPID Keys**
```bash
# One-time setup
npm install -g web-push
web-push generate-vapid-keys
```

#### **Step 4.2: Environment Configuration**
```bash
# Add to notification-gateway environment
WEB_PUSH_VAPID_PUBLIC_KEY=generated_public_key
WEB_PUSH_VAPID_PRIVATE_KEY=generated_private_key
WEB_PUSH_VAPID_SUBJECT=mailto:notifications@astrokiran.com
```

#### **Step 4.3: Web Push Provider Configuration**
- Initialize VAPID keys in WebPushProvider
- Configure TTL, payload size limits
- Set up error handling and retry logic

---

## **🌐 Frontend Changes Required**

### **Phase 1: Service Worker Implementation**

#### **Step 1.1: Create Service Worker (`public/sw.js`)**
- Handle push events from web push protocol
- Display browser notifications with custom actions
- Implement notification click handling
- Manage caching for offline functionality
- Track notification clicks for analytics

#### **Step 1.2: Service Worker Features**
- **Push Event Handling**: Receive and display notifications
- **Click Actions**: "Join Consultation", "View Details" buttons
- **Deep Linking**: Open consultation pages directly
- **Cross-Tab Communication**: Coordinate multiple browser tabs
- **Offline Support**: Cache essential assets

### **Phase 2: Web Push Service Implementation**

#### **Step 2.1: Create WebPushService Class**
- Manage browser notification permissions
- Handle service worker registration
- Create and manage push subscriptions
- Communicate with backend subscription APIs

#### **Step 2.2: Subscription Management Flow**
1. **Permission Request**: Ask user for notification permission
2. **Service Worker Registration**: Register `/sw.js` with browser
3. **VAPID Subscription**: Create subscription using VAPID public key
4. **Backend Registration**: Send subscription to notification-gateway
5. **Storage Management**: Store subscription locally and manage updates

#### **Step 2.3: Error Handling**
- Handle unsupported browsers gracefully
- Manage permission denied scenarios
- Retry failed subscription attempts
- Provide user-friendly error messages

### **Phase 3: UI Integration**

#### **Step 3.1: WebPushManager Component**
- Display current notification permission status
- Show enable/disable notifications toggle
- Handle subscription state changes
- Provide user guidance for browser settings

#### **Step 3.2: Integration Points**
- **Profile Page**: Add notification preferences section
- **Consultation Flow**: Show notification setup prompts
- **Settings Page**: Comprehensive notification management
- **Onboarding**: Explain benefits of desktop notifications

#### **Step 3.3: User Experience Flow**
1. **First Visit**: Prompt to enable desktop notifications
2. **Permission Granted**: Show success state and explanation
3. **Permission Denied**: Show guidance to enable in browser settings
4. **Active Notifications**: Display live consultation updates

### **Phase 4: Real-time Integration**

#### **Step 4.1: Consultation Status Updates**
- Listen for consultation status changes
- Update UI based on notification events
- Show countdown timers for session starts
- Handle tab focus requirements

#### **Step 4.2: Cross-Tab Coordination**
- Use localStorage events for tab communication
- Sync notification state across multiple tabs
- Handle multiple tab notification scenarios
- Prevent duplicate notifications

---

## **🔄 Complete Notification Flow**

### **Web User Consultation Request Flow:**

#### **Step 1: Customer Initiates Request**
1. Customer requests consultation on website
2. Website context stored as "web_user"
3. Consultation service creates request

#### **Step 2: Guide Receives Notification (Existing Flow)**
1. Notification Gateway sends to mobile app
2. Guide sees notification in app
3. Guide accepts consultation request

#### **Step 3: Web User Receives Notification (New Flow)**
1. Consultation service calls `/v1/notify`
2. Target type: "web_user", Channels: ["web_push", "in_app"]
3. Notification Gateway routes to Web Push Provider
4. Web Push Provider sends via VAPID protocol
5. Browser Service Worker receives push event
6. Desktop notification appears with actions

#### **Step 4: User Interaction**
1. User clicks "Join Consultation" in notification
2. Browser opens consultation page
3. Service Worker tracks click event
4. Analytics captured for optimization

### **Notification Delivery Tracking:**

#### **Existing Infrastructure Reused:**
- **notifications table**: Stores all notification events
- **delivery_attempts table**: Tracks web push delivery status
- **escalation rules**: Handle failed deliveries
- **Kafka topics**: Asynchronous processing
- **retry mechanisms**: Exponential backoff for failures

#### **New Data Points:**
- **web_push_subscriptions table**: Browser subscription management
- **Device type tracking**: Web vs mobile analytics
- **Channel performance**: Web push vs FCM effectiveness
- **User engagement**: Click-through rates by channel

---

## **📊 Implementation Phases**

### **Phase 1: Foundation (Week 1)**
- [ ] Generate VAPID keys and configure environment
- [ ] Create web_push_subscriptions table and migration
- [ ] Implement WebPushSubscriptionRepository
- [ ] Create basic WebPushProvider with VAPID support

### **Phase 2: Backend Integration (Week 2)**
- [ ] Enhance NotificationService with web_user target type
- [ ] Implement user type detection logic
- [ ] Add web push subscription APIs
- [ ] Update consultation integration for web notifications

### **Phase 3: Frontend Foundation (Week 3)**
- [ ] Implement service worker (`sw.js`)
- [ ] Create WebPushService class
- [ ] Add VAPID public key to frontend environment
- [ ] Implement subscription management flow

### **Phase 4: UI Integration (Week 4)**
- [ ] Create WebPushManager component
- [ ] Add notification preferences to profile page
- [ ] Implement real-time consultation status updates
- [ ] Add cross-tab coordination

### **Phase 5: Testing & Optimization (Week 5)**
- [ ] End-to-end testing of web notification flow
- [ ] Performance testing for delivery times
- [ ] Browser compatibility testing
- [ ] Analytics implementation and monitoring

---

## **✅ Success Criteria**

### **Functional Requirements:**
- ✅ Web users receive browser notifications for consultation events
- ✅ Guide app notifications remain unchanged
- ✅ Desktop notifications work across major browsers
- ✅ Users can easily enable/disable notifications
- ✅ Notifications provide actionable buttons (Join, View)

### **Technical Requirements:**
- ✅ Zero impact on existing mobile app notifications
- ✅ Reuse existing notification infrastructure
- ✅ Proper error handling and retry mechanisms
- ✅ Cross-tab notification coordination
- ✅ Analytics and performance monitoring

### **User Experience Requirements:**
- ✅ Intuitive permission request flow
- ✅ Clear notification content and actions
- ✅ Seamless transition from notification to consultation
- ✅ Minimal setup friction for users
- ✅ Graceful handling of unsupported browsers

---

## **🔒 Security & Privacy Considerations**

### **VAPID Security:**
- Private key securely stored in backend environment
- Public key safely exposed to frontend
- Subject configured with organizational email
- Regular key rotation policy

### **User Privacy:**
- Explicit user consent required for notifications
- Easy opt-out mechanism
- No tracking of user behavior beyond notification interactions
- Data minimization in subscription storage

### **Authentication:**
- All API calls require valid authentication tokens
- Users can only manage their own subscriptions
- Subscription validation against auth-gateway
- Audit logging of all subscription changes

---

## **📈 Future Enhancements**

### **Phase 2 Features:**
- **Rich Notifications**: Images, videos, custom sounds
- **Scheduled Notifications**: Browser notification scheduling
- **Notification Templates**: Dynamic content templates
- **A/B Testing**: Different notification styles and content

### **Advanced Features:**
- **Geolocation Targeting**: Location-based notifications
- **Behavioral Triggers**: Smart notification timing
- **Multi-language Support**: Localized notification content
- **Analytics Dashboard**: Real-time notification metrics

---

## **🎯 Key Benefits**

### **For Users:**
- **Real-time Updates**: Instant consultation status notifications
- **Desktop Convenience**: Native browser notifications
- **Better Engagement**: Never miss consultation updates
- **Cross-Device Experience**: Seamless web-to-app coordination

### **For Business:**
- **Minimal Development**: Reuse existing infrastructure
- **Cost Effective**: No additional service dependencies
- **Scalable Architecture**: Handles growth with existing systems
- **Unified Analytics**: Single source of truth for all notifications

### **For Development:**
- **Clean Architecture**: Minimal changes, maximum reuse
- **Maintainable Code**: Separate concerns, easy debugging
- **Future-Proof**: Extensible for additional features
- **Performance Optimized**: Leverages existing optimization

This strategy provides **web browser notifications** with **minimal backend changes** while maintaining **full compatibility** with your existing mobile app notification system! 🎉