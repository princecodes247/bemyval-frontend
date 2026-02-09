// ============================================
// Val4Me - Core Type Definitions
// ============================================

/**
 * A Valentine page created by a sender
 */
export interface ValentinePage {
  id: string;
  recipientName: string;
  message: string;
  anonymous: boolean;
  senderName?: string;
  ownerKeyHash: string;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Public valentine page data (safe to share)
 */
export interface PublicValentinePage {
  id: string;
  recipientName: string;
  message: string;
  anonymous: boolean;
  senderName?: string;
  theme: string;
  gifId: string;
  buttonBehavior: string;
  createdAt: Date;
  expiresAt: Date;
  hasResponded: boolean;
}

/**
 * A response from the recipient
 */
export interface ValentineResponse {
  id: string;
  pageId: string;
  answer: 'yes' | 'thinking';
  respondedAt: Date;
}

// ============================================
// API Request/Response Types
// ============================================

export interface CreateValentineRequest {
  recipientName: string;
  message: string;
  anonymous: boolean;
  senderName?: string;
  theme?: string;
  gifId?: string;
  buttonBehavior?: string;
}

export interface CreateValentineResponse {
  id: string;
  ownerKey: string;
  ownerToken?: string; // Returned when first valentine is created (client should store this)
  shareUrl: string;
}

export interface SubmitResponseRequest {
  answer: 'yes' | 'thinking';
}

export interface SubmitResponseResponse {
  success: boolean;
  answer: 'yes' | 'thinking';
  senderName?: string; // Revealed when anonymous valentine is accepted
}

export interface GetResponsesResponse {
  responses: ValentineResponse[];
  responded: boolean;
}

// ============================================
// API Error Types
// ============================================

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
