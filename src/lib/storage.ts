// ============================================
// Val4Me - Local Storage Utilities
// ============================================

const STORAGE_PREFIX = 'bemyval_';

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
 * Store a valentine's owner key
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

/**
 * Check if user owns a valentine
 */
export function isOwner(id: string): boolean {
  return getValentineKey(id) !== null;
}

/**
 * Get all stored valentines
 */
export function getAllStoredValentines(): StoredValentine[] {
  if (typeof window === 'undefined') return [];
  
  const valentines: StoredValentine[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '');
        valentines.push(data);
      } catch {
        // Skip invalid entries
      }
    }
  }
  
  return valentines.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
