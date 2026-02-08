// ============================================
// Val4Me - Constants & Presets
// ============================================

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
  { id: 'roses', label: 'Roses', preview: '🌹', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWo4NHFlcjVnMXd4ZnVxdzd1M2RhNjV4a2VxbWV5aWJ0d2RwdHJqdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/lOqJlNzOXVJ9rKPfFu/giphy.gif' },
  { id: 'sparkle', label: 'Sparkles', preview: '✨', url: 'https://media.giphy.com/media/xUA7aZhmvN7KEFDAEY/giphy.gif' },
  { id: 'kiss', label: 'Kiss', preview: '💋', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXc0eTJ1cjB0am94bjBqb3F4ZGRsNnF5dXdicHN5bmc0NWQ4bzY0OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l0MYGb1LuZ3n7dRnO/giphy.gif' },
] as const;

/**
 * Theme color options
 */
export const THEME_OPTIONS = [
  { id: 'romantic', name: 'Romantic Pink', primary: '#FF6B81', secondary: '#FFC3A0' },
  { id: 'classic', name: 'Classic Red', primary: '#E53935', secondary: '#FFCDD2' },
  { id: 'lavender', name: 'Lavender Dream', primary: '#9575CD', secondary: '#E1BEE7' },
  { id: 'sunset', name: 'Sunset Glow', primary: '#FF7043', secondary: '#FFE0B2' },
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
