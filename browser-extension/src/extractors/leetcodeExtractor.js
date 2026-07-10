/**
 * ============================================
 * AI Learning Intelligence System
 * LeetCode Extractor
 * ============================================
 *
 * Responsibilities:
 * - Extract LeetCode problem details
 * - Extract problem title
 * - Extract visible problem description
 *
 * NOT Responsible For:
 * - Backend communication
 * - AI processing
 * - Session management
 */

import {
    getCurrentUrl,
    getPageTitle,
    getElementText
} from "../utils/textUtils.js";

/**
 * Extract problem title.
 */
function extractProblemTitle() {

    const titleElement = document.querySelector(
        '[data-cy="question-title"]'
    );

    return getElementText(titleElement) || getPageTitle();

}

/**
 * Extract problem description.
 */
function extractProblemDescription() {

    const descriptionElement = document.querySelector(
        '[data-track-load="description_content"]'
    );

    return getElementText(descriptionElement);

}

/**
 * Main extractor.
 */
function extractLeetCodeContent() {

    return {

        platform: "LeetCode",

        title: extractProblemTitle(),

        url: getCurrentUrl(),

        content: extractProblemDescription(),

        extractedAt: new Date().toISOString()

    };

}

export {
    extractLeetCodeContent
};