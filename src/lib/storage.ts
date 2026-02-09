// ============================================
// Val4Me - Local Storage Utilities
// ============================================

const OWNER_TOKEN_KEY = 'bemyval_token';
const STORAGE_PREFIX = 'bemyval_';

// ============================================
// Owner Token - Links all valentines to a user
// ============================================

/**
 * Set the owner token (received from backend on first valentine creation)
 */
export function setOwnerToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OWNER_TOKEN_KEY, token);
}

/**
 * Get the owner token (returns null if doesn't exist)
 */
export function getOwnerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(OWNER_TOKEN_KEY);
}

/**
 * Check if user has an owner token
 */
export function hasOwnerToken(): boolean {
  return getOwnerToken() !== null;
}

// ============================================
// Per-Valentine Keys - For accessing responses
// ============================================

interface StoredValentine {
  id: string;
  ownerKey: string;
  createdAt: string;
}

/**
 * Get the storage key for a valentine
 */
function getKey(id: string): string {
  return `${STORAGE_PREFIX}${id}`;
}

/**
 * Store a valentine's owner key (for accessing responses)
 */
export function storeValentineKey(id: string, ownerKey: string): void {
  if (typeof window === 'undefined') return;
  
  const data: StoredValentine = {
    id,
    ownerKey,
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(getKey(id), JSON.stringify(data));
}

/**
 * Get a stored owner key for a valentine
 */
export function getValentineKey(id: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(getKey(id));
  if (!stored) return null;
  
  try {
    const data: StoredValentine = JSON.parse(stored);
    return data.ownerKey;
  } catch {
    return null;
  }
}

