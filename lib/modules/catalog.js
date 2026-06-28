/**
 * @typedef {{id: string, name: Record<string,string>, price: number, oldPrice: number, image: string, mockups: string[], features?: Record<string,string[]>, bestFor?: Record<string,string[]>, inStock: boolean}} Product
 * @typedef {{id: string, name: Record<string,string>, description: Record<string,string>, products: Product[]}} Collection
 * @typedef {{collections: Collection[], bundle?: Product, meta?: object}} CatalogData
 */

/**
 * Flatten all products from collections into a flat array for cart lookup.
 * @param {CatalogData} catalog
 * @param {string} lang
 * @returns {{id: string, name: string, price: number, oldPrice: number, imageUrl: string}[]}
 */
export function flattenProducts(catalog, lang = 'en') {
    if (!catalog || !catalog.collections) return [];
    const result = [];

    catalog.collections.forEach(col => {
        col.products.forEach(p => {
            result.push({
                id: p.id,
                name: p.name[lang] || p.name.en,
                price: p.price,
                oldPrice: p.oldPrice,
                imageUrl: p.image
            });
        });
    });

    if (catalog.bundle) {
        const b = catalog.bundle;
        result.push({
            id: b.id,
            name: b.name[lang] || b.name.en,
            price: b.price,
            oldPrice: b.oldPrice,
            imageUrl: b.image
        });
    }

    return result;
}

/**
 * Find a product by ID in all collections.
 * @param {CatalogData} catalog
 * @param {string} productId
 * @returns {Product | undefined}
 */
export function findProduct(catalog, productId) {
    if (!catalog || !catalog.collections) return undefined;
    for (const col of catalog.collections) {
        const found = col.products.find(p => p.id === productId);
        if (found) return found;
    }
    if (catalog.bundle && catalog.bundle.id === productId) return catalog.bundle;
    return undefined;
}

/**
 * Get all slide images for a product (main + mockups).
 * @param {Product} product
 * @returns {string[]}
 */
export function getProductSlides(product) {
    if (!product) return [];
    return [product.image, ...(product.mockups || [])];
}

/**
 * Get collection by ID.
 * @param {CatalogData} catalog
 * @param {string} collectionId
 * @returns {Collection | undefined}
 */
export function getCollection(catalog, collectionId) {
    if (!catalog || !catalog.collections) return undefined;
    return catalog.collections.find(c => c.id === collectionId);
}
