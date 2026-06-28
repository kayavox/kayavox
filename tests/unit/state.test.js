import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAppState, isValidLocale, persistCart, persistLocale, getStoredCart, getStoredLocale } from '../../lib/modules/state.js';

describe('State Module', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('isValidLocale', () => {
        it('accepts en', () => expect(isValidLocale('en')).toBe(true));
        it('accepts ru', () => expect(isValidLocale('ru')).toBe(true));
        it('accepts fr', () => expect(isValidLocale('fr')).toBe(true));
        it('rejects de', () => expect(isValidLocale('de')).toBe(false));
        it('rejects empty string', () => expect(isValidLocale('')).toBe(false));
        it('rejects null', () => expect(isValidLocale(null)).toBe(false));
    });

    describe('createAppState', () => {
        it('creates default state', () => {
            const state = createAppState();
            expect(state.cart).toEqual([]);
            expect(state.isCartOpen).toBe(false);
            expect(state.isMenuOpen).toBe(false);
            expect(state.locale).toBe('en');
        });

        it('applies overrides', () => {
            const state = createAppState({ locale: 'ru', isCartOpen: true });
            expect(state.locale).toBe('ru');
            expect(state.isCartOpen).toBe(true);
        });

        it('reads stored locale', () => {
            localStorage.setItem('kayavox_locale', 'fr');
            const state = createAppState();
            expect(state.locale).toBe('fr');
        });

        it('reads stored cart', () => {
            const cart = [{ id: 'p1', name: 'Test', price: 10 }];
            localStorage.setItem('kayavox_cart', JSON.stringify(cart));
            const state = createAppState();
            expect(state.cart).toHaveLength(1);
        });

        it('handles corrupted localStorage gracefully', () => {
            localStorage.setItem('kayavox_cart', 'NOT_JSON{{{');
            const state = createAppState();
            expect(state.cart).toEqual([]);
        });
    });

    describe('getStoredCart', () => {
        it('returns empty array when nothing stored', () => {
            expect(getStoredCart()).toEqual([]);
        });

        it('parses stored cart', () => {
            const cart = [{ id: 'p1' }, { id: 'p2' }];
            localStorage.setItem('kayavox_cart', JSON.stringify(cart));
            expect(getStoredCart()).toHaveLength(2);
        });

        it('returns empty on invalid JSON', () => {
            localStorage.setItem('kayavox_cart', '{bad');
            expect(getStoredCart()).toEqual([]);
        });
    });

    describe('getStoredLocale', () => {
        it('returns en by default', () => {
            expect(getStoredLocale()).toBe('en');
        });

        it('returns stored valid locale', () => {
            localStorage.setItem('kayavox_locale', 'ru');
            expect(getStoredLocale()).toBe('ru');
        });

        it('returns en for invalid stored locale', () => {
            localStorage.setItem('kayavox_locale', 'xyz');
            expect(getStoredLocale()).toBe('en');
        });
    });

    describe('persistCart', () => {
        it('saves cart to localStorage', () => {
            const cart = [{ id: 'p1', price: 10 }];
            persistCart(cart);
            expect(JSON.parse(localStorage.getItem('kayavox_cart'))).toEqual(cart);
        });
    });

    describe('persistLocale', () => {
        it('saves locale to localStorage', () => {
            persistLocale('fr');
            expect(localStorage.getItem('kayavox_locale')).toBe('fr');
        });
    });
});
