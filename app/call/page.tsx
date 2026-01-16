'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, Loader2, User, Hand, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

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
  [key: string]: any;
}

interface ExotelCallState {
  status: 'initializing' | 'registering' | 'registered' | 'calling' | 'connected' | 'ended' | 'error';
  callDuration: number;
  error?: string;
}

function ExotelCallPageContent() {
  const searchParams = useSearchParams();

  // Get URL parameters
  const token = searchParams.get('token') || '';
  const userId = searchParams.get('user_id') || '';
  const customerPhone = searchParams.get('customer_phone') || '';
  const consultationId = searchParams.get('consultation_id') || '';

  const [callState, setCallState] = useState<ExotelCallState>({
    status: 'initializing',
    callDuration: 0,
  });

  const [eventLog, setEventLog] = useState<string[]>([]);
  const [callDuration, setCallDuration] = useState(0);

  // Data injected from mobile app
  const [injectedData, setInjectedData] = useState<InjectedAppData>({});
  const [isWebView, setIsWebView] = useState(false);

  const crmWebSDKRef = useRef<any>(null);
  const webPhoneRef = useRef<any>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Log utility
  const addLog = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}${data ? ` ${JSON.stringify(data)}` : ''}`;
    setEventLog(prev => [...prev.slice(-49), logEntry]); // Keep last 50 logs
    console.log(message, data);
  };

  // Send message back to mobile app via PostMessage
  const sendMessageToApp = (type: string, data: any = {}) => {
    if (isWebView && (window as any).ReactNativeWebView) {
      const message = JSON.stringify({ type, ...data, timestamp: new Date().toISOString() });
      (window as any).ReactNativeWebView.postMessage(message);
      addLog('📤 Sent to app:', { type, data });
    }
  };

  // Send SDK event to backend
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

      // Start heartbeat (fire and forget)
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      heartbeatIntervalRef.current = setInterval(() => {
        sendSDKEvent('heartbeat', { timestamp: new Date().toISOString() })
          .catch(err => console.warn('Heartbeat webhook failed (ignoring):', err));
      }, 30000);

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

      // Stop timers
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
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
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header - Customer & Guide Info */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Phone className="h-6 w-6" />
                  {injectedData.serviceType || 'Consultation'} Call
                </CardTitle>
                <CardDescription>
                  {injectedData.guideName || 'Guide'} consultation with {injectedData.customerName || 'Customer'}
                </CardDescription>
              </div>
              {isWebView && (
                <div className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30">
                  WebView
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer & Guide Profiles */}
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Info */}
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-3">
                  {injectedData.customerImage ? (
                    <Image
                      src={injectedData.customerImage}
                      alt="Customer"
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-slate-600"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400">Customer</p>
                    <p className="font-semibold truncate">{injectedData.customerName || 'Unknown'}</p>
                    <p className="text-xs text-slate-500 font-mono">{customerPhone}</p>
                  </div>
                </div>
              </div>

              {/* Guide Info */}
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-3">
                  {injectedData.guideImage ? (
                    <Image
                      src={injectedData.guideImage}
                      alt="Guide"
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-blue-600"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center border-2 border-blue-600">
                      <User className="h-6 w-6 text-blue-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400">Guide</p>
                    <p className="font-semibold truncate">{injectedData.guideName || userId}</p>
                    {injectedData.serviceType && (
                      <p className="text-xs text-blue-400">{injectedData.serviceType}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Call Status & Duration */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(callState.status)}`}>
                  {callState.status.toUpperCase()}
                </span>
              </div>
              {callState.status === 'connected' && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Duration:</span>
                  <span className="font-mono text-lg text-green-400">{formatDuration(callDuration)}</span>
                </div>
              )}
            </div>

            {/* Consultation ID */}
            <div className="text-xs text-slate-500 text-center">
              Consultation ID: <span className="font-mono">{consultationId}</span>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              {(callState.status === 'initializing' || callState.status === 'registering') && (
                <Button disabled className="flex-1 bg-yellow-600 h-14 text-lg" size="lg">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {callState.status === 'registering' ? 'Registering SIP Device...' : 'Initializing...'}
                </Button>
              )}

              {callState.status === 'calling' && (
                <Button disabled className="flex-1 bg-yellow-600 h-14 text-lg" size="lg">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calling Customer...
                </Button>
              )}

              {callState.status === 'connected' && (
                <Button
                  onClick={hangup}
                  className="flex-1 bg-red-600 hover:bg-red-700 h-14 text-lg"
                  size="lg"
                >
                  <PhoneOff className="mr-2 h-5 w-5" />
                  Hang Up
                </Button>
              )}

              {callState.status === 'error' && (
                <div className="flex-1 bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-700">
                  Error: {callState.error || 'Unknown error'}
                </div>
              )}

              {callState.status === 'ended' && (
                <div className="flex-1 bg-slate-700 text-slate-300 p-4 rounded-lg text-center">
                  Call ended - Closing...
                </div>
              )}
            </div>

            {/* Auto-call notice */}
            {(callState.status === 'initializing' || callState.status === 'registering') && (
              <div className="mt-4 text-center text-sm text-slate-400">
                <p>📞 Call will be initiated automatically once registered</p>
                <p className="text-xs mt-1">Customer: {customerPhone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Log */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Event Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
              {eventLog.length === 0 ? (
                <p className="text-slate-500">Waiting for events...</p>
              ) : (
                eventLog.map((log, index) => (
                  <div key={index} className="mb-1 text-green-400">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Hand Images */}
        {injectedData.customerHandImages && injectedData.customerHandImages.length > 0 && (
          <Card className="mt-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hand className="h-5 w-5 text-purple-400" />
                Customer Hand Images
                <span className="text-sm font-normal text-slate-400">
                  ({injectedData.customerHandImages.length})
                </span>
              </CardTitle>
              <CardDescription>
                Reference images for palmistry consultation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {injectedData.customerHandImages.map((imageUrl, index) => (
                  <div key={index} className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden border border-slate-700 group">
                    <Image
                      src={imageUrl}
                      alt={`Hand image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 400px"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs text-white/80">Image {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
              {injectedData.customerHandImages.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hand images provided</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
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
