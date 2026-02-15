/**
 * Tests for Constants
 */

import { describe, it, expect } from 'vitest';
import {
    DEFAULT_PASSING_SCORE,
    FINAL_EXAM_UNLOCK_THRESHOLD,
    DEFAULT_QUIZ_TIME_LIMIT,
    MAX_EXAM_TIME_LIMIT,
    MIN_TYPING_DELAY,
    MAX_TYPING_DELAY,
    SEARCH_DEBOUNCE_DELAY,
    AUTOSAVE_INTERVAL,
    API_TIMEOUT,
    MAX_FILE_SIZE,
    ALLOWED_FILE_EXTENSIONS,
    MAX_RETRY_ATTEMPTS,
    RETRY_DELAY,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    VISIBLE_PAGE_BUTTONS,
    TOAST_DURATION,
    SIDEBAR_ANIMATION_DURATION,
    STORAGE_PREFIX,
    SESSION_EXPIRY_HOURS,
    DB_NAME,
    DB_VERSION,
    BELT_LEVELS,
    BELT_DISPLAY_NAMES,
    BELT_MIN_SCORES,
    DEFAULT_ALPHA,
    Z_SCORE_95,
    Z_SCORE_99,
    DEFAULT_SUBGROUP_SIZE,
    CAPABILITY_THRESHOLD,
    MIN_PASSWORD_LENGTH,
    MAX_NAME_LENGTH,
    EMAIL_PATTERN,
    FEATURE_CHATBOT,
    FEATURE_CERTIFICATES,
    FEATURE_ANALYSIS_API,
} from './constants';

describe('Constants', () => {
    describe('Quiz & Certification Constants', () => {
        it('has correct default passing score', () => {
            expect(DEFAULT_PASSING_SCORE).toBe(70);
        });

        it('has correct final exam unlock threshold', () => {
            expect(FINAL_EXAM_UNLOCK_THRESHOLD).toBe(80);
        });

        it('has correct default quiz time limit', () => {
            expect(DEFAULT_QUIZ_TIME_LIMIT).toBe(30);
        });

        it('has correct max exam time limit', () => {
            expect(MAX_EXAM_TIME_LIMIT).toBe(60);
        });
    });

    describe('Timer & Animation Constants', () => {
        it('has correct min typing delay', () => {
            expect(MIN_TYPING_DELAY).toBe(500);
        });

        it('has correct max typing delay', () => {
            expect(MAX_TYPING_DELAY).toBe(1500);
        });

        it('has correct search debounce delay', () => {
            expect(SEARCH_DEBOUNCE_DELAY).toBe(300);
        });

        it('has correct autosave interval', () => {
            expect(AUTOSAVE_INTERVAL).toBe(30000);
        });
    });

    describe('API & Network Constants', () => {
        it('has correct API timeout', () => {
            expect(API_TIMEOUT).toBe(30000);
        });

        it('has correct max file size (10MB)', () => {
            expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
        });

        it('has correct allowed file extensions', () => {
            expect(ALLOWED_FILE_EXTENSIONS).toEqual(['.csv', '.xlsx', '.xls']);
        });

        it('has correct max retry attempts', () => {
            expect(MAX_RETRY_ATTEMPTS).toBe(3);
        });

        it('has correct retry delay', () => {
            expect(RETRY_DELAY).toBe(1000);
        });
    });

    describe('Pagination Constants', () => {
        it('has correct default page size', () => {
            expect(DEFAULT_PAGE_SIZE).toBe(20);
        });

        it('has correct max page size', () => {
            expect(MAX_PAGE_SIZE).toBe(100);
        });
    });

    describe('UI & Display Constants', () => {
        it('has correct visible page buttons', () => {
            expect(VISIBLE_PAGE_BUTTONS).toBe(5);
        });

        it('has correct toast duration', () => {
            expect(TOAST_DURATION).toBe(5000);
        });

        it('has correct sidebar animation duration', () => {
            expect(SIDEBAR_ANIMATION_DURATION).toBe(300);
        });
    });

    describe('Storage Constants', () => {
        it('has correct storage prefix', () => {
            expect(STORAGE_PREFIX).toBe('sixsigma_');
        });

        it('has correct session expiry hours', () => {
            expect(SESSION_EXPIRY_HOURS).toBe(24);
        });

        it('has correct DB name', () => {
            expect(DB_NAME).toBe('SixSigmaTrainingDB');
        });

        it('has correct DB version', () => {
            expect(DB_VERSION).toBe(1);
        });
    });

    describe('Belt Level Configuration', () => {
        it('has correct belt levels array', () => {
            expect(BELT_LEVELS).toEqual(['white', 'yellow', 'green', 'black', 'masterBlackBelt']);
        });

        it('has correct belt display names', () => {
            expect(BELT_DISPLAY_NAMES.white).toBe('White Belt');
            expect(BELT_DISPLAY_NAMES.yellow).toBe('Yellow Belt');
            expect(BELT_DISPLAY_NAMES.green).toBe('Green Belt');
            expect(BELT_DISPLAY_NAMES.black).toBe('Black Belt');
            expect(BELT_DISPLAY_NAMES.masterBlackBelt).toBe('Master Black Belt');
        });

        it('has correct belt minimum scores', () => {
            expect(BELT_MIN_SCORES.white).toBe(60);
            expect(BELT_MIN_SCORES.yellow).toBe(65);
            expect(BELT_MIN_SCORES.green).toBe(70);
            expect(BELT_MIN_SCORES.black).toBe(75);
            expect(BELT_MIN_SCORES.masterBlackBelt).toBe(80);
        });

        it('has ascending minimum scores', () => {
            const scores = BELT_LEVELS.map(level => BELT_MIN_SCORES[level]);
            for (let i = 1; i < scores.length; i++) {
                expect(scores[i]!).toBeGreaterThan(scores[i - 1]!);
            }
        });
    });

    describe('Statistical Constants', () => {
        it('has correct default alpha', () => {
            expect(DEFAULT_ALPHA).toBe(0.05);
        });

        it('has correct Z-score for 95% confidence', () => {
            expect(Z_SCORE_95).toBe(1.96);
        });

        it('has correct Z-score for 99% confidence', () => {
            expect(Z_SCORE_99).toBe(2.576);
        });

        it('has correct default subgroup size', () => {
            expect(DEFAULT_SUBGROUP_SIZE).toBe(5);
        });

        it('has correct capability threshold', () => {
            expect(CAPABILITY_THRESHOLD).toBe(1.33);
        });
    });

    describe('Validation Constants', () => {
        it('has correct min password length', () => {
            expect(MIN_PASSWORD_LENGTH).toBe(8);
        });

        it('has correct max name length', () => {
            expect(MAX_NAME_LENGTH).toBe(100);
        });

        it('has valid email pattern', () => {
            expect(EMAIL_PATTERN).toBeInstanceOf(RegExp);
            expect(EMAIL_PATTERN.test('test@example.com')).toBe(true);
            expect(EMAIL_PATTERN.test('invalid')).toBe(false);
            expect(EMAIL_PATTERN.test('@example.com')).toBe(false);
        });
    });

    describe('Feature Flags', () => {
        it('has chatbot feature enabled', () => {
            expect(FEATURE_CHATBOT).toBe(true);
        });

        it('has certificates feature enabled', () => {
            expect(FEATURE_CERTIFICATES).toBe(true);
        });

        it('has analysis API feature enabled', () => {
            expect(FEATURE_ANALYSIS_API).toBe(true);
        });
    });
});
