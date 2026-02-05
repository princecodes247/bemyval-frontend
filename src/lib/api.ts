// ============================================
// Val4Me - API Client
// ============================================

import type {
  CreateValentineRequest,
  CreateValentineResponse,
  PublicValentinePage,
  SubmitResponseRequest,
  SubmitResponseResponse,
  GetResponsesResponse,
  ApiError,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiError;
    }

    return data as T;
  }

  /**
   * Create a new valentine page
   */
  async createValentine(data: CreateValentineRequest): Promise<CreateValentineResponse> {
    return this.request<CreateValentineResponse>('/api/valentine', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a valentine page (public data)
   */
  async getValentine(id: string): Promise<PublicValentinePage> {
    return this.request<PublicValentinePage>(`/api/valentine/${id}`);
  }

  /**
   * Submit a response to a valentine
   */
  async submitResponse(id: string, data: SubmitResponseRequest): Promise<SubmitResponseResponse> {
    return this.request<SubmitResponseResponse>(`/api/valentine/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get responses for a valentine (requires owner key)
   */
  async getResponses(id: string, ownerKey: string): Promise<GetResponsesResponse> {
    return this.request<GetResponsesResponse>(`/api/valentine/${id}/response`, {
      headers: {
        'X-Owner-Key': ownerKey,
      },
    });
  }
}

export const api = new ApiClient(API_BASE);
