import { authService } from './auth-service';

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
  created_at: string;
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
    const headers = authService.getAuthHeaders();

    const response = await fetch(`${this.baseURL}/api/v1/consultation`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Consultation creation failed: ${response.statusText}`);
    }

    return response.json();
  }

  async joinConsultation(consultationId: string, mode: string = 'chat'): Promise<JoinConsultationResponse> {
    const headers = authService.getAuthHeaders();

    const response = await fetch(`${this.baseURL}/api/v1/consultation/${consultationId}/join`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mode }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to join consultation: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentConsultation(): Promise<any> {
    const headers = authService.getAuthHeaders();

    const response = await fetch(`${this.baseURL}/api/v1/consultation/customers/current`, {
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get current consultation: ${response.statusText}`);
    }

    return response.json();
  }

  async completeConsultation(consultationId: string): Promise<void> {
    const headers = authService.getAuthHeaders();

    const response = await fetch(`${this.baseURL}/api/v1/consultation/${consultationId}/complete`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to complete consultation: ${response.statusText}`);
    }
  }

  async submitFeedback(consultationId: string, rating: number, feedback: string): Promise<void> {
    const headers = authService.getAuthHeaders();

    const response = await fetch(`${this.baseURL}/api/v1/consultation/${consultationId}/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        rating,
        feedback_text: feedback,
        issues: [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit feedback: ${response.statusText}`);
    }
  }

  async getConsultationHistory(): Promise<any[]> {
    const headers = authService.getAuthHeaders();

    const response = await fetch(`${this.baseURL}/api/v1/consultation/customers/history`, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get consultation history: ${response.statusText}`);
    }

    const data = await response.json();
    return data.consultations || [];
  }
}

export const consultationService = new ConsultationService();