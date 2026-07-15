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
        document.querySelector(".text") ||
        document.querySelector("article") ||
        document.querySelector("main");

    return getElementText(article);
}

function extractGeeksforGeeksContent() {
    return {
        platform: "GeeksforGeeks",
        title: extractArticleTitle(),
        url: getCurrentUrl(),
        content: extractArticleContent(),
        extractedAt: new Date().toISOString()
    };
}

export {
    extractGeeksforGeeksContent
};