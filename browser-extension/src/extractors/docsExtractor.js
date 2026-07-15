import {
    getCurrentUrl,
    getPageTitle,
    getElementText
} from "../utils/textUtils.js";

function extractDocumentationContent() {

    const article =
        document.querySelector("main") ||
        document.querySelector("article") ||
        document.querySelector("[role='main']") ||
        document.body;

    return {
        platform: "Documentation",
        title: getPageTitle(),
        url: getCurrentUrl(),
        content: getElementText(article),
        extractedAt: new Date().toISOString()
    };

}

export {
    extractDocumentationContent
};