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
