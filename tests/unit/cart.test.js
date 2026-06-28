import { describe, it, expect } from 'vitest';
import { addToCart, removeFromCart, isInCart, getCartTotal, getCartCount } from '../../lib/modules/cart.js';

describe('Cart Module', () => {
    const mockItem = { id: 'prod-1', name: 'Test', price: 19, oldPrice: 45, imageUrl: 'img.webp' };
    const mockItem2 = { id: 'prod-2', name: 'Test 2', price: 14, oldPrice: 35, imageUrl: 'img2.webp' };

    describe('addToCart', () => {
        it('adds item to empty cart', () => {
            const result = addToCart([], mockItem);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('prod-1');
        });

        it('does not add duplicate items', () => {
            const result = addToCart([mockItem], mockItem);
            expect(result).toHaveLength(1);
        });

        it('adds different items', () => {
            const result = addToCart([mockItem], mockItem2);
            expect(result).toHaveLength(2);
        });

        it('does not mutate original array', () => {
            const original = [mockItem];
            const result = addToCart(original, mockItem2);
            expect(original).toHaveLength(1);
            expect(result).toHaveLength(2);
        });

        it('returns original cart when item is null', () => {
            const cart = [mockItem];
            expect(addToCart(cart, null)).toBe(cart);
        });

        it('returns original cart when item has no id', () => {
            const cart = [mockItem];
            expect(addToCart(cart, { name: 'no-id' })).toBe(cart);
        });
    });

    describe('removeFromCart', () => {
        it('removes item by id', () => {
            const result = removeFromCart([mockItem, mockItem2], 'prod-1');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('prod-2');
        });

        it('returns same length if id not found', () => {
            const result = removeFromCart([mockItem], 'nonexistent');
            expect(result).toHaveLength(1);
        });

        it('returns empty array when all removed', () => {
            const result = removeFromCart([mockItem], 'prod-1');
            expect(result).toHaveLength(0);
        });
    });

    describe('isInCart', () => {
        it('returns true when item exists', () => {
            expect(isInCart([mockItem], 'prod-1')).toBe(true);
        });

        it('returns false when item missing', () => {
            expect(isInCart([mockItem], 'prod-99')).toBe(false);
        });

        it('returns false for empty cart', () => {
            expect(isInCart([], 'prod-1')).toBe(false);
        });
    });

    describe('getCartTotal', () => {
        it('sums prices correctly', () => {
            expect(getCartTotal([mockItem, mockItem2])).toBe(33);
        });

        it('returns 0 for empty cart', () => {
            expect(getCartTotal([])).toBe(0);
        });

        it('handles single item', () => {
            expect(getCartTotal([mockItem])).toBe(19);
        });
    });

    describe('getCartCount', () => {
        it('counts items', () => {
            expect(getCartCount([mockItem, mockItem2])).toBe(2);
        });

        it('returns 0 for empty', () => {
            expect(getCartCount([])).toBe(0);
        });
    });
});
