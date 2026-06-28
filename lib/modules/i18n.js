/**
 * @typedef {Record<string, string>} TranslationMap
 * @typedef {Record<string, TranslationMap>} TranslationsDict
 */

/**
 * @param {TranslationsDict} translations
 * @param {string} lang
 * @param {string} key
 * @returns {string}
 */
export function getTranslation(translations, lang, key) {
    if (!translations || !key) return '';
    const langMap = translations[lang];
    if (langMap && langMap[key]) return langMap[key];
    const fallback = translations['en'];
    return (fallback && fallback[key]) || '';
}

/**
 * @param {TranslationsDict} translations
 * @param {string} lang
 * @returns {TranslationMap}
 */
export function getLanguageStrings(translations, lang) {
    if (!translations) return {};
    return translations[lang] || translations['en'] || {};
}

/**
 * Apply translations to all DOM elements with data-i18n attribute.
 * @param {TranslationsDict} translations
 * @param {string} lang
 */
export function applyTranslations(translations, lang) {
    if (typeof document === 'undefined') return;
    const strings = getLanguageStrings(translations, lang);
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (strings[key]) {
            element.innerHTML = strings[key];
        }
    });
}
