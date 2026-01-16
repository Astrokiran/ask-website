/**
 * Exotel CRM WebRTC SDK Type Declarations
 * Based on @exotel-npm-dev/exotel-ip-calling-crm-websdk
 */

declare global {
  interface Window {
    /**
     * React Native WebView Interface
     * Used to communicate with mobile app when page loads in WebView
     */
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * ExotelCRMWebSDK - Main SDK class for CRM integration
 */
declare class ExotelCRMWebSDK {
  /**
   * @param accessToken - Exotel access token
   * @param userId - Guide's Exotel User ID
   * @param autoConnectVOIP - If true, auto-connects device on initialization
   */
  constructor(
    accessToken: string,
    userId: string,
    autoConnectVOIP: boolean
  );

  /**
   * Initializes the CRMWebSDK, sets up the phone object, and registers callbacks
   *
   * @param softPhoneListenerCallback - Callback for incoming calls
   * @param softPhoneRegisterEventCallBack - Callback for registration events
   * @param softPhoneSessionCallback - Callback for session events
   * @returns Promise that resolves to ExotelWebPhoneSDK instance
   */
  Initialize(
    softPhoneListenerCallback: ExotelCallEventHandler,
    softPhoneRegisterEventCallBack?: ExotelRegistrationEventHandler,
    softPhoneSessionCallback?: ExotelSessionEventHandler
  ): Promise<ExotelWebPhoneSDK | void>;
}

/**
 * ExotelWebPhoneSDK - WebPhone interface for call control
 */
declare interface ExotelWebPhoneSDK {
  /**
   * Registers the SIP device with the call server
   */
  RegisterDevice(): Promise<void>;

  /**
   * Un-registers the device from the call server
   */
  UnRegisterDevice(): Promise<void>;

  /**
   * Accepts an incoming call
   */
  AcceptCall(): Promise<void>;

  /**
   * Disconnects the active call
   */
  HangupCall(): Promise<void>;

  /**
   * Places an outbound call
   *
   * @param number - Phone number to dial
   * @param dialCallback - Callback after call request is sent to server
   * @param customField - Application-specific value (e.g., order ID)
   */
  MakeCall(
    number: string,
    dialCallback?: (result: any) => void,
    customField?: string
  ): Promise<void>;

  /**
   * Toggle hold/un-hold state of a call
   */
  ToggleHold(): Promise<void>;

  /**
   * Toggle mute/un-mute state of a call
   */
  ToggleMute(): Promise<void>;
}

/**
 * Call event types
 */
type ExotelCallEventType =
  | 'incoming'          // Incoming call received
  | 'i_new_call'        // New incoming call
  | 'connected'         // Call connected
  | 'callEnded';        // Call ended

/**
 * Registration event types
 */
type ExotelRegistrationEventType =
  | 'registered'        // SIP device registered
  | 'unregistered'      // SIP device unregistered
  | 'registrationFailed'; // Registration failed

/**
 * Session event types
 */
type ExotelSessionEventType =
  | 'calling'           // Call initiated
  | 'ringing'           // Phone ringing
  | 'connected'         // Session connected
  | 'ended'            // Session ended
  | 'failed';          // Session failed

/**
 * Call event handler
 * Receives call events as string or object
 */
type ExotelCallEventHandler = (event: ExotelCallEventType | any[] | any) => void;

/**
 * Registration event handler
 * Receives registration events as string or object
 */
type ExotelRegistrationEventHandler = (event: ExotelRegistrationEventType | any[] | any) => void;

/**
 * Session event handler
 * Receives session events as string or object with session state
 */
type ExotelSessionEventHandler = (event: ExotelSessionEventType | any[] | { session?: any; state?: string }) => void;

// Export the SDK class
export { ExotelCRMWebSDK, ExotelWebPhoneSDK };
export default ExotelCRMWebSDK;
