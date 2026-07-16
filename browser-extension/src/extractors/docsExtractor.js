import {
    getCurrentUrl,
    getPageTitle,
    getElementText
} from "../utils/textUtils.js";

/**
 * Extract documentation/tutorial content.
 */
function extractDocumentationContent() {

    const article =
        document.querySelector("main") ||
        document.querySelector("article") ||
        document.querySelector("[role='main']") ||
        document.body;

    const content = getElementText(article);

    return {

        platform: "Documentation",

        sourceType: "Documentation",

        title: getPageTitle(),

        url: getCurrentUrl(),

        content,

        metadata: {

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        },

        extractedAt: new Date().toISOString()

    };

}

export {
    extractDocumentationContent
};