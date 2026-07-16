import {
    getCurrentUrl,
    getPageTitle,
    getElementText
} from "../utils/textUtils.js";

/**
 * Extract challenge title.
 */
function extractChallengeTitle() {

    const title =
        document.querySelector("h1") ||
        document.querySelector(".challenge-title");

    return getElementText(title) || getPageTitle();

}

/**
 * Extract challenge description.
 */
function extractChallengeDescription() {

    const description =
        document.querySelector(".challenge-body-html") ||
        document.querySelector("main");

    return getElementText(description);

}

/**
 * Extract difficulty.
 */
function extractDifficulty() {

    const difficulty =
        document.querySelector(".difficulty") ||
        document.querySelector("[data-analytics='difficulty']");

    return getElementText(difficulty);

}

/**
 * Extract challenge tags.
 */
function extractTags() {

    return Array.from(
        document.querySelectorAll(".tags a, .challenge-tag")
    )
        .map(tag => getElementText(tag))
        .filter(Boolean);

}

/**
 * Main extractor.
 */
function extractHackerRankContent() {

    const content = extractChallengeDescription();

    return {

        platform: "HackerRank",

        sourceType: "Problem",

        title: extractChallengeTitle(),

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
    extractHackerRankContent
};