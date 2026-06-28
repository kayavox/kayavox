import { describe, it, expect } from 'vitest';
import { getTranslation, getLanguageStrings } from '../../lib/modules/i18n.js';

const testTranslations = {
    en: {
        greeting: 'Hello',
        farewell: 'Goodbye',
        nested: 'Nested value'
    },
    ru: {
        greeting: 'Привет',
        farewell: 'До свидания'
    },
    fr: {
        greeting: 'Bonjour'
    }
};

describe('i18n Module', () => {
    describe('getTranslation', () => {
        it('returns translation for given language', () => {
            expect(getTranslation(testTranslations, 'ru', 'greeting')).toBe('Привет');
        });

        it('falls back to English when key missing in target lang', () => {
            expect(getTranslation(testTranslations, 'fr', 'farewell')).toBe('Goodbye');
        });

        it('returns empty string for completely missing key', () => {
            expect(getTranslation(testTranslations, 'en', 'nonexistent')).toBe('');
        });

        it('returns empty string for null translations', () => {
            expect(getTranslation(null, 'en', 'greeting')).toBe('');
        });

        it('returns empty string for empty key', () => {
            expect(getTranslation(testTranslations, 'en', '')).toBe('');
        });

        it('returns English fallback when language not found', () => {
            expect(getTranslation(testTranslations, 'de', 'greeting')).toBe('Hello');
        });
    });

    describe('getLanguageStrings', () => {
        it('returns correct language map', () => {
            const result = getLanguageStrings(testTranslations, 'ru');
            expect(result.greeting).toBe('Привет');
        });

        it('falls back to English for unknown language', () => {
            const result = getLanguageStrings(testTranslations, 'de');
            expect(result.greeting).toBe('Hello');
        });

        it('returns empty object for null translations', () => {
            const result = getLanguageStrings(null, 'en');
            expect(result).toEqual({});
        });
    });
});
