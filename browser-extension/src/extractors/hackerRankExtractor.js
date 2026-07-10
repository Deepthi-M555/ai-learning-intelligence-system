import {
    getCurrentUrl,
    getPageTitle,
    getElementText
} from "../utils/textUtils.js";

function extractChallengeTitle() {
    const title =
        document.querySelector("h1") ||
        document.querySelector(".challenge-title");

    return getElementText(title) || getPageTitle();
}

function extractChallengeDescription() {
    const description =
        document.querySelector(".challenge-body-html") ||
        document.querySelector("main");

    return getElementText(description);
}

function extractHackerRankContent() {
    return {
        platform: "HackerRank",
        title: extractChallengeTitle(),
        url: getCurrentUrl(),
        content: extractChallengeDescription(),
        extractedAt: new Date().toISOString()
    };
}

export {
    extractHackerRankContent
};