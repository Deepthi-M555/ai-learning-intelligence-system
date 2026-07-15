import {
    cleanText,
    getCurrentUrl,
    getPageTitle,
    getElementText
} from "../utils/textUtils.js";

function extractTitle() {

    const title = document.querySelector(
        "h1.ytd-watch-metadata"
    );

    return getElementText(title) || getPageTitle();

}

function extractDescription() {

    const description = document.querySelector(
        "#description-inline-expander"
    );

    return getElementText(description);

}

function extractTranscript() {

    const transcript = document.querySelector(
        "ytd-transcript-renderer"
    );

    return getElementText(transcript);

}

function extractLearningContent() {

    const sections = [];

    const description = extractDescription();

    const transcript = extractTranscript();

    if (description) {
        sections.push(description);
    }

    if (transcript) {
        sections.push(transcript);
    }

    return sections.join("\n\n");

}

function extractYouTubeContent() {

    return {

        platform: "YouTube",

        title: extractTitle(),

        url: getCurrentUrl(),

        content: extractLearningContent(),

        extractedAt: new Date().toISOString()

    };

}

export {
    extractYouTubeContent
};