/**
 * ============================================
 * AI Learning Intelligence System
 * Generic Extractor
 * ============================================
 *
 * Responsibilities:
 * - Extract learning content from any webpage.
 * - Used when no platform-specific extractor exists.
 *
 * NOT Responsible For:
 * - Backend communication
 * - AI processing
 * - Session management
 */

/**
 * Remove unnecessary whitespace.
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
 * Extract visible text from the webpage.
 */
function extractVisibleContent() {

    const body = document.body;

    if (!body) {
        return "";
    }

    return cleanText(body.innerText);

}

/**
 * Extract page title.
 */
function extractTitle() {

    return document.title || "";

}

/**
 * Main extractor.
 */
function extractGenericContent() {

    return {
        platform: "Generic",
        title: extractTitle(),
        url: window.location.href,
        content: extractVisibleContent(),
        extractedAt: new Date().toISOString()
    };

}

export {
    extractGenericContent
};