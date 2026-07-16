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
 * - Extract difficulty and tags
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
 * Extract difficulty.
 */
function extractDifficulty() {

    const difficultyElement = Array.from(
        document.querySelectorAll("div")
    ).find(element => {

        const text = element.textContent?.trim();

        return (
            text === "Easy" ||
            text === "Medium" ||
            text === "Hard"
        );

    });

    return getElementText(difficultyElement);

}

/**
 * Extract topic tags.
 */
function extractTags() {

    return Array.from(
        document.querySelectorAll(
            '[class*="topic"], a[href*="/tag/"]'
        )
    )
        .map(tag => getElementText(tag))
        .filter(Boolean);

}

/**
 * Main extractor.
 */
function extractLeetCodeContent() {

    const content = extractProblemDescription();

    return {

        platform: "LeetCode",

        sourceType: "Problem",

        title: extractProblemTitle(),

        url: getCurrentUrl(),

        content,

        metadata: {

            difficulty: extractDifficulty(),

            tags: extractTags(),

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        },

        extractedAt: new Date().toISOString()

    };

}

export {
    extractLeetCodeContent
};