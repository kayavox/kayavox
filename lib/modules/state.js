/**
 * @typedef {{cart: Array, isCartOpen: boolean, isMenuOpen: boolean, locale: string}} AppState
 */

const STORAGE_KEY_CART = 'kayavox_cart';
const STORAGE_KEY_LOCALE = 'kayavox_locale';
const VALID_LOCALES = ['en', 'ru', 'fr'];

export function getStoredCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_CART);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function getStoredLocale() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_LOCALE);
        return VALID_LOCALES.includes(stored) ? stored : 'en';
    } catch {
        return 'en';
    }
}

export function createAppState(overrides = {}) {
    return {
        cart: overrides.cart ?? getStoredCart(),
        isCartOpen: overrides.isCartOpen ?? false,
        isMenuOpen: overrides.isMenuOpen ?? false,
        locale: overrides.locale ?? getStoredLocale()
    };
}

export function isValidLocale(locale) {
    return VALID_LOCALES.includes(locale);
}

export function persistCart(cart) {
    try {
        localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch { /* silent */ }
}

export function persistLocale(locale) {
    try {
        localStorage.setItem(STORAGE_KEY_LOCALE, locale);
    } catch { /* silent */ }
}
