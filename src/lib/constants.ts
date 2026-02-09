// ============================================
// BemyVal - Constants & Presets
// ============================================

/**
 * App name constant
 */
export const APP_NAME = 'BemyVal';

/**
 * Message presets for valentine creation
 */
export const MESSAGE_PRESETS = {
  sweet: [
    "I don't want chocolates. I want you.",
    "This is me being brave.",
    "Every love story is beautiful, but ours could be my favorite.",
    "You make my heart skip a beat. Every. Single. Time.",
    "I've been meaning to tell you something... 💕"
  ],
  funny: [
    "This took more courage than my exams.",
    "My friends said ask you. So here I am.",
    "I promise I'm cooler than this message makes me look.",
    "Is it hot in here or is it just my nervousness?",
    "I rehearsed this 47 times. Still nervous."
  ],
  bold: [
    "Let's stop pretending.",
    "You already know the answer.",
    "Life's too short for maybes.",
    "No games. Just us.",
    "I'm done waiting. Are you?"
  ]
} as const;

/**
 * Button text progressions for the playful "no" button
 */
export const BUTTON_PROGRESSIONS = [
  "Let me think 😅",
  "Are you sure?",
  "Don't do this 😭",
  "Last chance 👀",
  "Fine... if you must 💔"
] as const;

/**
 * Celebration messages after saying yes
 */
export const YES_MESSAGES = [
  "You just made someone's entire year! 💖",
  "This is the best Valentine's Day ever! 🎉",
  "Love wins! 💕",
  "Someone is doing a happy dance right now! 💃",
  "You have no idea how happy you just made them! 🥰"
] as const;

/**
 * Default expiration: February 14, 2026 at 23:59:59
 */
export const DEFAULT_EXPIRY = new Date('2026-02-14T23:59:59');

/**
 * Expired page message
 */
export const EXPIRED_MESSAGE = "This Valentine has passed 💌";

/**
 * Device ownership warning message
 */
export const OWNERSHIP_WARNING = 
  "Replies can only be viewed on the device used to create this page.";

// ============================================
// Customization Options
// ============================================

/**
 * GIF options for valentine customization
 */
export const GIF_OPTIONS = [
  { id: 'none', label: 'No GIF', preview: null, url: null },
  { id: 'hearts', label: 'Hearts', preview: '💕', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDh4Z2o4eG5qcjVqcXNxNmV6ZHRhNXNmNnRuZm41ZzV5eXJ0NWl6eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/26BRv0ThflsHCqDrG/giphy.gif' },
  { id: 'roses', label: 'Roses', preview: '🌹', url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXFubWI0emloeGswMXNqMXEwcnVpeHFwanFyNWV4dW12d3FpZHlxNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Zl7u48zLVFgLpRwq6f/giphy.gif' },
  { id: 'seal', label: 'Cute Seal', preview: '✨', url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzk5M2Eyd3dmZDRnMjRpOGR3MWQ2NmJiMXRyemMycmdxOWVoN2pvaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LBMiDWkCw0e53UOcm0/giphy.gif' },
  { id: 'kiss', label: 'Kiss', preview: '💋', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXc0eTJ1cjB0am94bjBqb3F4ZGRsNnF5dXdicHN5bmc0NWQ4bzY0OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l0MYGb1LuZ3n7dRnO/giphy.gif' },
  { id: 'lovebear', label: 'Love Bear', preview: '💋', url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXZ1anNtNWwwNTVyaGN4YW50am5yY2hjdTE1cnVrMG4yN2hsZzBoZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SYo1DFS8NLhhqzzjMU/giphy.gif' },
  { id: 'catplease', label: 'Please Cat', preview: '💋', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hxOWd5Znd6aHp1YWI0bDQ5cHlvZWI3Z2hzamVmYmozM3pmbjIxeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zZbf6UpZslp3nvFjIR/giphy.gif' },
  { id: 'donkey', label: 'Donkey', preview: '💋', url: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnpramt0NzdpMjV1ejE1dmMzc2RmcHd5dWZnejk3MXUwbjJrZ3FwaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KEf7gXqvQ8B3SWnUid/giphy.gif' },
] as const;

/**
 * Theme color options - more diverse and expressive
 */
export const THEME_OPTIONS = [
  // Romantic & Classic
  { id: 'romantic', name: 'Romantic Pink', primary: '#FF6B81', secondary: '#FFD6E0', accent: '#FFF0F3' },
  { id: 'classic', name: 'Classic Red', primary: '#DC2626', secondary: '#FCA5A5', accent: '#FEE2E2' },
  
  // Soft & Dreamy
  { id: 'lavender', name: 'Lavender Dream', primary: '#8B5CF6', secondary: '#C4B5FD', accent: '#EDE9FE' },
  { id: 'blush', name: 'Soft Blush', primary: '#EC4899', secondary: '#F9A8D4', accent: '#FCE7F3' },
  
  // Warm & Bold
  { id: 'sunset', name: 'Sunset Glow', primary: '#F97316', secondary: '#FDBA74', accent: '#FFF7ED' },
  { id: 'golden', name: 'Golden Hour', primary: '#D97706', secondary: '#FCD34D', accent: '#FFFBEB' },
  
  // Cool & Elegant  
  { id: 'ocean', name: 'Ocean Breeze', primary: '#0EA5E9', secondary: '#7DD3FC', accent: '#F0F9FF' },
  { id: 'mint', name: 'Mint Fresh', primary: '#10B981', secondary: '#6EE7B7', accent: '#ECFDF5' },
  
  // Bold & Modern
  { id: 'midnight', name: 'Midnight Romance', primary: '#6366F1', secondary: '#A5B4FC', accent: '#EEF2FF' },
  { id: 'noir', name: 'Elegant Noir', primary: '#F9A8D4', secondary: '#F472B6', accent: '#1a1a2e', textColor: '#FAF5FF' },
] as const;

/**
 * Button behavior options for the "No" button
 */
export const BUTTON_BEHAVIORS = [
  { id: 'dodge', label: 'Playful Dodge', emoji: '🏃', description: 'Runs away from your cursor' },
  { id: 'shrink', label: 'Shrink Away', emoji: '🫣', description: 'Gets smaller each click' },
  { id: 'still', label: 'Stay Still', emoji: '🧘', description: 'A normal, polite button' },
] as const;

export type GifId = typeof GIF_OPTIONS[number]['id'];
export type ThemeId = typeof THEME_OPTIONS[number]['id'];
export type ButtonBehaviorId = typeof BUTTON_BEHAVIORS[number]['id'];
