/**
 * @typedef {{id: string, name: string, price: number, oldPrice: number, imageUrl: string}} CartItem
 */

/**
 * @param {CartItem[]} cart
 * @param {CartItem} item
 * @returns {CartItem[]}
 */
export function addToCart(cart, item) {
    if (!item || !item.id) return cart;
    if (cart.some(c => c.id === item.id)) return cart;
    return [...cart, item];
}

/**
 * @param {CartItem[]} cart
 * @param {string} itemId
 * @returns {CartItem[]}
 */
export function removeFromCart(cart, itemId) {
    return cart.filter(item => item.id !== itemId);
}

/**
 * @param {CartItem[]} cart
 * @param {string} itemId
 * @returns {boolean}
 */
export function isInCart(cart, itemId) {
    return cart.some(item => item.id === itemId);
}

/**
 * @param {CartItem[]} cart
 * @returns {number}
 */
export function getCartTotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price || 0), 0);
}

/**
 * @param {CartItem[]} cart
 * @returns {number}
 */
export function getCartCount(cart) {
    return cart.length;
}
