/**
 * ============================================
 * AI Learning Intelligence System
 * Text Utilities
 * ============================================
 *
 * Shared helper functions used by
 * all extractors.
 */

/**
 * Removes unnecessary whitespace.
 */
function cleanText(text) {

    if (!text) {
        return "";
    }

    return text
        .replace(/\s+/g, " ")
        .replace(/\n+/g, " ")
        .trim();

}

/**
 * Returns current page title.
 */
function getPageTitle() {

    return document.title || "";

}

/**
 * Returns current page URL.
 */
function getCurrentUrl() {

    return window.location.href;

}

/**
 * Returns visible text from an element.
 */
function getElementText(element) {

    if (!element) {
        return "";
    }

    return cleanText(element.innerText);

}

export {
    cleanText,
    getPageTitle,
    getCurrentUrl,
    getElementText
};