// /lib/whatsapp.service.ts
// This file contains the logic for interacting with your WhatsApp API provider.

// --- Constants ---
const WHATSAPP_API_BASE_URL = "https://api.freecustomer.in/api/v1";
const AUTH_ENDPOINT = "/auth/login";
const SEND_MEDIA_MESSAGE_ENDPOINT = "/waba/send-media-message-by-phone";
const SEND_TEXT_MESSAGE_ENDPOINT = "/waba/send-text-message-by-phone";

const TOKEN_EXPIRATION_MS = 23 * 60 * 60 * 1000;
const DEFAULT_TENANT_ID = 807;

const TEMPLATE_SEND_ENDPOINT = "/templates/send-template-by-phone"; 

// --- Interfaces to define the shape of API responses ---
interface AuthResponseData { token: string; }
interface AuthApiResponse { status: string; data?: AuthResponseData; message?: string; code?: number; error?: boolean; }
interface CachedToken { token: string; expires_at: number; }
interface WhatsAppApiErrorResponse { error: boolean; status: string; code: number; message: string; timestamp: string; path: string; }

// Interface for a single 'value' object within the template payload's 'values' array
interface TemplateValue {
  name: string; // The placeholder name, e.g., "1" (for {{1}} body) or "2" (for the button's dynamic URL part)
  is_tenant_provided?: boolean;
  is_storage_fetch?: boolean;
  tenant_provide_value?: string;
  storage_fetch_key?: string;
}

// Interface for the overall Template Message Payload body, strictly based on Python reference
interface TemplateMessagePayload {
  template_id: number;
  values: TemplateValue[];
}

// --- Authentication Service (Handles Token Caching and Refresh) ---
class WhatsAppAuthService {
  private tokenCache: CachedToken | null = null;
  private email: string;
  private password: string;

  constructor() {
    this.email = process.env.NEXT_PUBLIC_WHATSAPP_API_EMAIL || '';
    this.password = process.env.NEXT_PUBLIC_WHATSAPP_API_PASSWORD || '';
    if (!this.email || !this.password) {
      console.error("[WhatsAppAuthService] WhatsApp API credentials (NEXT_PUBLIC_WHATSAPP_API_EMAIL, NEXT_PUBLIC_WHATSAPP_API_PASSWORD) are not set in environment variables. This will prevent authentication.");
    }
  }

  public async getAuthToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expires_at) {
      console.log("[WhatsAppAuthService] Using cached auth token.");
      return this.tokenCache.token;
    }
    console.log("[WhatsAppAuthService] Fetching new auth token.");
    return this.fetchNewToken();
  }

  public async forceRefreshToken(): Promise<string> {
    console.log("[WhatsAppAuthService] Forcing token refresh.");
    this.tokenCache = null;
    return this.fetchNewToken();
  }

  private async fetchNewToken(): Promise<string> {
    if (!this.email || !this.password) {
      throw new Error("Cannot fetch token: WhatsApp API email or password is not set.");
    }
    try {
      console.log("[WhatsAppAuthService] Requesting auth token from:", `${WHATSAPP_API_BASE_URL}${AUTH_ENDPOINT}`);
      const response = await fetch(`${WHATSAPP_API_BASE_URL}${AUTH_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });
      const rawResponseText = await response.text();
      console.log(`[WhatsAppAuthService] Raw Auth API Response (Status: ${response.status}):`, rawResponseText);

      if (!response.ok) {
        let errorData: AuthApiResponse | null = null;
        try { errorData = JSON.parse(rawResponseText); } catch (e) { console.warn("[WhatsAppAuthService] Auth error response was not JSON:", rawResponseText); }
        throw new Error(`Authentication failed with status: ${response.status}. Message: ${errorData?.message || rawResponseText}`);
      }
      const data: AuthApiResponse = JSON.parse(rawResponseText);
      if (data.status !== 'success' || !data.data?.token) {
        throw new Error(`Auth API returned an unsuccessful status or missing token: ${JSON.stringify(data)}`);
      }
      const token = data.data.token;
      const expires_at = Date.now() + TOKEN_EXPIRATION_MS;
      this.tokenCache = { token, expires_at };
      console.log("[WhatsAppAuthService] Auth token fetched successfully and cached.");
      return token;
    } catch (error) {
      console.error("[WhatsAppAuthService] Error during WhatsApp authentication:", error);
      throw new Error("Failed to fetch WhatsApp auth token due to an internal error.");
    }
  }
}

// --- Main WhatsApp Client (Singleton Pattern) ---
class WhatsAppClient {
  private static instance: WhatsAppClient;
  private authService: WhatsAppAuthService;
  private mediaMessageUrl: string;
  private textMessageUrl: string; 
  private tenantId: number; 
  private templateMessageUrl: string;
  private defaultTemplateId: number; 
  private defaultTemplateName: string;

  private constructor() {
    this.authService = new WhatsAppAuthService();
    this.mediaMessageUrl = `${WHATSAPP_API_BASE_URL}${SEND_MEDIA_MESSAGE_ENDPOINT}`;
    this.textMessageUrl = `${WHATSAPP_API_BASE_URL}${SEND_TEXT_MESSAGE_ENDPOINT}`;
    this.templateMessageUrl = `${WHATSAPP_API_BASE_URL}${TEMPLATE_SEND_ENDPOINT}`; 

    const rawTenantIdEnv = process.env.NEXT_PUBLIC_WHATSAPP_TENANT_ID;
    let tempTenantId: number;
    if (rawTenantIdEnv) {
        const parsed = parseInt(rawTenantIdEnv, 10);
        if (!isNaN(parsed)) { tempTenantId = parsed; } else { tempTenantId = DEFAULT_TENANT_ID; }
    } else { tempTenantId = DEFAULT_TENANT_ID; }
    this.tenantId = tempTenantId;
    console.log(`[WhatsAppClient Init] Final tenantId set to: ${this.tenantId} (Type: ${typeof this.tenantId})`);

    // UPDATED: Set default template ID to the new 'kundli_pdf' template ID (assuming it's 15336)
    // Make sure this matches your actual template_id for "kundli_pdf"
    this.defaultTemplateId = 15336; 
    console.log(`[WhatsAppClient Init] Default Template ID set to: ${this.defaultTemplateId} (Hardcoded for 'kundli_pdf')`);

    // UPDATED: Set default template name to 'kundli_pdf'
    this.defaultTemplateName = process.env.NEXT_PUBLIC_TEMPLATE_NAME || "kundli_pdf"; 
    console.log(`[WhatsAppClient Init] Default Template Name set to: ${this.defaultTemplateName}`);
  }

  public static getInstance(): WhatsAppClient {
    if (!WhatsAppClient.instance) {
      WhatsAppClient.instance = new WhatsAppClient();
    }
    return WhatsAppClient.instance;
  }

  private formatPhoneNumberForApi(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
      return digitsOnly.slice(2);
    }
    if (digitsOnly.length > 10) {
      return digitsOnly.slice(-10);
    }
    return digitsOnly;
  }

  // --- sendMediaMessage (No changes) ---
  public async sendMediaMessage(phone: string, mediaUrl: string, captionText: string, fileName: string, language: number = 1): Promise<any> {
    let token = await this.authService.getAuthToken();
    const formattedPhone = this.formatPhoneNumberForApi(phone);

    const sendRequest = async (authToken: string) => {
      const payload = {
        tenantId: this.tenantId,
        phone: formattedPhone,
        media_type: 'document',
        link: mediaUrl,
        caption: captionText,
        filename: fileName,
        language,
      };
      console.log("[WhatsAppClient] Sending Media Message Request Payload:", JSON.stringify(payload, null, 2));
      return await fetch(this.mediaMessageUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });
    };
    let response = await sendRequest(token);
    if (response.status === 401) {
      console.warn("[WhatsAppClient] WhatsApp API returned 401 Unauthorized. Refreshing token and retrying...");
      token = await this.authService.forceRefreshToken();
      response = await sendRequest(token);
    }
    const rawResponseText = await response.text();
    console.log(`[WhatsAppClient] Raw API Response Text (Status: ${response.status}):`, rawResponseText);
    if (!response.ok) {
      let errorParsed: WhatsAppApiErrorResponse | null = null;
      try { errorParsed = JSON.parse(rawResponseText); } catch (e) { console.warn("[WhatsAppClient] Error response was not JSON:", rawResponseText); }
      console.error(`[WhatsAppClient] WhatsApp API Error Details (${response.status}):`, errorParsed || rawResponseText);
      throw new Error(`WhatsApp API error for media message: ${response.status} - ${errorParsed?.message || "Unknown API error details"}`);
    }
    const responseData = JSON.parse(rawResponseText);
    console.log("[WhatsAppClient] Successful API Response Data:", responseData);
    return responseData;
  }


  // --- sendTextMessage (No changes) ---
  public async sendTextMessage(phone: string, messageText: string, language: number = 1): Promise<any> {
    let token = await this.authService.getAuthToken();
    const formattedPhone = this.formatPhoneNumberForApi(phone);

    const sendRequest = async (authToken: string) => {
      const payload = {
        tenantId: this.tenantId,
        phone: formattedPhone,
        message_type: 'text',
        message: messageText,
        language,
      };
      console.log("[WhatsAppClient] Sending Text Message Request Payload:", JSON.stringify(payload, null, 2));
      return await fetch(this.textMessageUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });
    };
    let response = await sendRequest(token);
    if (response.status === 401) {
      console.warn("[WhatsAppClient] WhatsApp API returned 401 Unauthorized. Refreshing token and retrying...");
      token = await this.authService.forceRefreshToken();
      response = await sendRequest(token);
    }
    const rawResponseText = await response.text();
    console.log(`[WhatsAppClient] Raw Text API Response Text (Status: ${response.status}):`, rawResponseText);
    if (!response.ok) {
      let errorParsed: WhatsAppApiErrorResponse | null = null;
      try { errorParsed = JSON.parse(rawResponseText); } catch (e) { console.warn("[WhatsAppClient] Text error response was not JSON:", rawResponseText); }
      console.error(`[WhatsAppClient] WhatsApp Text API Error Details (${response.status}):`, errorParsed || rawResponseText);
      throw new Error(`WhatsApp API error for text message: ${response.status} - ${errorParsed?.message || "Unknown API error details"}`);
    }
    const responseData = JSON.parse(rawResponseText);
    console.log("[WhatsAppClient] Successful Text API Response Data:", responseData);
    return responseData;
  }

  // --- sendTemplateMessage (COMPLETE FUNCTION WITH FIXES) ---
  /**
   * Sends a template message via the WhatsApp API.
   *
   * @param phone The recipient's phone number.
   * @param userName The user's name for the `{{1}}` text placeholder in the body.
   * @param fullSignedPdfUrl The complete pre-signed URL for the PDF (including S3 base URL and query parameters).
   * This value will be passed directly to the template's dynamic URL placeholder.
   * @param overrideTemplateId Optional: Override the default template ID. Can be string or number.
   * @returns {Promise<any>} The parsed API response on success.
   * @throws {Error} If the API call fails after retries.
   */
  public async sendTemplateMessage( 
    phone: string,
    userName: string,
    fullSignedPdfUrl: string, // This is the FULL signed URL received from /api/send-report
    overrideTemplateId?: string | number,
  ): Promise<any> {
    // FIX: Initialize numericTemplateIdToUse with a default value to prevent TS2454
    let numericTemplateIdToUse: number = this.defaultTemplateId; 

    // Logic to determine the numeric template ID to use (override or default)
    if (overrideTemplateId !== undefined && overrideTemplateId !== null) {
        const parsedOverride = parseInt(String(overrideTemplateId), 10);
        if (!isNaN(parsedOverride) && parsedOverride > 0) {
            numericTemplateIdToUse = parsedOverride;
            console.log(`[WhatsAppClient] Using override template ID: ${numericTemplateIdToUse}`);
        } else {
            console.warn(`[WhatsAppClient] Invalid overrideTemplateId '${overrideTemplateId}'. Falling back to default ID.`);
        }
    } else {
        console.log(`[WhatsAppClient] No overrideTemplateId provided. Using default ID: ${this.defaultTemplateId}`);
    }

    // This check remains important in case defaultTemplateId itself is misconfigured to 0
    if (numericTemplateIdToUse === 0) { 
        throw new Error("Template ID is 0, which is an invalid ID. Please set NEXT_PUBLIC_TEMPLATE_ID (in .env) or provide a valid override.");
    }

    console.log(`[WhatsAppClient] Debugging templateIdToUse (Final value for payload): ${numericTemplateIdToUse} (Type: ${typeof numericTemplateIdToUse})`);

    let token = await this.authService.getAuthToken();
    const formattedPhone = this.formatPhoneNumberForApi(phone);

    // Define the exact base URL prefix from your template that needs to be removed
    // IMPORTANT: Include the leading space from your template JSON if it's there
    const templateBaseUrlPrefix = ' https://astrokiran-public-bucket.s3.ap-south-1.amazonaws.com/'; // Note the leading space!

    let trimmedSignedUrl: string = fullSignedPdfUrl;
    if (fullSignedPdfUrl.startsWith(templateBaseUrlPrefix.trim())) { // Use .trim() for startsWith check for robustness
        trimmedSignedUrl = fullSignedPdfUrl.substring(templateBaseUrlPrefix.trim().length);
    } else if (fullSignedPdfUrl.startsWith(templateBaseUrlPrefix)) { // Check with space too if startsWith requires exact match
         trimmedSignedUrl = fullSignedPdfUrl.substring(templateBaseUrlPrefix.length);
    }
    // As a fallback, use replace just in case startsWith doesn't catch it
    trimmedSignedUrl = trimmedSignedUrl.replace(templateBaseUrlPrefix.trim(), ''); // Remove the prefix from the URL.

    // If for some reason the fullSignedPdfUrl doesn't start with the expected prefix,
    // we want to ensure we still send something, ideally the full URL, to avoid breaking it.
    // However, given the problem, it definitely starts with it.
    console.log(`[WhatsAppClient] Original Signed URL: ${fullSignedPdfUrl}`);
    console.log(`[WhatsAppClient] Trimmed Signed URL: ${trimmedSignedUrl}`);


    // Construct the 'values' array based on the template definition
    // Body has {{1}} which takes 'name' parameter with `name: "1"`
    // Button URL has {{1}} which takes `parameters[0].name: "2"`.
    // We are now sending the TRIMMED signed URL for parameter "2".
    const values: TemplateValue[] = [
      {
        name: "1", // Corresponds to {{1}} in the body text "नमस्ते {{1}}, ..."
        is_tenant_provided: true,
        is_storage_fetch: false,
        tenant_provide_value: userName
      },
      // --- ADDITION FOR DYNAMIC PDF BUTTON URL PART ---
      {
        // This 'name' MUST exactly match the "name" property in the button's "parameters" array
        // from your template JSON: "parameters": [ { "name": "2", ... } ]
        name: "2", 
        is_tenant_provided: true,
        is_storage_fetch: false,
        tenant_provide_value: trimmedSignedUrl // <--- CRITICAL CHANGE: Pass the TRIMMED signed URL here
      }
    ];
    
    // Debugging the values payload for template
    console.log("[WhatsAppClient] Template 'values' payload:", JSON.stringify(values, null, 2));


    const sendRequest = async (authToken: string) => {
      const payload: TemplateMessagePayload = {
        template_id: numericTemplateIdToUse,
        values: values,
      };
      
      console.log("[WhatsAppClient] Sending Template Message Payload:", JSON.stringify(payload, null, 2));

      // Construct the API URL with phone, tenantId, and language as query parameters
      const api_url_with_params = `${this.templateMessageUrl}?phone=${phone}&tenantId=${this.tenantId}&language=hi`;

      return await fetch(api_url_with_params, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
    };

    let response = await sendRequest(token);

    // Retry logic for 401 Unauthorized
    if (response.status === 401) {
      console.warn("[WhatsAppClient] WhatsApp API returned 401 Unauthorized. Refreshing token and retrying...");
      token = await this.authService.forceRefreshToken();
      response = await sendRequest(token);
    }

    const rawResponseText = await response.text();
    console.log(`[WhatsAppClient] Raw Template API Response Text (Status: ${response.status}):`, rawResponseText);

    // Error handling
    if (!response.ok) {
      let errorParsed: WhatsAppApiErrorResponse | null = null;
      try {
        errorParsed = JSON.parse(rawResponseText);
      } catch (e) {
        console.warn("[WhatsAppClient] Template error response was not JSON:", rawResponseText);
      }

      console.error(`[WhatsAppClient] WhatsApp Template API Error Details (${response.status}):`, errorParsed || rawResponseText);

      throw new Error(
          `WhatsApp API error for template message: ${response.status} - ` +
          `${errorParsed?.message || "Unknown API error details"}`
      );
    }

    const responseData = JSON.parse(rawResponseText);
    console.log("[WhatsAppClient] Successful Template API Response Data:", responseData);

    return responseData;
  }
}

// Export a single instance of the client for use in API routes
export const whatsappClient = WhatsAppClient.getInstance();