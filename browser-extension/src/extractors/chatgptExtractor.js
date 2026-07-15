import {
    cleanText,
    getCurrentUrl,
    getPageTitle
} from "../utils/textUtils.js";

function extractConversation() {

    const main = document.querySelector("main");

    return cleanText(main?.innerText);

}

function extractChatGPTContent() {

    return {

        platform: "ChatGPT",

        title: getPageTitle(),

        url: getCurrentUrl(),

        content: extractConversation(),

        extractedAt: new Date().toISOString()

    };

}

export {
    extractChatGPTContent
};