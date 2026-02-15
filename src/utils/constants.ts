/**
 * Application-wide constants
 * Centralized configuration to avoid magic numbers throughout the codebase
 */

// Quiz & Certification Constants
export const DEFAULT_PASSING_SCORE = 70;
export const FINAL_EXAM_UNLOCK_THRESHOLD = 80;
export const DEFAULT_QUIZ_TIME_LIMIT = 30;
export const MAX_EXAM_TIME_LIMIT = 60;

// Timer & Animation Constants
export const MIN_TYPING_DELAY = 500;
export const MAX_TYPING_DELAY = 1500;
export const SEARCH_DEBOUNCE_DELAY = 300;
export const AUTOSAVE_INTERVAL = 30000;

// API & Network Constants
export const API_TIMEOUT = 30000;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_FILE_EXTENSIONS = ['.csv', '.xlsx', '.xls'] as const;
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000;

// Pagination Constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// UI & Display Constants
export const VISIBLE_PAGE_BUTTONS = 5;
export const TOAST_DURATION = 5000;
export const SIDEBAR_ANIMATION_DURATION = 300;

// Storage Constants
export const STORAGE_PREFIX = 'sixsigma_';
export const SESSION_EXPIRY_HOURS = 24;
export const DB_NAME = 'SixSigmaTrainingDB';
export const DB_VERSION = 1;

// Belt Level Configuration
export const BELT_LEVELS = ['white', 'yellow', 'green', 'black', 'masterBlackBelt'] as const;
export const BELT_DISPLAY_NAMES: Record<string, string> = {
    white: 'White Belt',
    yellow: 'Yellow Belt',
    green: 'Green Belt',
    black: 'Black Belt',
    masterBlackBelt: 'Master Black Belt',
};
export const BELT_MIN_SCORES: Record<string, number> = {
    white: 60,
    yellow: 65,
    green: 70,
    black: 75,
    masterBlackBelt: 80,
};

// Statistical Constants
export const DEFAULT_ALPHA = 0.05;
export const Z_SCORE_95 = 1.96;
export const Z_SCORE_99 = 2.576;
export const DEFAULT_SUBGROUP_SIZE = 5;
export const CAPABILITY_THRESHOLD = 1.33;

// Validation Constants
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_NAME_LENGTH = 100;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Feature Flags
export const FEATURE_CHATBOT = true;
export const FEATURE_CERTIFICATES = true;
export const FEATURE_ANALYSIS_API = true;
