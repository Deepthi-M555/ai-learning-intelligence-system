import {
    getCurrentUrl,
    getPageTitle,
    getElementText
} from "../utils/textUtils.js";

/**
 * Extract article title.
 */
function extractArticleTitle() {

    const title = document.querySelector("h1");

    return getElementText(title) || getPageTitle();

}

/**
 * Extract article content.
 */
function extractArticleContent() {

    const article =
        document.querySelector("main") ||
        document.querySelector("article");

    return getElementText(article);

}

/**
 * Extract documentation headings.
 */
function extractHeadings() {

    return Array.from(
        document.querySelectorAll("h2, h3")
    )
        .map(heading => getElementText(heading))
        .filter(Boolean);

}

/**
 * Main extractor.
 */
function extractMDNContent() {

    const content = extractArticleContent();

    return {

        platform: "MDN",

        sourceType: "Documentation",

        title: extractArticleTitle(),

        url: getCurrentUrl(),

        content,

        metadata: {

            headings: extractHeadings(),

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        },

        extractedAt: new Date().toISOString()

    };

}

export {
    extractMDNContent
};