import {
    getCurrentUrl,
    getPageTitle,
    getElementText
} from "../utils/textUtils.js";

function extractArticleTitle() {
    const title = document.querySelector("h1");
    return getElementText(title) || getPageTitle();
}

function extractArticleContent() {
    const article =
        document.querySelector("main") ||
        document.querySelector("article");

    return getElementText(article);
}

function extractMDNContent() {
    return {
        platform: "MDN",
        title: extractArticleTitle(),
        url: getCurrentUrl(),
        content: extractArticleContent(),
        extractedAt: new Date().toISOString()
    };
}

export {
    extractMDNContent
};