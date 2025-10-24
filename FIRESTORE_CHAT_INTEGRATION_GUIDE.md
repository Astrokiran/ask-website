# Firestore Chat Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Architecture](#backend-architecture)
4. [Integration Strategy](#integration-strategy)
5. [Required Credentials](#required-credentials)
6. [API Endpoints](#api-endpoints)
7. [Firestore Schema](#firestore-schema)
8. [Implementation Steps](#implementation-steps)
9. [Authentication Flow](#authentication-flow)
10. [Chat Implementation](#chat-implementation)
11. [Real-time Features](#real-time-features)
12. [Error Handling](#error-handling)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides step-by-step instructions for integrating Firestore-based real-time chat functionality into the Astrokiran website. The integration leverages the existing backend infrastructure used by the mobile apps, ensuring consistency and reusability.

### Current State
- ✅ Backend services running (auth-gateway, consultation, customer, guide)
- ✅ Firebase Firestore collections auto-initialized on consultation acceptance
- ✅ Agora tokens generated for real-time communication
- ✅ User authentication system with OTP-based login
- ✅ Consultation management system

### Target State
- 🎯 Real-time chat between customers and astrologers on web
- 🎯 Presence indicators and typing status
- 🎯 Image sharing capabilities
- 🎯 Message history and offline support
- 🎯 Seamless integration with existing consultation flow

---

## Prerequisites

### Technical Requirements
- Node.js 18+ (already installed)
- Next.js 14+ (already installed)
- Firebase SDK (already configured)
- Existing Firebase project access

### Access Requirements
- Firebase console access for project configuration
- Backend API endpoints access
- Agora developer account (for voice/video features)
- S3 bucket access for file storage

### Development Setup
```bash
# Verify Firebase configuration
cat .env.local | grep FIREBASE

# Verify backend services are running
curl http://localhost:8080/api/v1/auth/health
```

---

## Backend Architecture

### Service Ports (Local Development)
- **auth-gateway**: `http://localhost:8080`
- **consultationapplatest**: `http://localhost:8081`
- **customer**: `http://localhost:8082`
- **guideapp**: `http://localhost:8083`
- **notification-gateway**: `http://localhost:8084`

### Service Communication
All services communicate using:
- **JWT Authentication**: Bearer tokens from auth-gateway
- **Service-to-Service**: API keys for internal communication
- **CORS**: Configured for `https://astrokiran.com`

---

## Integration Strategy

### Phase 1: Authentication Integration
1. Implement OTP-based login using auth-gateway
2. Store JWT tokens securely
3. Set up automatic token refresh
4. Handle multi-device sessions

### Phase 2: Consultation Flow
1. Integrate consultation booking API
2. Handle consultation acceptance/rejection
<!-- 3. Generate Agora tokens for real-time communication -->
4. Initialize Firestore session documents

### Phase 3: Chat Implementation
1. Connect to Firestore collections
2. Implement real-time message listeners
3. Add presence and typing indicators
4. Handle image uploads to S3
<!-- 
### Phase 4: Advanced Features
1. Voice/video calling (Agora integration)
2. Message read receipts
3. Chat history management
4. Offline message queuing -->

---

## Required Credentials

### Firebase Configuration
Already configured in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDDjsQx8snaNxx6cRsrXCpu1PzgXhEGg5g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dev-astrokiran-user-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dev-astrokiran-user-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dev-astrokiran-user-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1053671886509
NEXT_PUBLIC_FIREBASE_APP_ID=1:1053671886509:web:fe150e141266ea44d2c024
```

### Backend API Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:9090/api/v1/kundali
NEXT_PUBLIC_DJANGO_URL=https://dev.astrokiran.com
```

### Additional Required Credentials
Add these to `.env.local`:
```env
# Backend API Base URLs
NEXT_PUBLIC_AUTH_GATEWAY_URL=http://localhost:8080
NEXT_PUBLIC_CONSULTATION_API_URL=http://localhost:8081
NEXT_PUBLIC_CUSTOMER_API_URL=http://localhost:8082

# Agora Configuration (if voice/video needed)
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id

# S3 Configuration (for image uploads)
AWS_S3_BUCKET_NAME=astrokiran-public-bucket
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

---

## API Endpoints

### Authentication Endpoints

#### Generate OTP
```http
POST /api/v1/auth/otp/generate
Content-Type: application/json

{
  "area_code": "+91",
  "phone_number": "XXXXXXXXXX",
  "user_type": "customer",
  "purpose": "login"
}
```

#### Validate OTP
```http
POST /api/v1/auth/otp/validate
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "request_id": "uuid-from-otp-generate",
  "otp_code": "123456",
  "user_type": "customer",
  "device_info": {
    "device_type": "web",
    "browser": "Chrome",
    "platform": "Windows"
  },
  "phone_number": "XXXXXXXXXX",
  "area_code": "+91"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}
```

#### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <access_token>
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

### Consultation Endpoints

#### Create Consultation
```http
POST /api/v1/consultation
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "guide_id": 456,
  "mode": "chat",
  "service_type": "consultation",
  "customer_profile_id": 123
}
```

#### Join Consultation
```http
POST /api/v1/consultation/{consultation_id}/join
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "mode": "chat"
}
```

#### Accept Consultation (Guide)
```http
POST /api/v1/consultation/{consultation_id}/accept
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "mode": "chat"
}
```

#### Get Current Consultation
```http
GET /api/v1/consultation/customers/current
Authorization: Bearer <access_token>
```

#### Complete Consultation
```http
PATCH /api/v1/consultation/{consultation_id}/complete
Content-Type: application/json
Authorization: Bearer <access_token>
```

#### Submit Feedback
```http
POST /api/v1/consultation/{consultation_id}/feedback
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rating": 5,
  "feedback_text": "Excellent consultation",
  "issues": ["none"]
}
```

### Customer Profile Endpoints

#### Get Customer Profile
```http
GET /api/v1/customers/{customer_id}/profile
Authorization: Bearer <access_token>
```

#### Create/Update Customer Profile
```http
POST /api/v1/customers/{customer_id}/profile
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "John Doe",
  "date_of_birth": "1990-01-01",
  "time_of_birth": "10:30:00",
  "birth_city": "Mumbai",
  "birth_country": "India",
  "preferred_language": "english",
  "zodiac_sign": "aries",
  "gender": "male"
}
```

### Guide Endpoints

#### Get Available Guides
```http
GET /api/v1/guide/all?online=true&mode=chat
Authorization: Bearer <access_token>
```

#### Get Guide Profile
```http
GET /api/v1/guide/profile
Authorization: Bearer <access_token>
```

---

## Firestore Schema

### Collection Structure
```
/consultations/{pair_id}/sessions/{consultation_id}/
├── (consultation document)
├── participants/
│   ├── {customer_id}
│   └── {guide_id}
├── messages/
│   ├── {message_id}
│   ├── {message_id}
│   └── ...
└── metadata/
    ├── settings
    └── analytics
```

### Consultation Document
```typescript
interface ConsultationDocument {
  consultation_id: string;
  pair_id: string;
  guide_id: string;
  customer_id: string;
  guide_name: string;
  customer_name: string;
  mode: 'chat' | 'voice' | 'video';
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Timestamp;
  started_at?: Timestamp;
  ended_at?: Timestamp;
  agora_tokens?: {
    customer_agora_chat_token?: string;
    customer_agora_rtm_token?: string;
    guide_agora_chat_token?: string;
    guide_agora_rtm_token?: string;
  };
  total_messages: number;
  last_message_at?: Timestamp;
}
```

### Participant Document
```typescript
interface ParticipantDocument {
  user_id: string;
  user_type: 'customer' | 'guide';
  display_name: string;
  is_online: boolean;
  is_typing: boolean;
  typing_at?: Timestamp;
  last_seen: Timestamp;
  unread_count: number;
  connection_state?: string;
  disconnect_reason?: string;
  network_quality?: number;
  x_auth_id: number;
}
```

### Message Document
```typescript
interface MessageDocument {
  id: string;
  sender_id: string;
  sender_type: 'guide' | 'customer';
  sender_name: string;
  type: 'text' | 'image' | 'system';
  content: string;
  image_url?: string;
  timestamp: Timestamp;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  is_deleted: boolean;
  metadata?: {
    file_size?: number;
    file_type?: string;
    upload_progress?: number;
  };
}
```

---

## Implementation Steps

### Step 1: Update Firebase Configuration

1. **Enhance Firebase Config** (`lib/firebase.ts`):
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
import { enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
enableMultiTabIndexedDbPersistence(db);
```

2. **Update Environment Variables**:
```env
# Add to .env.local
NEXT_PUBLIC_AUTH_GATEWAY_URL=http://localhost:8080
NEXT_PUBLIC_CONSULTATION_API_URL=http://localhost:8081
NEXT_PUBLIC_CUSTOMER_API_URL=http://localhost:8082
```

### Step 2: Create Authentication Service

Create `lib/auth-service.ts`:
```typescript
interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  auth_user_id: number;
  user_type: string;
  user_roles: string[];
}

interface OTPRequest {
  area_code: string;
  phone_number: string;
  user_type: 'customer' | 'guide';
  purpose: string;
}

interface OTPValidation {
  request_id: string;
  otp_code: string;
  user_type: 'customer' | 'guide';
  device_info: {
    device_type: string;
    browser: string;
    platform: string;
  };
  phone_number: string;
  area_code: string;
}

class AuthService {
  private baseURL: string;
  private tokens: AuthTokens | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_AUTH_GATEWAY_URL || 'http://localhost:8080';
    this.loadTokensFromStorage();
  }

  async generateOTP(request: OTPRequest): Promise<{ request_id: string }> {
    const response = await fetch(`${this.baseURL}/api/v1/auth/otp/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`OTP generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  async validateOTP(validation: OTPValidation): Promise<AuthTokens> {
    const response = await fetch(`${this.baseURL}/api/v1/auth/otp/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation),
    });

    if (!response.ok) {
      throw new Error(`OTP validation failed: ${response.statusText}`);
    }

    const tokens = await response.json();
    this.setTokens(tokens);
    return tokens;
  }

  async refreshToken(): Promise<AuthTokens> {
    if (!this.tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.tokens.refresh_token }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const newTokens = await response.json();
    this.setTokens(newTokens);
    return newTokens;
  }

  async logout(): Promise<void> {
    if (this.tokens?.access_token) {
      try {
        await fetch(`${this.baseURL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokens.access_token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  getAccessToken(): string | null {
    return this.tokens?.access_token || null;
  }

  isAuthenticated(): boolean {
    return !!this.tokens?.access_token;
  }

  getUserInfo(): { userId: number; userType: string } | null {
    if (!this.tokens) return null;
    return {
      userId: this.tokens.auth_user_id,
      userType: this.tokens.user_type,
    };
  }

  private setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    this.scheduleTokenRefresh();
  }

  private loadTokensFromStorage(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      try {
        this.tokens = JSON.parse(stored);
        this.scheduleTokenRefresh();
      } catch (error) {
        console.error('Error loading tokens:', error);
        localStorage.removeItem('auth_tokens');
      }
    }
  }

  private clearTokens(): void {
    this.tokens = null;
    localStorage.removeItem('auth_tokens');
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh 5 minutes before expiry
    const refreshTime = (this.tokens!.expires_in - 300) * 1000;
    this.refreshTimer = setTimeout(() => {
      this.refreshToken().catch(error => {
        console.error('Auto token refresh failed:', error);
        this.clearTokens();
      });
    }, refreshTime);
  }
}

export const authService = new AuthService();
```

### Step 3: Create Consultation Service

Create `lib/consultation-service.ts`:
```typescript
interface ConsultationRequest {
  guide_id: number;
  mode: 'chat' | 'voice' | 'video';
  service_type: string;
  customer_profile_id?: number;
}

interface ConsultationResponse {
  consultation_id: string;
  pair_id: string;
  guide_id: number;
  customer_id: number;
  status: string;
  agora_tokens?: {
    customer_agora_chat_token?: string;
    customer_agora_rtm_token?: string;
  };
}

interface JoinConsultationResponse {
  consultation_id: string;
  pair_id: string;
  agora_tokens: {
    customer_agora_chat_token: string;
    customer_agora_rtm_token: string;
  };
  firestore_session: {
    session_path: string;
    participant_id: string;
  };
}

class ConsultationService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_CONSULTATION_API_URL || 'http://localhost:8081';
  }

  async createConsultation(request: ConsultationRequest): Promise<ConsultationResponse> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${this.baseURL}/api/v1/consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Consultation creation failed: ${response.statusText}`);
    }

    return response.json();
  }

  async joinConsultation(consultationId: string, mode: string = 'chat'): Promise<JoinConsultationResponse> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${this.baseURL}/api/v1/consultation/${consultationId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ mode }),
    });

    if (!response.ok) {
      throw new Error(`Failed to join consultation: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentConsultation(): Promise<any> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${this.baseURL}/api/v1/consultation/customers/current`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to get current consultation: ${response.statusText}`);
    }

    return response.json();
  }

  async completeConsultation(consultationId: string): Promise<void> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${this.baseURL}/api/v1/consultation/${consultationId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to complete consultation: ${response.statusText}`);
    }
  }

  async submitFeedback(consultationId: string, rating: number, feedback: string): Promise<void> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${this.baseURL}/api/v1/consultation/${consultationId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        feedback_text: feedback,
        issues: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit feedback: ${response.statusText}`);
    }
  }
}

export const consultationService = new ConsultationService();
```

### Step 4: Create Firestore Chat Service

Create `lib/chat-service.ts`:
```typescript
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  Unsubscribe
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

interface Message {
  id?: string;
  sender_id: string;
  sender_type: 'customer' | 'guide';
  sender_name: string;
  type: 'text' | 'image' | 'system';
  content: string;
  image_url?: string;
  timestamp?: Timestamp;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  is_deleted: boolean;
}

interface Participant {
  user_id: string;
  user_type: 'customer' | 'guide';
  display_name: string;
  is_online: boolean;
  is_typing: boolean;
  typing_at?: Timestamp;
  last_seen: Timestamp;
  unread_count: number;
}

class ChatService {
  private activeListeners: Map<string, Unsubscribe> = new Map();

  async sendMessage(
    pairId: string,
    consultationId: string,
    message: Omit<Message, 'id' | 'timestamp' | 'status' | 'is_deleted'>
  ): Promise<string> {
    try {
      const messageData = {
        ...message,
        timestamp: serverTimestamp(),
        status: 'sent',
        is_deleted: false,
      };

      const messagesRef = collection(
        db,
        'consultations',
        pairId,
        'sessions',
        consultationId,
        'messages'
      );

      const docRef = await addDoc(messagesRef, messageData);
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  async sendImageMessage(
    pairId: string,
    consultationId: string,
    imageFile: File,
    senderInfo: {
      sender_id: string;
      sender_type: 'customer' | 'guide';
      sender_name: string;
    }
  ): Promise<string> {
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(
        storage,
        `consultations/${pairId}/images/${Date.now()}_${imageFile.name}`
      );

      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      // Send message with image URL
      const messageData = {
        sender_id: senderInfo.sender_id,
        sender_type: senderInfo.sender_type,
        sender_name: senderInfo.sender_name,
        type: 'image',
        content: '',
        image_url: imageUrl,
        timestamp: serverTimestamp(),
        status: 'sent',
        is_deleted: false,
      };

      const messagesRef = collection(
        db,
        'consultations',
        pairId,
        'sessions',
        consultationId,
        'messages'
      );

      const docRef = await addDoc(messagesRef, messageData);
      return docRef.id;
    } catch (error) {
      console.error('Error sending image message:', error);
      throw new Error('Failed to send image message');
    }
  }

  subscribeToMessages(
    pairId: string,
    consultationId: string,
    callback: (messages: Message[]) => void
  ): Unsubscribe {
    const messagesRef = collection(
      db,
      'consultations',
      pairId,
      'sessions',
      consultationId,
      'messages'
    );

    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });
      callback(messages.reverse());
    });

    // Store unsubscribe function for cleanup
    const key = `messages_${pairId}_${consultationId}`;
    this.activeListeners.set(key, unsubscribe);

    return unsubscribe;
  }

  subscribeToParticipant(
    pairId: string,
    consultationId: string,
    participantId: string,
    callback: (participant: Participant | null) => void
  ): Unsubscribe {
    const participantRef = doc(
      db,
      'consultations',
      pairId,
      'sessions',
      consultationId,
      'participants',
      participantId
    );

    const unsubscribe = onSnapshot(participantRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as Participant);
      } else {
        callback(null);
      }
    });

    // Store unsubscribe function for cleanup
    const key = `participant_${pairId}_${consultationId}_${participantId}`;
    this.activeListeners.set(key, unsubscribe);

    return unsubscribe;
  }

  async updatePresence(
    pairId: string,
    consultationId: string,
    participantId: string,
    isOnline: boolean
  ): Promise<void> {
    try {
      const participantRef = doc(
        db,
        'consultations',
        pairId,
        'sessions',
        consultationId,
        'participants',
        participantId
      );

      await updateDoc(participantRef, {
        is_online: isOnline,
        last_seen: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  async updateTypingStatus(
    pairId: string,
    consultationId: string,
    participantId: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      const participantRef = doc(
        db,
        'consultations',
        pairId,
        'sessions',
        consultationId,
        'participants',
        participantId
      );

      await updateDoc(participantRef, {
        is_typing: isTyping,
        typing_at: isTyping ? serverTimestamp() : null,
      });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }

  async markMessagesAsRead(
    pairId: string,
    consultationId: string,
    participantId: string
  ): Promise<void> {
    try {
      const participantRef = doc(
        db,
        'consultations',
        pairId,
        'sessions',
        consultationId,
        'participants',
        participantId
      );

      await updateDoc(participantRef, {
        unread_count: 0,
        last_read_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  async fetchMessageHistory(
    pairId: string,
    consultationId: string,
    lastVisibleDoc?: any,
    limit: number = 20
  ): Promise<{ messages: Message[]; lastVisible: any }> {
    try {
      const messagesRef = collection(
        db,
        'consultations',
        pairId,
        'sessions',
        consultationId,
        'messages'
      );

      let q = query(messagesRef, orderBy('timestamp', 'desc'), limit(limit));

      if (lastVisibleDoc) {
        q = query(q, startAfter(lastVisibleDoc));
      }

      const snapshot = await getDocs(q);
      const messages: Message[] = [];

      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });

      return {
        messages: messages.reverse(),
        lastVisible: snapshot.docs[snapshot.docs.length - 1],
      };
    } catch (error) {
      console.error('Error fetching message history:', error);
      return { messages: [], lastVisible: null };
    }
  }

  cleanup(): void {
    // Unsubscribe from all active listeners
    this.activeListeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.activeListeners.clear();
  }
}

export const chatService = new ChatService();
```

### Step 5: Create React Context for Chat State

Create `contexts/ChatContext.tsx`:
```typescript
'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { chatService } from '@/lib/chat-service';
import { consultationService } from '@/lib/consultation-service';
import { authService } from '@/lib/auth-service';

interface Message {
  id: string;
  sender_id: string;
  sender_type: 'customer' | 'guide';
  sender_name: string;
  type: 'text' | 'image' | 'system';
  content: string;
  image_url?: string;
  timestamp: any;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  is_deleted: boolean;
}

interface Participant {
  user_id: string;
  user_type: 'customer' | 'guide';
  display_name: string;
  is_online: boolean;
  is_typing: boolean;
  typing_at?: any;
  last_seen: any;
  unread_count: number;
}

interface ChatState {
  consultationId: string | null;
  pairId: string | null;
  messages: Message[];
  otherParticipant: Participant | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

type ChatAction =
  | { type: 'SET_CONSULTATION'; payload: { consultationId: string; pairId: string } }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_PARTICIPANT'; payload: Participant | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'CLEAR_CHAT' };

const initialState: ChatState = {
  consultationId: null,
  pairId: null,
  messages: [],
  otherParticipant: null,
  isLoading: false,
  error: null,
  isConnected: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONSULTATION':
      return {
        ...state,
        consultationId: action.payload.consultationId,
        pairId: action.payload.pairId,
        messages: [],
        otherParticipant: null,
      };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_PARTICIPANT':
      return { ...state, otherParticipant: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'CLEAR_CHAT':
      return { ...initialState };
    default:
      return state;
  }
}

interface ChatContextValue extends ChatState {
  initializeChat: (consultationId: string, pairId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendImage: (file: File) => Promise<void>;
  updateTypingStatus: (isTyping: boolean) => Promise<void>;
  leaveChat: () => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const initializeChat = async (consultationId: string, pairId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const userInfo = authService.getUserInfo();
      if (!userInfo) throw new Error('User not authenticated');

      // Set consultation info
      dispatch({
        type: 'SET_CONSULTATION',
        payload: { consultationId, pairId }
      });

      // Subscribe to messages
      chatService.subscribeToMessages(pairId, consultationId, (messages) => {
        dispatch({ type: 'SET_MESSAGES', payload: messages });
      });

      // Subscribe to other participant
      const otherUserId = userInfo.userType === 'customer'
        ? 'guide_placeholder' // Will be updated when guide joins
        : 'customer_placeholder';

      chatService.subscribeToParticipant(pairId, consultationId, otherUserId, (participant) => {
        dispatch({ type: 'SET_PARTICIPANT', payload: participant });
      });

      // Update user presence
      await chatService.updatePresence(pairId, consultationId, userInfo.userId.toString(), true);

      dispatch({ type: 'SET_CONNECTED', payload: true });
    } catch (error) {
      console.error('Error initializing chat:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize chat' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const sendMessage = async (content: string) => {
    if (!state.consultationId || !state.pairId) {
      dispatch({ type: 'SET_ERROR', payload: 'No active consultation' });
      return;
    }

    try {
      const userInfo = authService.getUserInfo();
      if (!userInfo) throw new Error('User not authenticated');

      await chatService.sendMessage(state.pairId, state.consultationId, {
        sender_id: userInfo.userId.toString(),
        sender_type: userInfo.userType,
        sender_name: 'User', // Get from profile
        type: 'text',
        content,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
    }
  };

  const sendImage = async (file: File) => {
    if (!state.consultationId || !state.pairId) {
      dispatch({ type: 'SET_ERROR', payload: 'No active consultation' });
      return;
    }

    try {
      const userInfo = authService.getUserInfo();
      if (!userInfo) throw new Error('User not authenticated');

      await chatService.sendImageMessage(state.pairId, state.consultationId, file, {
        sender_id: userInfo.userId.toString(),
        sender_type: userInfo.userType,
        sender_name: 'User', // Get from profile
      });
    } catch (error) {
      console.error('Error sending image:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send image' });
    }
  };

  const updateTypingStatus = async (isTyping: boolean) => {
    if (!state.consultationId || !state.pairId) return;

    try {
      const userInfo = authService.getUserInfo();
      if (!userInfo) return;

      await chatService.updateTypingStatus(
        state.pairId,
        state.consultationId,
        userInfo.userId.toString(),
        isTyping
      );
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  const leaveChat = async () => {
    try {
      if (state.consultationId && state.pairId) {
        const userInfo = authService.getUserInfo();
        if (userInfo) {
          await chatService.updatePresence(
            state.pairId,
            state.consultationId,
            userInfo.userId.toString(),
            false
          );
        }
      }

      chatService.cleanup();
      dispatch({ type: 'CLEAR_CHAT' });
    } catch (error) {
      console.error('Error leaving chat:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chatService.cleanup();
    };
  }, []);

  const value: ChatContextValue = {
    ...state,
    initializeChat,
    sendMessage,
    sendImage,
    updateTypingStatus,
    leaveChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
```

---

## Authentication Flow

### Complete Login Flow Implementation

1. **Login Page Component** (`components/auth/LoginPage.tsx`):
```typescript
'use client';
import { useState } from 'react';
import { authService } from '@/lib/auth-service';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.generateOTP({
        area_code: '+91',
        phone_number: phoneNumber,
        user_type: 'customer',
        purpose: 'login',
      });

      setRequestId(response.request_id);
      setShowOTP(true);
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');

    try {
      await authService.validateOTP({
        request_id: requestId,
        otp_code: otp,
        user_type: 'customer',
        device_info: {
          device_type: 'web',
          browser: navigator.userAgent,
          platform: navigator.platform,
        },
        phone_number: phoneNumber,
        area_code: '+91',
      });

      onLoginSuccess();
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign in to Astrokiran
          </h2>
        </div>

        {!showOTP ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || !phoneNumber}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="6-digit OTP"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              onClick={() => setShowOTP(false)}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
```

2. **Protected Route Component** (`components/auth/ProtectedRoute.tsx`):
```typescript
'use client';
import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth-service';
import LoginPage from './LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
}
```

---

## Chat Implementation

### Chat Component Structure

1. **Chat Container Component** (`components/chat/ChatContainer.tsx`):
```typescript
'use client';
import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';

export default function ChatContainer() {
  const {
    consultationId,
    pairId,
    isLoading,
    error,
    isConnected,
    otherParticipant,
    initializeChat
  } = useChat();

  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // This would be called when consultation is joined
    if (consultationId && pairId) {
      initializeChat(consultationId, pairId);
    }
  }, [consultationId, pairId]);

  const handleTypingStart = () => {
    // Debounce typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Update typing status immediately
    updateTypingStatus(true);

    // Stop typing indicator after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 1000);
  };

  const handleTypingStop = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Chat Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!consultationId || !pairId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500 text-center">
          <p className="text-lg">No active consultation</p>
          <p>Please start a consultation to begin chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <ChatHeader
        participant={otherParticipant}
        isConnected={isConnected}
      />

      <MessageList />

      <MessageInput
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
}
```

2. **Message List Component** (`components/chat/MessageList.tsx`):
```typescript
'use client';
import { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import MessageBubble from './MessageBubble';

export default function MessageList() {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
```

3. **Message Bubble Component** (`components/chat/MessageBubble.tsx`):
```typescript
'use client';
import { useChat } from '@/contexts/ChatContext';
import { authService } from '@/lib/auth-service';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: {
    id: string;
    sender_id: string;
    sender_type: 'customer' | 'guide';
    sender_name: string;
    type: 'text' | 'image' | 'system';
    content: string;
    image_url?: string;
    timestamp: any;
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    is_deleted: boolean;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const userInfo = authService.getUserInfo();
  const isOwnMessage = userInfo?.userId.toString() === message.sender_id;

  const bubbleClass = isOwnMessage
    ? 'bg-orange-500 text-white ml-auto'
    : 'bg-gray-200 text-gray-800 mr-auto';

  const containerClass = `flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`;

  if (message.is_deleted) {
    return (
      <div className={containerClass}>
        <div className="text-xs text-gray-500 italic">Message deleted</div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
        <div className={`rounded-lg px-4 py-2 ${bubbleClass}`}>
          {message.type === 'text' && (
            <p className="text-sm">{message.content}</p>
          )}

          {message.type === 'image' && message.image_url && (
            <div className="space-y-2">
              <img
                src={message.image_url}
                alt="Shared image"
                className="rounded-lg max-w-full h-auto"
              />
              {message.content && (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          )}

          {message.type === 'system' && (
            <p className="text-xs italic">{message.content}</p>
          )}
        </div>

        <div className={`text-xs text-gray-500 mt-1 ${
          isOwnMessage ? 'text-right' : 'text-left'
        }`}>
          {message.timestamp && formatDistanceToNow(message.timestamp.toDate(), {
            addSuffix: true,
          })}

          {isOwnMessage && (
            <span className="ml-2">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && '✓✓'}
              {message.status === 'failed' && '✗'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

4. **Message Input Component** (`components/chat/MessageInput.tsx`):
```typescript
'use client';
import { useState, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';

interface MessageInputProps {
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export default function MessageInput({ onTypingStart, onTypingStop }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, sendImage } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSending) return;

    setIsSending(true);
    onTypingStop();

    try {
      await sendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Image size should be less than 10MB');
      return;
    }

    setIsSending(true);
    try {
      await sendImage(file);
    } catch (error) {
      console.error('Failed to send image:', error);
      alert('Failed to send image. Please try again.');
    } finally {
      setIsSending(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (e.target.value.trim()) {
      onTypingStart();
    } else {
      onTypingStop();
    }
  };

  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={isSending}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />

        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
```

5. **Chat Header Component** (`components/chat/ChatHeader.tsx`):
```typescript
'use client';
import { useChat } from '@/contexts/ChatContext';

interface ChatHeaderProps {
  participant: {
    user_id: string;
    user_type: 'customer' | 'guide';
    display_name: string;
    is_online: boolean;
    is_typing: boolean;
    last_seen: any;
    unread_count: number;
  } | null;
  isConnected: boolean;
}

export default function ChatHeader({ participant, isConnected }: ChatHeaderProps) {
  const getStatusColor = () => {
    if (!isConnected) return 'bg-gray-400';
    if (participant?.is_online) return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Connecting...';
    if (participant?.is_typing) return 'Typing...';
    if (participant?.is_online) return 'Online';
    return 'Offline';
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
            {participant?.display_name?.charAt(0) || '?'}
          </div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor()}`}></div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            {participant?.display_name || 'Astrologer'}
          </h3>
          <p className="text-sm text-gray-500">
            {getStatusText()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs text-gray-500">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
}
```

---

## Real-time Features

### Presence and Typing Indicators

1. **Presence Management** (already integrated in ChatService):
```typescript
// In ChatContext
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // User switched tab - set to away
      updatePresence(false);
    } else {
      // User returned to tab - set to online
      updatePresence(true);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [consultationId, pairId]);

const updatePresence = async (isOnline: boolean) => {
  if (!consultationId || !pairId) return;

  try {
    await chatService.updatePresence(pairId, consultationId, userId, isOnline);
  } catch (error) {
    console.error('Error updating presence:', error);
  }
};
```

2. **Typing Indicators** (already integrated in MessageInput):
```typescript
// Debounced typing indicators
const handleTypingStart = () => {
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  updateTypingStatus(true);

  // Stop typing after 1 second of inactivity
  typingTimeoutRef.current = setTimeout(() => {
    updateTypingStatus(false);
  }, 1000);
};
```

### Message Read Receipts

```typescript
// Add to ChatService
async markMessageAsRead(
  pairId: string,
  consultationId: string,
  messageId: string
): Promise<void> {
  try {
    const messageRef = doc(
      db,
      'consultations',
      pairId,
      'sessions',
      consultationId,
      'messages',
      messageId
    );

    await updateDoc(messageRef, {
      status: 'read',
      read_at: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}
```

### Push Notifications (Optional)

```typescript
// Initialize Firebase Cloud Messaging
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export const initializeFCM = async () => {
  try {
    const messaging = getMessaging();

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return;
    }

    // Get FCM token
    const token = await getToken(messaging);
    console.log('FCM Token:', token);

    // Send token to backend
    await sendFCMTokenToBackend(token);

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      // Show in-app notification
    });

  } catch (error) {
    console.error('Error initializing FCM:', error);
  }
};
```

---

## Error Handling

### Comprehensive Error Handling Strategy

1. **Network Error Handling**:
```typescript
const handleNetworkError = (error: any) => {
  if (error.code === 'unavailable' || error.code === 'timeout') {
    // Network connection lost
    dispatch({
      type: 'SET_ERROR',
      payload: 'Network connection lost. Messages will be sent when connection is restored.'
    });
  } else if (error.code === 'permission-denied') {
    // Permission error
    dispatch({
      type: 'SET_ERROR',
      payload: 'You do not have permission to access this chat.'
    });
  } else {
    // Generic error
    dispatch({
      type: 'SET_ERROR',
      payload: 'An error occurred. Please try again.'
    });
  }
};
```

2. **Retry Mechanism**:
```typescript
const retryOperation = async (
  operation: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};
```

3. **Error Boundaries**:
```typescript
'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ChatErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chat Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChatErrorBoundary;
```

---

## Testing

### Testing Strategy

1. **Unit Tests**:
```typescript
// __tests__/chat-service.test.ts
import { chatService } from '@/lib/chat-service';

describe('ChatService', () => {
  beforeEach(() => {
    // Clear all listeners
    chatService.cleanup();
  });

  test('sendMessage should send a message to Firestore', async () => {
    const pairId = 'test_pair_id';
    const consultationId = 'test_consultation_id';
    const message = {
      sender_id: 'test_user_id',
      sender_type: 'customer' as const,
      sender_name: 'Test User',
      type: 'text' as const,
      content: 'Test message',
    };

    const messageId = await chatService.sendMessage(pairId, consultationId, message);

    expect(messageId).toBeDefined();
    expect(typeof messageId).toBe('string');
  });
});
```

2. **Integration Tests**:
```typescript
// __tests__/chat-integration.test.ts
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ChatProvider, useChat } from '@/contexts/ChatContext';

function TestComponent() {
  const { sendMessage, messages } = useChat();

  return (
    <div>
      <button onClick={() => sendMessage('Test message')}>
        Send Message
      </button>
      <div data-testid="messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>
    </div>
  );
}

test('chat integration works end-to-end', async () => {
  render(
    <ChatProvider>
      <TestComponent />
    </ChatProvider>
  );

  const sendButton = screen.getByText('Send Message');
  fireEvent.click(sendButton);

  await waitFor(() => {
    expect(screen.getByTestId('messages')).toHaveTextContent('Test message');
  });
});
```

3. **Manual Testing Checklist**:
- [ ] User can login with OTP
- [ ] Consultation creation works
- [ ] Chat interface loads correctly
- [ ] Messages send and receive in real-time
- [ ] Image sharing works
- [ ] Presence indicators show correct status
- [ ] Typing indicators work
- [ ] Offline mode queues messages
- [ ] Error states display correctly
- [ ] Mobile responsive design works

---

## Deployment

### Production Deployment Steps

1. **Environment Variables Setup**:
```env
# Production Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=production_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=production_project_id

# Production Backend URLs
NEXT_PUBLIC_AUTH_GATEWAY_URL=https://api.astrokiran.com/auth
NEXT_PUBLIC_CONSULTATION_API_URL=https://api.astrokiran.com/consultation
NEXT_PUBLIC_CUSTOMER_API_URL=https://api.astrokiran.com/customer

# Production Agora
NEXT_PUBLIC_AGORA_APP_ID=production_agora_app_id

# Production AWS
AWS_S3_BUCKET_NAME=astrokiran-production-bucket
AWS_REGION=ap-south-1
```

2. **Firebase Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access consultations they're part of
    match /consultations/{pairId}/sessions/{consultationId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in get(/databases/$(database)/documents/consultations/$(pairId)/sessions/$(consultationId))/data.participants.keys();

      // Messages subcollection
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }

      // Participants subcollection
      match /participants/{participantId} {
        allow read, write: if request.auth != null && request.auth.uid == participantId;
      }
    }

    // Users can only read/write their own profile data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. **Build and Deploy**:
```bash
# Build the application
npm run build

# Test production build locally
npm run start

# Deploy to production (using your preferred method)
# For Vercel:
vercel --prod

# For Netlify:
netlify deploy --prod --dir=.next

# For AWS Amplify:
amplify publish
```

---

## Troubleshooting

### Common Issues and Solutions

1. **CORS Errors**:
   - Ensure backend services have correct CORS configuration
   - Check that frontend URL is whitelisted in backend
   - Verify API base URLs are correct

2. **Firebase Authentication Issues**:
   - Check Firebase configuration in `.env.local`
   - Ensure Firebase project is set up for web
   - Verify Firebase SDK versions are compatible

3. **Real-time Updates Not Working**:
   - Check Firestore security rules
   - Verify Firebase project settings
   - Ensure no network connectivity issues
   - Check browser console for Firebase errors

4. **Messages Not Sending**:
   - Verify user is authenticated
   - Check consultation is active
   - Ensure Firestore write permissions
   - Check network connectivity

5. **Image Upload Failures**:
   - Check Firebase Storage configuration
   - Verify file size limits
   - Ensure proper file type validation
   - Check Storage security rules

### Debugging Tools

1. **Browser Console**:
   ```javascript
   // Check Firebase connection
   console.log('Firebase app:', firebase.app());

   // Check auth state
   firebase.auth().onAuthStateChanged(user => {
     console.log('Auth state changed:', user);
   });

   // Check Firestore connection
   firebase.firestore().enableNetwork()
     .then(() => console.log('Firestore enabled'))
     .catch(error => console.error('Firestore error:', error));
   ```

2. **Firebase Console**:
   - Check Firestore database for documents
   - Verify security rules are working
   - Monitor usage and performance

3. **Network Tab**:
   - Monitor API calls to backend
   - Check for failed requests
   - Verify response times

### Performance Optimization

1. **Message Pagination**:
   ```typescript
   // Load messages in batches of 20
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [hasMore, setHasMore] = useState(true);

   const loadMoreMessages = async () => {
     if (loading || !hasMore) return;

     setLoading(true);
     const lastMessage = messages[messages.length - 1];

     const { messages: newMessages, lastVisible } = await chatService.fetchMessageHistory(
       pairId,
       consultationId,
       lastMessage,
       20
     );

     if (newMessages.length === 0) {
       setHasMore(false);
     } else {
       setMessages(prev => [...newMessages, ...prev]);
     }

     setLoading(false);
   };
   ```

2. **Image Optimization**:
   ```typescript
   // Compress images before upload
   const compressImage = (file: File): Promise<File> => {
     return new Promise((resolve) => {
       const reader = new FileReader();
       reader.onload = (e) => {
         const img = new Image();
         img.onload = () => {
           const canvas = document.createElement('canvas');
           const ctx = canvas.getContext('2d')!;

           // Calculate new dimensions (max 1200px)
           let { width, height } = img;
           if (width > 1200 || height > 1200) {
             const ratio = Math.min(1200 / width, 1200 / height);
             width *= ratio;
             height *= ratio;
           }

           canvas.width = width;
           canvas.height = height;
           ctx.drawImage(img, 0, 0, width, height);

           canvas.toBlob(resolve, 'image/jpeg', 0.8);
         };
         img.src = e.target?.result as string;
       };
       reader.readAsDataURL(file);
     });
   };
   ```

3. **Connection Management**:
   ```typescript
   // Automatic reconnection
   useEffect(() => {
     const handleOnline = () => {
       console.log('Connection restored');
       // Re-initialize chat if needed
     };

     const handleOffline = () => {
       console.log('Connection lost');
       // Show offline indicator
     };

     window.addEventListener('online', handleOnline);
     window.addEventListener('offline', handleOffline);

     return () => {
       window.removeEventListener('online', handleOnline);
       window.removeEventListener('offline', handleOffline);
     };
   }, []);
   ```

---

## Conclusion

This comprehensive guide provides everything needed to integrate Firestore-based real-time chat functionality into the Astrokiran website. The implementation leverages the existing backend infrastructure, ensuring consistency with the mobile apps while providing a seamless web experience.

### Key Success Factors:
1. **Proper Authentication** - Use existing OTP-based auth system
2. **Real-time Communication** - Leverage Firestore and existing consultation flow
3. **Error Handling** - Comprehensive error management for production use
4. **Performance Optimization** - Efficient message loading and image handling
5. **Security** - Proper Firebase security rules and authentication

### Next Steps:
1. Implement the authentication flow
2. Create the consultation booking interface
3. Build the chat components
4. Test thoroughly across different scenarios
5. Deploy to production with proper monitoring

The integration strategy outlined here ensures a robust, scalable, and maintainable chat system that will provide excellent user experience while maintaining consistency with the existing mobile applications.