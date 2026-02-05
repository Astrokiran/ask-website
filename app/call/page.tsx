'use client';

import { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, Loader2, User, Hand, Image as ImageIcon, MicOff, Mic, Volume2 } from "lucide-react"
import Image from "next/image"
import { ImageViewer } from '@/components/ImageViewer/ImageViewer';

// Types for Exotel SDK events
interface ExotelSDKEvent {
  event_type: string;
  user_id: string;
  consultation_id: string;
  timestamp: string;
  event_category?: string;
  customer_phone?: string;
  call_sid?: string;
  event_data?: any;
}

// Type for data injected from mobile app via injectedJavaScript
interface InjectedAppData {
  customerHandImages?: string[];
  customerName?: string;
  // customerImage?: string;
  guideName?: string;
  guideImage?: string;
  serviceType?: string;
  language?: string;
  theme?: 'light' | 'dark';
  remainingSeconds?: number;
  totalSeconds?: number;
  isPromotional?: boolean;
  access_token?: string;
}

interface ExotelCallState {
  status: 'initializing' | 'registering' | 'registered' | 'calling' | 'connected' | 'ended' | 'error';
  callDuration: number;
  error?: string;
}

function ExotelCallPageContent() {
  const searchParams = useSearchParams();

  const token = searchParams ? searchParams.get('token') : '';
  const userId = searchParams ? searchParams.get('user_id') : '';
  const customerPhone = searchParams ? searchParams.get('customer_phone') : '';
  const consultationId = searchParams ? searchParams.get('consultation_id') : '';

  const [callState, setCallState] = useState<ExotelCallState>({
    status: 'initializing',
    callDuration: 0,
  });

  const [eventLog, setEventLog] = useState<string[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [injectedData, setInjectedData] = useState<InjectedAppData>({});
  const [isWebView, setIsWebView] = useState(false);
  const [remaining, setRemaining] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [handImageUrl, setHandImageUrl] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const crmWebSDKRef = useRef<any>(null);
  const webPhoneRef = useRef<any>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sentEventsRef = useRef<Set<string>>(new Set());

  // Log utility (memoized)
  const addLog = useCallback((message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}${data ? ` ${JSON.stringify(data)}` : ''}`;
    setEventLog(prev => [...prev.slice(-49), logEntry]); // Keep last 50 logs
    console.log(message, data);
  }, []);

  // Send message back to mobile app via PostMessage (memoized)
  const sendMessageToApp = useCallback((type: string, data: any = {}) => {
    const hasReactNativeWebView = !!(window as any).ReactNativeWebView;

    if (!hasReactNativeWebView) {
      // Silently skip if not in webview (running in browser)
      return;
    }

    if (!isWebView) {
      addLog('⚠️ sendMessageToApp: ReactNativeWebView found but isWebView flag is false', {
        type,
        dataKeys: Object.keys(data)
      });
      return;
    }

    try {
      const messagePayload = {
        type,
        ...data,
        timestamp: new Date().toISOString()
      };

      const messageString = JSON.stringify(messagePayload);

      // Log message details
      addLog('📤 Sending to mobile app', {
        type,
        dataKeys: Object.keys(data),
        messageLength: messageString.length,
        timestamp: messagePayload.timestamp
      });

      (window as any).ReactNativeWebView.postMessage(messageString);

    } catch (error) {
      const postMessageError = error instanceof Error ? error.message : String(error);
      addLog('❌ Failed to send message to app', {
        type,
        error: postMessageError,
        dataKeys: Object.keys(data),
        stack: error instanceof Error ? error.stack : undefined
      });
      console.error('sendMessageToApp failed:', error);
    }
  }, [isWebView, addLog]);

  // Send SDK event to backend with deduplication
  const sendSDKEvent = async (eventType: string, eventData: any = {}) => {
    const payload: ExotelSDKEvent = {
      event_type: eventType,
      user_id: userId,
      consultation_id: consultationId,
      timestamp: new Date().toISOString(),
      event_category: 'call',
      customer_phone: customerPhone,
      ...eventData,
    };

    // Create a unique key for deduplication based on event_type and consultation_id
    const deduplicationKey = `${eventType}_${consultationId}`;

    // Check if we've already sent this event type for this consultation
    if (sentEventsRef.current.has(deduplicationKey)) {
      console.log('[Webhook] Skipping duplicate event:', deduplicationKey);
      return;
    }

    // Mark this event as sent
    sentEventsRef.current.add(deduplicationKey);

    console.log('[Webhook] Sending webhook:', {
      type: eventType,
      deduplicationKey,
      url: '/api/webhooks/exotel',
      payloadKeys: Object.keys(payload)
    });

    try {
      // Use relative URL - will be proxied to backend via Next.js API route
      const fetchStartTime = Date.now();
      const response = await fetch('/api/webhooks/exotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const fetchDuration = Date.now() - fetchStartTime;

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read response');
        console.error('[Webhook] Backend error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          fetchDuration,
          eventType
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('[Webhook] Backend success:', {
        eventType,
        fetchDuration,
        result
      });

    } catch (error) {
      // Log webhook errors to console only - don't break the call flow
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('[Webhook] Failed (non-critical):', {
        eventType,
        error: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
        payloadKeys: Object.keys(payload)
      });

      // Remove from sent events on failure so it can be retried
      sentEventsRef.current.delete(deduplicationKey);
      addLog('⚠️ Webhook send failed (retry possible)', {
        eventType,
        error: errorMsg
      });
    }
  };

  // Parse event type from various formats
  const parseEventType = (event: any): string => {
    if (typeof event === 'string') {
      return event;
    }
    if (Array.isArray(event) && event.length > 0) {
      return event[0];
    }
    if (event?.type) {
      return event.type;
    }
    if (event?.eventType) {
      return event.eventType;
    }
    return 'unknown';
  };

  // Call event handler
  const handleCallEvents = (event: any) => {
    const eventType = parseEventType(event);
    addLog('📞 Call event received', {
      eventType,
      rawEvent: event,
      eventTypeFrom: typeof event,
      isArray: Array.isArray(event),
      timestamp: new Date().toISOString()
    });

    // Notify mobile app about call events
    sendMessageToApp('call_event', {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      raw_event: event
    });

    // Send to backend (fire and forget - don't let failures break the call flow)
    sendSDKEvent(eventType || 'call_event', {
      event_category: 'call',
      event_data: typeof event === 'object' ? event : { event }
    }).catch(err => {
      // Silently ignore webhook errors - they shouldn't break the call
      console.warn('❌ Call event webhook failed (ignoring):', err);
    });

    // Handle specific events
    if (eventType === 'incoming' || eventType === 'i_new_call') {
      // AUTO-ANSWER the incoming call from Exotel (this is the callback flow)
      addLog('📞 Incoming call detected! Auto-answering in 500ms...', {
        event: eventType,
        hasWebPhone: !!webPhoneRef.current,
        hasAcceptCall: typeof webPhoneRef.current?.AcceptCall === 'function'
      });
      setCallState({ status: 'calling', callDuration: 0 });

      // Notify app about incoming call
      sendMessageToApp('call_incoming', {
        message: 'Incoming call from Exotel, auto-answering...',
        event_type: eventType
      });

      // Automatically accept the call after a short delay
      setTimeout(async () => {
        try {
          addLog('📞 Calling AcceptCall()...', {
            hasWebPhoneRef: !!webPhoneRef.current,
            hasAcceptCallMethod: !!webPhoneRef.current?.AcceptCall
          });

          if (!webPhoneRef.current?.AcceptCall) {
            throw new Error('AcceptCall method not available on WebPhone instance');
          }

          await webPhoneRef.current.AcceptCall();
          addLog('✅ AcceptCall() succeeded - waiting for connection event');

          sendSDKEvent('call_auto_answered', {
            event_category: 'call_control',
            action: 'auto_accept',
            success: true
          }).catch(err => console.warn('❌ Auto-answer webhook failed (ignoring):', err));

          sendMessageToApp('call_auto_answered', {
            success: true,
            timestamp: new Date().toISOString()
          });

        } catch (err) {
          const acceptError = err instanceof Error ? err.message : String(err);
          addLog('❌ Auto-answer AcceptCall() failed:', {
            error: acceptError,
            stack: err instanceof Error ? err.stack : undefined
          });

          sendSDKEvent('call_auto_accept_failed', {
            event_category: 'call_control',
            action: 'auto_accept',
            error: acceptError
          }).catch(webhookErr => console.warn('❌ Webhook failed (ignoring):', webhookErr));

          sendMessageToApp('call_error', {
            error: acceptError,
            step: 'auto_accept'
          });
        }
      }, 500);

    } else if (eventType === 'connected') {
      addLog('⚡ Call connected - starting conversation', {
        timestamp: new Date().toISOString()
      });
      setCallState({ status: 'connected', callDuration: 0 });

      // Notify app that call is connected
      sendMessageToApp('call_connected', {
        message: 'Call connected successfully',
        timestamp: new Date().toISOString()
      });

      // Start call duration timer
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => {
          const newDuration = prev + 1;
          // Log every 30 seconds
          if (newDuration % 30 === 0) {
            addLog('⏱️ Call duration:', formatDuration(newDuration));
          }
          return newDuration;
        });
      }, 1000);

      sendSDKEvent('call_connected', {
        state: 'connected',
        timestamp: new Date().toISOString()
      }).catch(err => console.warn('❌ Connected webhook failed (ignoring):', err));
    } else if (eventType === 'callEnded') {
      addLog('✗ Call ended event received', {
        duration_seconds: callDuration,
        formatted_duration: formatDuration(callDuration),
        timestamp: new Date().toISOString()
      });
      setCallState({ status: 'ended', callDuration: callDuration });

      // Notify app that call ended
      sendMessageToApp('call_ended', {
        duration_seconds: callDuration,
        formatted_duration: formatDuration(callDuration),
        message: 'Call has ended',
        timestamp: new Date().toISOString()
      });

      // Stop duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
        addLog('⏱️ Duration timer stopped');
      }

      sendSDKEvent('callEnded', {
        event: 'callEnded',
        duration_seconds: callDuration,
        timestamp: new Date().toISOString()
      }).catch(err => console.warn('❌ Call ended webhook failed (ignoring):', err));
    } else {
      addLog('ℹ️ Unhandled call event type', {
        eventType,
        rawEvent: event
      });
    }
  };

  // Registration event handler
  const handleRegistrationEvents = (event: any) => {
    const eventType = parseEventType(event);
    addLog('📝 Registration event received', {
      eventType,
      rawEvent: event,
      eventDataType: typeof event,
      isArray: Array.isArray(event),
      timestamp: new Date().toISOString()
    });

    let registered = false;
    if (typeof event === 'string') {
      registered = eventType === 'registered' || eventType === 'connected';
      addLog('📝 Parsed string event', { eventType, registered });
    } else if (Array.isArray(event)) {
      registered = event[0] === 'registered' || event[0] === 'connected';
      addLog('📝 Parsed array event', { firstElement: event[0], registered });
    } else {
      registered = event?.registered || false;
      addLog('📝 Parsed object event', { hasRegistered: !!event?.registered, registered });
    }

    const regEventType = registered ? 'registered' : 'unregistered';

    // Notify app about registration events
    sendMessageToApp('registration_event', {
      event_type: regEventType,
      registered,
      timestamp: new Date().toISOString()
    });

    // Send to backend (fire and forget)
    sendSDKEvent(regEventType, {
      event_category: 'registration',
      registered,
      timestamp: new Date().toISOString()
    }).catch(err => console.warn('❌ Registration webhook failed (ignoring):', err));

    if (registered) {
      addLog('✅ SIP device registration successful - initiating auto-call', {
        customerPhone,
        timestamp: new Date().toISOString()
      });
      setCallState({ status: 'registered', callDuration: 0 });

      // Notify app about successful registration
      sendMessageToApp('sip_registered', {
        message: 'SIP device registered successfully',
        customer_phone: customerPhone,
        timestamp: new Date().toISOString()
      });

      // AUTO-CALL: Automatically initiate call after successful registration
      addLog('📞 Scheduling auto-call to customer in 500ms...', {
        customerPhone,
        hasWebPhone: !!webPhoneRef.current,
        hasMakeCall: typeof webPhoneRef.current?.MakeCall === 'function'
      });

      // Notify app that call will be initiated
      sendMessageToApp('call_initiating', {
        customer_phone: customerPhone,
        message: 'Initiating call to customer...',
        auto_initiated: true
      });

      // Small delay to ensure registration is fully processed
      setTimeout(async () => {
        try {
          if (!webPhoneRef.current) {
            throw new Error('WebPhone instance not available');
          }

          if (typeof webPhoneRef.current.MakeCall !== 'function') {
            throw new Error('MakeCall method not available on WebPhone instance');
          }

          addLog('📞 Calling MakeCall()...', {
            customerPhone,
            timestamp: new Date().toISOString()
          });

          setCallState({ status: 'calling', callDuration: 0 });

          const makeCallResult = await webPhoneRef.current.MakeCall(customerPhone, (result: any) => {
            addLog('📞 MakeCall callback result:', {
              result,
              resultType: typeof result,
              timestamp: new Date().toISOString()
            });
          });

          addLog('✅ MakeCall() invoked successfully', {
            result: makeCallResult,
            resultType: typeof makeCallResult
          });

          await sendSDKEvent('call_initiated', {
            customer_phone: customerPhone,
            call_type: 'outbound',
            auto_initiated: true,
            result: typeof makeCallResult,
            timestamp: new Date().toISOString()
          });

          // Notify app that call was initiated
          sendMessageToApp('call_initiated', {
            customer_phone: customerPhone,
            call_type: 'outbound',
            auto_initiated: true,
            success: true,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          const makeCallError = error instanceof Error ? error.message : String(error);
          addLog('❌ Auto-call MakeCall() failed:', {
            error: makeCallError,
            stack: error instanceof Error ? error.stack : undefined,
            customerPhone,
            hasWebPhone: !!webPhoneRef.current,
            timestamp: new Date().toISOString()
          });

          setCallState({ status: 'error', callDuration: 0, error: makeCallError });

          await sendSDKEvent('call_initiation_failed', {
            event_category: 'call_control',
            action: 'make_call',
            customer_phone: customerPhone,
            error: makeCallError,
            auto_initiated: true,
            timestamp: new Date().toISOString()
          });

          sendMessageToApp('call_error', {
            error: makeCallError,
            step: 'make_call',
            customer_phone: customerPhone,
            timestamp: new Date().toISOString()
          });
        }
      }, 500);
    } else {
      addLog('❌ SIP device registration failed or unregistered', {
        eventType,
        rawEvent: event,
        timestamp: new Date().toISOString()
      });
      setCallState({ status: 'error', callDuration: 0, error: 'Registration failed' });

      // Send registration failure event
      sendSDKEvent('registration_failed', {
        event_category: 'registration',
        registered: false,
        event_type: eventType,
        raw_event: event,
        error: 'SIP device not registered',
        timestamp: new Date().toISOString()
      }).catch(err => console.warn('❌ Registration failed webhook failed (ignoring):', err));
    }
  };

  // Session event handler
  const handleSessionEvents = (event: any) => {
    const eventType = parseEventType(event);
    addLog('🔄 Session event received', {
      eventType,
      rawEvent: event,
      eventDataType: typeof event,
      isArray: Array.isArray(event),
      timestamp: new Date().toISOString()
    });

    // Update UI for specific session states
    if (eventType === 'calling') {
      addLog('🔄 Session state: calling', { timestamp: new Date().toISOString() });
      setCallState({ status: 'calling', callDuration: 0 });
    } else if (eventType === 'ringing') {
      addLog('🔄 Session state: ringing', { timestamp: new Date().toISOString() });
      setCallState({ status: 'calling', callDuration: 0 });
    } else if (eventType === 'failed') {
      addLog('❌ Session state: failed', {
        rawEvent: event,
        timestamp: new Date().toISOString()
      });
      setCallState({ status: 'error', callDuration: 0, error: 'Call failed' });
    }

    // Send important session states to backend (fire and forget)
    const importantStates = ['calling', 'ringing', 'connected', 'ended', 'failed', 'rejected', 'busy'];
    if (importantStates.includes(eventType)) {
      sendSDKEvent(`session_${eventType}`, {
        event_category: 'session',
        session_state: eventType,
        raw_event: event,
        timestamp: new Date().toISOString()
      }).catch(err => console.warn('❌ Session webhook failed (ignoring):', err));
    }

    // Notify mobile app about session events
    sendMessageToApp('session_event', {
      event_type: eventType,
      timestamp: new Date().toISOString()
    });
  };

  // Read injected data from mobile app on mount
  useEffect(() => {
    addLog('🚀 Component mounting - checking environment...', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent?.substring(0, 100)
    });

    // Check if running in React Native WebView
    const hasReactNativeWebView = !!(window as any).ReactNativeWebView;
    const hasPostMessage = typeof (window as any).ReactNativeWebView?.postMessage === 'function';
    setIsWebView(hasReactNativeWebView);

    addLog('📱 Environment check complete', {
      hasReactNativeWebView,
      hasPostMessage,
      isWebView: hasReactNativeWebView,
      windowKeys: Object.keys(window).filter(k => k.includes('webview') || k.includes('WebView') || k.includes('ReactNative'))
    });

    if (hasReactNativeWebView) {
      addLog('✅ Running in React Native WebView environment');
    } else {
      addLog('ℹ️ Running in standard browser environment (not WebView)');
    }

    // Read data injected via injectedJavaScript
    const injectedAppData = (window as any).__INJECTED_DATA__;

    if (injectedAppData) {
      const dataKeys = Object.keys(injectedAppData);
      addLog('✅ Found injected data from mobile app', {
        keys: dataKeys,
        handImagesCount: injectedAppData.customerHandImages?.length || 0,
        hasCustomerName: !!injectedAppData.customerName,
        // hasCustomerImage: !!injectedAppData.customerImage,
        hasGuideName: !!injectedAppData.guideName,
        serviceType: injectedAppData.serviceType,
        language: injectedAppData.language,
        theme: injectedAppData.theme,
        isPromotional: injectedAppData.isPromotional,
        hasAccessToken: !!injectedAppData.access_token,
        accessTokenLength: injectedAppData.access_token?.length || 0,
        remainingSeconds: injectedAppData.remainingSeconds,
        totalSeconds: injectedAppData.totalSeconds
      });

      setInjectedData(injectedAppData);

      // Set remaining time from injected data
      if (injectedAppData.remainingSeconds !== undefined) {
        setRemaining(injectedAppData.remainingSeconds);
        addLog('⏱️ Timer initialized from injected data', {
          remainingSeconds: injectedAppData.remainingSeconds,
          totalSeconds: injectedAppData.totalSeconds
        });
      }

      // Send acknowledgment to app
      sendMessageToApp('data_received', {
        keys: dataKeys,
        handImagesCount: injectedAppData.customerHandImages?.length || 0,
        timestamp: new Date().toISOString()
      });

      // Log hand images in detail
      if (injectedAppData.customerHandImages?.length > 0) {
        addLog(`📸 Found ${injectedAppData.customerHandImages.length} hand image(s)`, {
          hasLeft: !!injectedAppData.customerHandImages[0],
          hasRight: !!injectedAppData.customerHandImages[1],
          leftUrlLength: injectedAppData.customerHandImages[0]?.length || 0,
          rightUrlLength: injectedAppData.customerHandImages[1]?.length || 0
        });
      }
    } else {
      addLog('ℹ️ No injected data found from mobile app', {
        reason: 'Running in browser or data not injected yet',
        timestamp: new Date().toISOString()
      });
    }

    // Listen for messages from app (optional - for bidirectional communication)
    const handleMessage = (event: MessageEvent) => {
      addLog('📥 Message received from app (postMessage)', {
        dataType: typeof event.data,
        isString: typeof event.data === 'string',
        origin: event.origin,
        timestamp: new Date().toISOString()
      });

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        addLog('📥 Parsed message from app', {
          type: data.type,
          dataKeys: Object.keys(data),
          timestamp: new Date().toISOString()
        });

        // Handle specific message types from app
        if (data.type === 'update_data') {
          addLog('📝 Updating injected data from app');
          setInjectedData(prev => {
            const updated = { ...prev, ...data.payload };
            addLog('✅ Injected data updated', {
              oldKeys: Object.keys(prev),
              newKeys: Object.keys(updated),
              addedKeys: Object.keys(data.payload)
            });
            return updated;
          });
          sendMessageToApp('data_updated', {
            keys: Object.keys(data.payload),
            timestamp: new Date().toISOString()
          });
        } else if (data.type === 'hangup_call') {
          addLog('📞 Hangup requested from app');
          hangup();
        } else {
          addLog('ℹ️ Received unhandled message type from app', { type: data.type });
        }
      } catch (err) {
        const parseError = err instanceof Error ? err.message : String(err);
        addLog('❌ Failed to parse message from app', {
          error: parseError,
          rawData: event.data,
          stack: err instanceof Error ? err.stack : undefined
        });
      }
    };

    addLog('📡 Adding message event listener');
    window.addEventListener('message', handleMessage);

    return () => {
      addLog('🧹 Component unmounting - removing message listener');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Initialize Exotel SDK on mount
  useEffect(() => {
    if (!token || !userId || !customerPhone) {
      const error = 'Missing required parameters';
      addLog('❌ Error: Missing required parameters', { hasToken: !!token, hasUserId: !!userId, hasCustomerPhone: !!customerPhone });
      setCallState({ status: 'error', callDuration: 0, error });

      // Send error to backend
      sendSDKEvent('missing_parameters', {
        event_category: 'initialization',
        error,
        params: { hasToken: !!token, hasUserId: !!userId, hasCustomerPhone: !!customerPhone }
      }).catch(err => console.warn('Webhook failed (ignoring):', err));
      return;
    }

    addLog('🚀 Starting SDK initialization process', {
      tokenLength: token?.length,
      userId,
      customerPhone,
      consultationId,
      timestamp: new Date().toISOString()
    });
    setCallState({ status: 'registering', callDuration: 0 });

    const initializeSDK = async () => {
      try {
        // Step 1: Import ExotelCRMWebSDK
        addLog('📦 Step 1: Importing @exotel-npm-dev/exotel-ip-calling-crm-websdk...');
        let ExotelSDK: any;
        try {
          const sdkModule = await import('@exotel-npm-dev/exotel-ip-calling-crm-websdk');
          ExotelSDK = sdkModule.default;
          addLog('✅ Step 1: SDK module imported successfully', {
            hasDefault: !!sdkModule.default,
            namedExports: Object.keys(sdkModule).filter(k => k !== 'default')
          });
        } catch (importError) {
          throw new Error(`SDK import failed: ${importError instanceof Error ? importError.message : String(importError)}`);
        }

        // Step 2: Create SDK instance
        addLog('🏗️ Step 2: Creating ExotelCRMWebSDK instance...', {
          tokenLength: token?.length,
          userId,
          autoConnectVOIP: false
        });
        let crmWebSDK: any;
        try {
          crmWebSDK = new ExotelSDK(token, userId, false);
          crmWebSDKRef.current = crmWebSDK;
          addLog('✅ Step 2: ExotelCRMWebSDK instance created', {
            instanceExists: !!crmWebSDK,
            methods: crmWebSDK ? Object.getOwnPropertyNames(Object.getPrototypeOf(crmWebSDK)).filter(n => typeof crmWebSDK[n] === 'function') : []
          });
        } catch (instanceError) {
          throw new Error(`SDK instance creation failed: ${instanceError instanceof Error ? instanceError.message : String(instanceError)}`);
        }

        // Step 3: Initialize SDK
        addLog('⚙️ Step 3: Calling Initialize() with event handlers...', {
          hasCallHandler: typeof handleCallEvents === 'function',
          hasRegistrationHandler: typeof handleRegistrationEvents === 'function',
          hasSessionHandler: typeof handleSessionEvents === 'function'
        });

        let webPhone: any;
        try {
          webPhone = await crmWebSDK.Initialize(
            handleCallEvents,
            handleRegistrationEvents,
            handleSessionEvents
          );
          addLog('✅ Step 3: Initialize() completed', {
            webPhoneExists: !!webPhone,
            webPhoneType: typeof webPhone
          });
        } catch (initError) {
          throw new Error(`Initialize() call failed: ${initError instanceof Error ? initError.message : String(initError)}`);
        }

        if (!webPhone) {
          throw new Error('Initialize() returned null/undefined - WebPhone initialization failed');
        }

        webPhoneRef.current = webPhone;
        addLog('✅ WebPhone instance stored in ref', {
          hasMakeCall: typeof webPhone.MakeCall === 'function',
          hasRegisterDevice: typeof webPhone.RegisterDevice === 'function',
          hasHangupCall: typeof webPhone.HangupCall === 'function',
          hasUnRegisterDevice: typeof webPhone.UnRegisterDevice === 'function',
          hasToggleMute: typeof webPhone.ToggleMute === 'function'
        });

        // Send successful initialization event
        await sendSDKEvent('sdk_initialized', {
          event_category: 'initialization',
          success: true,
          webphone_methods: Object.keys(webPhone).filter(k => typeof webPhone[k] === 'function')
        });

        // Step 4: Wait for SDK to be fully ready
        addLog('⏳ Step 4: Waiting 2s for SDK to stabilize...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        addLog('✅ Step 4: Wait complete');

        // Step 5: Register SIP device
        addLog('📝 Step 5: Calling RegisterDevice()...');
        try {
          const registerResult = await webPhone.RegisterDevice();
          addLog('✅ Step 5: RegisterDevice() called', {
            result: registerResult,
            resultType: typeof registerResult
          });

          // Send registration attempt event
          await sendSDKEvent('register_device_called', {
            event_category: 'registration',
            success: true,
            result: typeof registerResult
          });
        } catch (registerError) {
          const registerErrorMsg = `RegisterDevice() failed: ${registerError instanceof Error ? registerError.message : String(registerError)}`;
          addLog('❌ Step 5: RegisterDevice() error', registerError);

          // Send registration failure event
          await sendSDKEvent('register_device_failed', {
            event_category: 'registration',
            error: registerErrorMsg,
            rawError: String(registerError)
          });

          throw new Error(registerErrorMsg);
        }

        addLog('✨ SDK initialization flow complete - waiting for registration events...');

        // Note: The rest happens in handleRegistrationEvents -> MakeCall()

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;

        addLog('💥 SDK initialization failed', {
          error: errorMsg,
          stack: errorStack,
          errorType: error instanceof Error ? error.constructor.name : typeof error
        });

        setCallState({ status: 'error', callDuration: 0, error: errorMsg });

        // Send detailed error to backend
        await sendSDKEvent('initialization_failed', {
          event_category: 'initialization',
          error: errorMsg,
          error_type: error instanceof Error ? error.constructor.name : typeof error,
          stack: errorStack,
          timestamp: new Date().toISOString()
        }).catch(err => console.warn('❌ Failed to send initialization_failed webhook:', err));

        // Notify mobile app about initialization failure
        sendMessageToApp('initialization_failed', {
          error: errorMsg,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Small delay to ensure everything is ready
    addLog('⏱️ Scheduling initialization in 500ms...');
    const initTimer = setTimeout(initializeSDK, 500);

    // Cleanup on unmount
    return () => {
      addLog('🧹 Cleanup: Unmounting component...');

      if (initTimer) {
        clearTimeout(initTimer);
        addLog('🧹 Cleanup: Init timer cleared');
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
        addLog('🧹 Cleanup: Duration timer cleared');
      }

      if (webPhoneRef.current) {
        addLog('🧹 Cleanup: Unregistering SIP device...');
        webPhoneRef.current.UnRegisterDevice()
          .then(() => {
            addLog('✅ Cleanup: SIP device unregistered successfully');
            sendSDKEvent('cleanup_success', {
              event_category: 'cleanup',
              action: 'unregister_device'
            }).catch(err => console.warn('Webhook failed (ignoring):', err));
          })
          .catch((err: any) => {
            const cleanupError = `Unregister failed: ${err instanceof Error ? err.message : String(err)}`;
            addLog('❌ Cleanup error:', cleanupError);

            sendSDKEvent('cleanup_failed', {
              event_category: 'cleanup',
              action: 'unregister_device',
              error: cleanupError
            }).catch((webhookErr) => console.warn('Webhook failed (ignoring):', webhookErr));
          });
      } else {
        addLog('ℹ️ Cleanup: No WebPhone instance to unregister');
      }
    };
  }, []);

  // Hangup call
  const hangup = async () => {
    addLog('📞 Hangup requested', {
      hasWebPhone: !!webPhoneRef.current,
      callState: callState.status,
      callDuration
    });

    if (!webPhoneRef.current) {
      const error = 'WebPhone not initialized';
      addLog('❌ Hangup failed:', error);
      sendMessageToApp('hangup_error', { error });

      await sendSDKEvent('hangup_failed', {
        event_category: 'call_control',
        action: 'hangup',
        error,
        reason: 'no_webphone'
      }).catch(err => console.warn('Webhook failed (ignoring):', err));
      return;
    }

    try {
      addLog('📞 Calling HangupCall()...', {
        callDuration,
        status: callState.status
      });

      // Notify app that hangup was initiated
      sendMessageToApp('hangup_initiated', {
        message: 'Guide hung up the call',
        callDuration
      });

      const result = await webPhoneRef.current.HangupCall();
      addLog('✅ HangupCall() completed', { result, resultType: typeof result });

      await sendSDKEvent('call_ended_by_guide', {
        action: 'hangup',
        call_duration_seconds: callDuration,
        result: typeof result
      });

      sendMessageToApp('hangup_success', {
        message: 'Call ended by guide',
        callDuration
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog('❌ HangupCall() failed:', {
        error: errorMsg,
        stack: error instanceof Error ? error.stack : undefined
      });

      sendMessageToApp('hangup_error', {
        error: errorMsg,
        callDuration
      });

      await sendSDKEvent('hangup_failed', {
        event_category: 'call_control',
        action: 'hangup',
        error: errorMsg,
        call_duration_seconds: callDuration
      }).catch(err => console.warn('Webhook failed (ignoring):', err));
    }
  };

  // Complete consultation - sends completion request to backend
  const completeCall = async () => {
    const accessToken = injectedData.access_token;

    if (!accessToken) {
      addLog('❌ Complete call failed: No access token in injected data');
      sendMessageToApp('complete_call_error', {
        error: 'Access token not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (!consultationId) {
      addLog('❌ Complete call failed: No consultation ID');
      sendMessageToApp('complete_call_error', {
        error: 'Consultation ID not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    setIsCompleting(true);

    addLog('✅ Complete consultation requested', {
      consultationId,
      callDuration,
      timestamp: new Date().toISOString()
    });

    try {
      addLog('📤 Sending PATCH request to backend...');

      // Notify app that completion was initiated
      sendMessageToApp('complete_call_initiated', {
        message: 'Completing consultation...',
        consultation_id: consultationId,
        call_duration_seconds: callDuration
      });

      const apiUrl = `https://devazstg.astrokiran.com/auth/api/v1/consultation/guides/${consultationId}/complete`;

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        // body: JSON.stringify({
        //   call_duration_seconds: callDuration
        // })
      });

      addLog('📤 Backend response received', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read response');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      addLog('✅ Consultation completed successfully', { result });

      await sendSDKEvent('consultation_completed', {
        event_category: 'call_completion',
        success: true,
        consultation_id: consultationId,
        call_duration_seconds: callDuration
      });

      // Notify app about successful completion
      sendMessageToApp('complete_call_success', {
        message: 'Consultation completed successfully',
        consultation_id: consultationId,
        call_duration_seconds: callDuration,
        result
      });

      // Optionally hang up after completion if still connected
      if (webPhoneRef.current && callState.status === 'connected') {
        addLog('📞 Hanging up after completion...');
        await hangup();
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog('❌ Complete consultation failed:', {
        error: errorMsg,
        stack: error instanceof Error ? error.stack : undefined
      });

      await sendSDKEvent('consultation_complete_failed', {
        event_category: 'call_completion',
        error: errorMsg,
        consultation_id: consultationId
      }).catch((err) => console.warn('Webhook failed (ignoring):', err));

      sendMessageToApp('complete_call_error', {
        error: errorMsg,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsCompleting(false);
    }
  };

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-green-500';
      case 'calling': return 'bg-yellow-500';
      case 'connected': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-600';
    }
  };

  // Close WebView after call ends
  useEffect(() => {
    if (callState.status === 'ended') {
      addLog('✅ Call ended - starting cleanup sequence (2s delay)', {
        callDuration,
        formattedDuration: formatDuration(callDuration),
        timestamp: new Date().toISOString()
      });

      // Notify mobile app about impending redirect
      sendMessageToApp('call_ending_cleanup', {
        message: 'Cleaning up and redirecting...',
        call_duration_seconds: callDuration,
        redirect_in_seconds: 2
      });

      // Cleanup and redirect after 2 seconds
      const timer = setTimeout(async () => {
        addLog('🧹 Starting cleanup process...', {
          hasWebPhone: !!webPhoneRef.current,
          timestamp: new Date().toISOString()
        });

        try {
          // Unregister SIP device before redirect
          if (webPhoneRef.current) {
            addLog('🧹 Step 1: Unregistering SIP device...', {
              hasUnRegisterDevice: typeof webPhoneRef.current.UnRegisterDevice === 'function'
            });

            try {
              const unregisterResult = await webPhoneRef.current.UnRegisterDevice();
              addLog('✅ Step 1: SIP device unregistered successfully', {
                result: unregisterResult,
                resultType: typeof unregisterResult
              });

              await sendSDKEvent('cleanup_unregister_success', {
                event_category: 'cleanup',
                action: 'unregister_device',
                result: typeof unregisterResult
              });

            } catch (unregisterError) {
              const unregisterErrorMsg = `Unregister failed: ${unregisterError instanceof Error ? unregisterError.message : String(unregisterError)}`;
              addLog('❌ Step 1: Unregister failed (continuing anyway)', {
                error: unregisterErrorMsg
              });

              await sendSDKEvent('cleanup_unregister_failed', {
                event_category: 'cleanup',
                action: 'unregister_device',
                error: unregisterErrorMsg
              });
            }
          } else {
            addLog('ℹ️ Step 1: No WebPhone instance to unregister');
          }

          // Redirect to root URL
          addLog('🧹 Step 2: Redirecting to home...', {
            currentUrl: window.location.href,
            targetUrl: '/',
            timestamp: new Date().toISOString()
          });

          await sendSDKEvent('cleanup_redirecting', {
            event_category: 'cleanup',
            action: 'redirect',
            from: window.location.href,
            to: '/'
          });

          // Notify mobile app before redirect
          sendMessageToApp('redirecting', {
            to: '/',
            message: 'Redirecting to home...'
          });

          // Small delay to ensure events are sent
          await new Promise(resolve => setTimeout(resolve, 100));

          window.location.href = '/';

        } catch (err) {
          const cleanupError = err instanceof Error ? err.message : String(err);
          addLog('❌ Cleanup error (redirecting anyway)', {
            error: cleanupError,
            stack: err instanceof Error ? err.stack : undefined
          });

          // Send cleanup failure event
          await sendSDKEvent('cleanup_failed', {
            event_category: 'cleanup',
            error: cleanupError,
            will_redirect_anyway: true
          });

          // Redirect anyway even if cleanup fails
          addLog('🧹 Redirecting despite cleanup error');
          window.location.href = '/';
        }
      }, 2000);

      return () => {
        addLog('🧹 Cleanup timer cleared (component remounted?)');
        clearTimeout(timer);
      };
    }
  }, [callState.status]);

  const totalSeconds = injectedData.totalSeconds ?? 1;

  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - remaining) / totalSeconds) * 100)
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };


  const handleHandImagesClick = (hand: 'left' | 'right') => {
    if (hand === 'left') {
      setHandImageUrl(injectedData.customerHandImages![0])
    } else {
      setHandImageUrl(injectedData.customerHandImages![1])
    }
  }
  const toggleMute = useCallback(() => {
    const next = !isMuted;
    addLog('🎙️ Toggle mute requested', {
      current: isMuted,
      next,
      hasWebPhone: !!webPhoneRef.current,
      hasToggleMute: typeof webPhoneRef.current?.ToggleMute === 'function'
    });

    try {
      // Exotel WebPhone SDK provides ToggleMute() method
      if (webPhoneRef.current?.ToggleMute) {
        webPhoneRef.current.ToggleMute();
        addLog('✅ ToggleMute() called successfully');
      } else {
        addLog('⚠️ ToggleMute() method not available on WebPhone');
      }
    } catch (err) {
      const muteError = err instanceof Error ? err.message : String(err);
      addLog('❌ ToggleMute() failed', {
        error: muteError,
        stack: err instanceof Error ? err.stack : undefined
      });
      console.warn('Mute toggle failed:', err);
    }

    setIsMuted(next);

    // Notify mobile app
    sendMessageToApp('toggle_mic', {
      muted: next,
      timestamp: new Date().toISOString()
    });

    // Send event to backend
    sendSDKEvent('mute_toggled', {
      event_category: 'call_control',
      action: 'toggle_mute',
      muted: next
    }).catch(err => console.warn('❌ Mute toggle webhook failed (ignoring):', err));
  }, [isMuted, sendMessageToApp, addLog]);

  const toggleSpeaker = useCallback(() => {
    const next = !isSpeaker;
    addLog('🔊 Toggle speaker requested', {
      current: isSpeaker,
      next,
      isWebView
    });

    setIsSpeaker(next);

    // Browser usually can't force speaker — delegate to mobile app
    sendMessageToApp('toggle_speaker', {
      speaker: next,
      timestamp: new Date().toISOString()
    });

    // Send event to backend
    sendSDKEvent('speaker_toggled', {
      event_category: 'call_control',
      action: 'toggle_speaker',
      speaker: next
    }).catch(err => console.warn('❌ Speaker toggle webhook failed (ignoring):', err));
  }, [isSpeaker, isWebView, sendMessageToApp, addLog]);
  
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-1">

        {/* Header */}
        <div className="flex flex-col items-center pt-12 px-6 text-white">
          {/* <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
            {injectedData.customerImage ? (
              <Image src={injectedData.customerImage} alt="Customer" width={112} height={112} className="object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>*/}

          <h2 className="text-xl font-semibold mt-4">{injectedData.customerName || "Customer"}</h2>
          <p className="text-slate-400 text-sm">In-call</p>
        </div>



        <div className='flex flex-col gap-4 items-center w-full justify-center'>
          {Boolean(injectedData.isPromotional) && (
            <span className="mt-3 px-3 py-1 text-sm font-medium tracking-wide border border-emerald-500 text-emerald-600 rounded-full bg-emerald-50">
              PROMOTIONAL
            </span>
          )}
          {injectedData && injectedData.customerHandImages && injectedData.customerHandImages?.length > 0 && (
            <div className="flex gap-3 px-6 mt-6 w-full max-w-xl">
              {injectedData.customerHandImages[0] && (
                <button
                  onClick={() => handleHandImagesClick('left')}
                  className="flex-1 border border-blue-500 bg-blue-50 text-blue-600 py-2 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Hand className="w-6 h-6" />
                  Left Hand
                </button>
              )}

              {injectedData.customerHandImages[1] && (
                <button
                  onClick={() => handleHandImagesClick('right')}
                  className="flex-1 border border-green-500 bg-green-50 text-green-600 py-2 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Hand className="w-6 h-6 scale-x-[-1]" />
                  Right Hand
                </button>
              )}
            </div>
          )}
        </div>
        {isDev && (
          <div className="px-6 my-4">
            <div className="bg-black rounded-xl p-3 max-h-48 overflow-y-auto text-xs font-mono text-green-400">
              {eventLog.length === 0
                ? "Waiting for events..."
                : eventLog.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        )}
        {/* Spacer */}
        <div className="flex-1" />

        {/* Controls */}
        <div className="px-10 mb-6 flex flex-col items-center gap-4">
          {/* Complete button */}
          <button
            onClick={completeCall}
            disabled={isCompleting || callState.status !== 'connected'}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-green-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-green-700"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Completing...</span>
              </>
            ) : (
              <>
                <Phone className="w-5 h-5" />
                <span>Complete Consultation</span>
              </>
            )}
          </button>

          {/* Call controls */}
          <div className="flex justify-between items-center w-full max-w-xs">
            <button
              onClick={toggleMute}
              className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center"
            >
              {isMuted ? <MicOff className="text-red-500" /> : <Mic className="text-white" />}
            </button>

            <button
              onClick={hangup}
              className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
            >
              <PhoneOff className="text-white w-6 h-6" />
            </button>

            <button
              onClick={toggleSpeaker}
              className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center"
            >
              <Volume2 className={isSpeaker ? "text-blue-400" : "text-white"} />
            </button>
          </div>
        </div>
        <div className="px-6 mb-6 w-full">
          <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 backdrop-blur">

            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-400">Time Remaining</p>
              <p className="text-sm font-mono text-white">
                {formatTime(remaining)}
              </p>
            </div>

            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <ImageViewer isVisible={!!handImageUrl} onClose={() => setHandImageUrl(null)} imageUrl={handImageUrl} />
    </div>
  );
}
// Wrapper component with Suspense boundary
export default function ExotelCallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Loading call interface...</p>
        </div>
      </div>
    }>
      <ExotelCallPageContent />
    </Suspense>
  );
}
