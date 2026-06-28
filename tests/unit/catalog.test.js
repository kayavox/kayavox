import { describe, it, expect } from 'vitest';
import { flattenProducts, findProduct, getProductSlides, getCollection } from '../../lib/modules/catalog.js';

const testCatalog = {
    collections: [
        {
            id: 'coll-1',
            name: { en: 'Collection A', ru: 'Коллекция А' },
            description: { en: 'Desc A' },
            products: [
                {
                    id: 'prod-a1',
                    name: { en: 'Product A1', ru: 'Продукт А1' },
                    price: 19,
                    oldPrice: 45,
                    image: 'a1.webp',
                    mockups: ['a1-m1.webp', 'a1-m2.webp'],
                    inStock: true
                },
                {
                    id: 'prod-a2',
                    name: { en: 'Product A2' },
                    price: 14,
                    oldPrice: 35,
                    image: 'a2.webp',
                    mockups: [],
                    inStock: true
                }
            ]
        },
        {
            id: 'coll-2',
            name: { en: 'Collection B' },
            description: { en: 'Desc B' },
            products: [
                {
                    id: 'prod-b1',
                    name: { en: 'Product B1' },
                    price: 22,
                    oldPrice: 55,
                    image: 'b1.webp',
                    mockups: ['b1-m1.webp'],
                    inStock: true
                }
            ]
        }
    ],
    bundle: {
        id: 'prod-bundle',
        name: { en: 'Complete Set', ru: 'Полный набор' },
        price: 49,
        oldPrice: 149,
        image: 'bundle.webp',
        mockups: [],
        inStock: true
    }
};

describe('Catalog Module', () => {
    describe('flattenProducts', () => {
        it('flattens all products from collections plus bundle', () => {
            const result = flattenProducts(testCatalog, 'en');
            expect(result).toHaveLength(4);
        });

        it('includes bundle product', () => {
            const result = flattenProducts(testCatalog, 'en');
            const bundle = result.find(p => p.id === 'prod-bundle');
            expect(bundle).toBeDefined();
            expect(bundle.price).toBe(49);
        });

        it('uses correct language for names', () => {
            const result = flattenProducts(testCatalog, 'ru');
            expect(result[0].name).toBe('Продукт А1');
        });

        it('falls back to English', () => {
            const result = flattenProducts(testCatalog, 'de');
            expect(result[0].name).toBe('Product A1');
        });

        it('returns empty array for null catalog', () => {
            expect(flattenProducts(null)).toEqual([]);
        });

        it('returns empty array for catalog without collections', () => {
            expect(flattenProducts({})).toEqual([]);
        });
    });

    describe('findProduct', () => {
        it('finds product by id', () => {
            const result = findProduct(testCatalog, 'prod-a1');
            expect(result).toBeDefined();
            expect(result.name.en).toBe('Product A1');
        });

        it('finds product in second collection', () => {
            const result = findProduct(testCatalog, 'prod-b1');
            expect(result).toBeDefined();
        });

        it('finds bundle product', () => {
            const result = findProduct(testCatalog, 'prod-bundle');
            expect(result).toBeDefined();
            expect(result.price).toBe(49);
        });

        it('returns undefined for nonexistent id', () => {
            expect(findProduct(testCatalog, 'prod-999')).toBeUndefined();
        });

        it('returns undefined for null catalog', () => {
            expect(findProduct(null, 'prod-a1')).toBeUndefined();
        });
    });

    describe('getProductSlides', () => {
        it('returns main image plus mockups', () => {
            const product = testCatalog.collections[0].products[0];
            const slides = getProductSlides(product);
            expect(slides).toEqual(['a1.webp', 'a1-m1.webp', 'a1-m2.webp']);
        });

        it('returns only main image when no mockups', () => {
            const product = testCatalog.collections[0].products[1];
            const slides = getProductSlides(product);
            expect(slides).toEqual(['a2.webp']);
        });

        it('returns empty array for null product', () => {
            expect(getProductSlides(null)).toEqual([]);
        });
    });

    describe('getCollection', () => {
        it('finds collection by id', () => {
            const result = getCollection(testCatalog, 'coll-1');
            expect(result).toBeDefined();
            expect(result.products).toHaveLength(2);
        });

        it('returns undefined for nonexistent id', () => {
            expect(getCollection(testCatalog, 'coll-99')).toBeUndefined();
        });

        it('returns undefined for null catalog', () => {
            expect(getCollection(null, 'coll-1')).toBeUndefined();
        });
    });
});
