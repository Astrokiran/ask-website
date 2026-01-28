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
  customerImage?: string;
  guideName?: string;
  guideImage?: string;
  serviceType?: string;
  language?: string;
  theme?: 'light' | 'dark';
  remainingSeconds?: number;
  totalSeconds?: number;
  isPromotional?: boolean;
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
    if (isWebView && (window as any).ReactNativeWebView) {
      const message = JSON.stringify({ type, ...data, timestamp: new Date().toISOString() });
      (window as any).ReactNativeWebView.postMessage(message);
      addLog('📤 Sent to app:', { type, data });
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

    console.log('[Webhook] Sending:', payload);

    try {
      // Use relative URL - will be proxied to backend via Next.js API route
      const response = await fetch('/api/webhooks/exotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('[Webhook] Backend returned:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('[Webhook] Backend response:', result);
    } catch (error) {
      // Log webhook errors to console only - don't break the call flow
      console.warn('[Webhook] Failed (non-critical):', error);
      // Remove from sent events on failure so it can be retried
      sentEventsRef.current.delete(deduplicationKey);
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
    addLog('📞 Call event:', { eventType, raw: event });

    // Notify mobile app about call events
    sendMessageToApp('call_event', {
      event_type: eventType,
      timestamp: new Date().toISOString(),
    });

    // Send to backend (fire and forget - don't let failures break the call flow)
    sendSDKEvent(eventType || 'call_event', {
      event_category: 'call',
      event_data: typeof event === 'object' ? event : { event }
    }).catch(err => {
      // Silently ignore webhook errors - they shouldn't break the call
      console.warn('Webhook send failed (ignoring):', err);
    });

    // Handle specific events
    if (eventType === 'incoming' || eventType === 'i_new_call') {
      // AUTO-ANSWER the incoming call from Exotel (this is the callback flow)
      addLog('📞 Incoming call from Exotel! Auto-answering...', 'warning');
      setCallState({ status: 'calling', callDuration: 0 });

      // Notify app about incoming call
      sendMessageToApp('call_incoming', {
        message: 'Incoming call from Exotel, auto-answering...'
      });

      // Automatically accept the call after a short delay
      setTimeout(async () => {
        try {
          addLog('✅ Accepting call automatically...', 'info');
          await webPhoneRef.current.AcceptCall();
          addLog('✅ Call accepted! Waiting for connection...', 'success');

          sendSDKEvent('call_auto_answered', {
            event_category: 'call_control',
            action: 'auto_accept'
          }).catch(err => console.warn('Auto-answer webhook failed (ignoring):', err));

          sendMessageToApp('call_auto_answered');

        } catch (err) {
          addLog('✗ Auto-answer failed:', err);
          sendMessageToApp('call_error', { error: String(err) });
        }
      }, 500);

    } else if (eventType === 'connected') {
      addLog('⚡ Call connected - conversation started');
      setCallState({ status: 'connected', callDuration: 0 });

      // Notify app that call is connected
      sendMessageToApp('call_connected', {
        message: 'Call connected successfully'
      });

      // Start call duration timer
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      sendSDKEvent('call_connected', {
        state: 'connected'
      }).catch(err => console.warn('Connected webhook failed (ignoring):', err));
    } else if (eventType === 'callEnded') {
      addLog('✗ Call ended');
      setCallState({ status: 'ended', callDuration: callDuration });

      // Notify app that call ended
      sendMessageToApp('call_ended', {
        duration_seconds: callDuration,
        message: 'Call has ended'
      });

      // Stop duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      sendSDKEvent('callEnded', { event: 'callEnded', duration_seconds: callDuration })
        .catch(err => console.warn('Call ended webhook failed (ignoring):', err));
    }
  };

  // Registration event handler
  const handleRegistrationEvents = (event: any) => {
    const eventType = parseEventType(event);
    addLog('📝 Registration event:', { eventType, raw: event });

    let registered = false;
    if (typeof event === 'string') {
      registered = eventType === 'registered' || eventType === 'connected';
    } else if (Array.isArray(event)) {
      registered = event[0] === 'registered' || event[0] === 'connected';
    } else {
      registered = event?.registered || false;
    }

    const regEventType = registered ? 'registered' : 'unregistered';

    // Notify app about registration events
    sendMessageToApp('registration_event', {
      event_type: regEventType,
      registered: registered
    });

    // Send to backend (fire and forget)
    sendSDKEvent(regEventType, {
      event_category: 'registration',
      registered: registered
    }).catch(err => console.warn('Registration webhook failed (ignoring):', err));

    if (registered) {
      addLog('✓ SIP device registered successfully');
      setCallState({ status: 'registered', callDuration: 0 });

      // Notify app about successful registration
      sendMessageToApp('sip_registered', {
        message: 'SIP device registered successfully'
      });

      // AUTO-CALL: Automatically initiate call after successful registration
      addLog('📞 Auto-initiating call to customer:', customerPhone);

      // Notify app that call will be initiated
      sendMessageToApp('call_initiating', {
        customer_phone: customerPhone,
        message: 'Initiating call to customer...'
      });

      // Small delay to ensure registration is fully processed
      setTimeout(async () => {
        try {
          setCallState({ status: 'calling', callDuration: 0 });
          await webPhoneRef.current.MakeCall(customerPhone, (result: any) => {
            addLog('Dial result:', result);
          });
          addLog('✓ MakeCall() invoked automatically');
          sendSDKEvent('call_initiated', {
            customer_phone: customerPhone,
            call_type: 'outbound',
            auto_initiated: true,
          }).catch(err => console.warn('Call initiated webhook failed (ignoring):', err));

          // Notify app that call was initiated
          sendMessageToApp('call_initiated', {
            customer_phone: customerPhone,
            call_type: 'outbound'
          });

        } catch (error) {
          addLog('✗ Auto-call failed:', error);
          setCallState({ status: 'error', callDuration: 0, error: String(error) });

          sendMessageToApp('call_error', {
            error: String(error),
            step: 'make_call'
          });
        }
      }, 500);
    } else {
      addLog('✗ SIP device not registered');
      setCallState({ status: 'error', callDuration: 0, error: 'Registration failed' });
    }
  };

  // Session event handler
  const handleSessionEvents = (event: any) => {
    const eventType = parseEventType(event);
    addLog('🔄 Session event:', { eventType, raw: event });

    // Send important session states to backend (fire and forget)
    if (['calling', 'ringing', 'connected', 'ended', 'failed'].includes(eventType)) {
      sendSDKEvent(eventType, {
        event_category: 'session',
        session_state: eventType
      }).catch(err => console.warn('Session webhook failed (ignoring):', err));
    }

    // Update UI
    if (eventType === 'calling') {
      setCallState({ status: 'calling', callDuration: 0 });
    } else if (eventType === 'ringing') {
      setCallState({ status: 'calling', callDuration: 0 });
    }
  };

  // Read injected data from mobile app on mount
  useEffect(() => {
    // Check if running in React Native WebView
    const hasReactNativeWebView = !!(window as any).ReactNativeWebView;
    setIsWebView(hasReactNativeWebView);

    if (hasReactNativeWebView) {
      addLog('📱 Running in React Native WebView');
    }

    // Read data injected via injectedJavaScript
    const injectedAppData = (window as any).__INJECTED_DATA__;

    if (injectedAppData) {
      addLog('✅ Found injected data from app', Object.keys(injectedAppData));
      setInjectedData(injectedAppData);

      // Send acknowledgment to app
      sendMessageToApp('data_received', {
        keys: Object.keys(injectedAppData),
        handImagesCount: injectedAppData.customerHandImages?.length || 0,
      });

      // Log hand images
      if (injectedAppData.customerHandImages?.length > 0) {
        addLog(`📸 Found ${injectedAppData.customerHandImages.length} hand image(s)`);
      }
    } else {
      addLog('ℹ️ No injected data found (running in browser?)');
    }

    // Listen for messages from app (optional - for bidirectional communication)
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        addLog('📥 Received from app:', data);

        // Handle specific message types from app
        if (data.type === 'update_data') {
          setInjectedData(prev => ({ ...prev, ...data.payload }));
          sendMessageToApp('data_updated', { keys: Object.keys(data.payload) });
        } else if (data.type === 'hangup_call') {
          hangup();
        }
      } catch (err) {
        addLog('⚠️ Failed to parse message from app:', err);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Initialize Exotel SDK on mount
  useEffect(() => {
    if (!token || !userId || !customerPhone) {
      addLog('Error: Missing required parameters', { token, userId, customerPhone });
      setCallState({ status: 'error', callDuration: 0, error: 'Missing required parameters' });
      return;
    }

    addLog('🚀 Initializing ExotelCRMWebSDK', { token, userId, customerPhone });
    setCallState({ status: 'registering', callDuration: 0 });

    const initializeSDK = async () => {
      try {
        // Dynamically import ExotelCRMWebSDK (only on client side)
        const ExotelSDK = (await import('@exotel-npm-dev/exotel-ip-calling-crm-websdk')).default;

        // Create ExotelCRMWebSDK instance
        // autoConnectVOIP = false - we'll register manually
        const crmWebSDK = new ExotelSDK(token, userId, false);
        crmWebSDKRef.current = crmWebSDK;

        addLog('✓ ExotelCRMWebSDK instance created');

        // Initialize SDK and get WebPhone instance
        addLog('Calling Initialize()...');
        const webPhone = await crmWebSDK.Initialize(
          handleCallEvents,
          handleRegistrationEvents,
          handleSessionEvents
        );

        if (!webPhone) {
          throw new Error('Initialize() returned null - WebPhone initialization failed');
        }

        webPhoneRef.current = webPhone;
        addLog('✓ SDK initialized successfully, WebPhone instance ready');

        // Wait for SDK to fully set up before registering SIP device
        addLog('⏳ Waiting for SDK to be fully ready...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Register SIP device
        addLog('📝 Registering SIP device...');
        await webPhone.RegisterDevice();

        // Note: The rest happens in handleRegistrationEvents -> MakeCall()

      } catch (error) {
        addLog('✗ SDK initialization error:', error);
        setCallState({ status: 'error', callDuration: 0, error: String(error) });
        sendSDKEvent('initialization_failed', {
          event_category: 'initialization',
          error: String(error)
        }).catch(err => console.warn('Init failed webhook failed (ignoring):', err));
      }
    };

    // Small delay to ensure everything is ready
    setTimeout(initializeSDK, 500);

    // Cleanup on unmount
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (webPhoneRef.current) {
        addLog('🧹 Cleaning up WebPhone...');
        webPhoneRef.current.UnRegisterDevice().catch((err: any) => addLog('Unregister error:', err));
      }
    };
  }, []);

  // Hangup call
  const hangup = async () => {
    if (!webPhoneRef.current) {
      addLog('Error: WebPhone not initialized');
      sendMessageToApp('hangup_error', { error: 'WebPhone not initialized' });
      return;
    }

    try {
      addLog('📞 Hanging up call...');

      // Notify app that hangup was initiated
      sendMessageToApp('hangup_initiated', {
        message: 'Guide hung up the call'
      });

      await webPhoneRef.current.HangupCall();
      addLog('✓ HangupCall() invoked successfully');
      sendSDKEvent('call_ended_by_guide', { action: 'hangup' })
        .catch(err => console.warn('Hangup webhook failed (ignoring):', err));

      sendMessageToApp('hangup_success', {
        message: 'Call ended by guide'
      });
    } catch (error) {
      addLog('✗ hangup() error:', error);
      sendMessageToApp('hangup_error', { error: String(error) });
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
      addLog('✅ Call ended - cleaning up and redirecting...');

      // Cleanup and redirect after 2 seconds
      const timer = setTimeout(async () => {
        try {
          // Unregister SIP device before redirect
          if (webPhoneRef.current) {
            addLog('Unregistering SIP device...');
            await webPhoneRef.current.UnRegisterDevice();
            addLog('✓ SIP device unregistered');
          }

          // Redirect to root URL
          addLog('Redirecting to home...');
          window.location.href = '/';
        } catch (err) {
          addLog('Cleanup error:', err);
          // Redirect anyway even if cleanup fails
          window.location.href = '/';
        }
      }, 2000);

      return () => clearTimeout(timer);
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
    setIsMuted(next);

    try {
      // Exotel WebPhone SDK provides ToggleMute() method
      if (webPhoneRef.current?.ToggleMute) {
        webPhoneRef.current.ToggleMute();
      }
    } catch (err) {
      console.warn("Mute toggle failed:", err);
    }

    // Notify mobile app
    sendMessageToApp("toggle_mic", { muted: next });

    if (process.env.NODE_ENV === "development") {
      addLog("🎙️ Mic toggled", { muted: next });
    }
  }, [isMuted, sendMessageToApp, addLog]);

  const toggleSpeaker = useCallback(() => {
    const next = !isSpeaker;
    setIsSpeaker(next);

    // Browser usually can't force speaker — delegate to mobile app
    sendMessageToApp("toggle_speaker", { speaker: next });

    if (process.env.NODE_ENV === "development") {
      addLog("🔊 Speaker toggled", { speaker: next });
    }
  }, [isSpeaker, sendMessageToApp, addLog]);
  
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-1">

        {/* Header */}
        <div className="flex flex-col items-center pt-12 px-6 text-white">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
            {injectedData.customerImage ? (
              <Image src={injectedData.customerImage} alt="Customer" width={112} height={112} className="object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>

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
        <div className="px-10 mb-6 flex justify-between items-center">
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
        {/* <div className="px-6 mb-6 w-full">
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
        </div> */}
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
