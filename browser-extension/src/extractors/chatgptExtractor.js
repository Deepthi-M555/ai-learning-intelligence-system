import {
    cleanText,
    getCurrentUrl,
    getPageTitle
} from "../utils/textUtils.js";

/**
 * Extract complete conversation.
 */
function extractConversation() {

    const main = document.querySelector("main");

    return cleanText(main?.innerText);

}

/**
 * Count user prompts.
 */
function getPromptCount() {

    const conversation = extractConversation();

    if (!conversation) {
        return 0;
    }

    return conversation
        .split("\n")
        .filter(line => line.trim().length > 0)
        .length;

}

/**
 * Extract ChatGPT learning content.
 */
function extractChatGPTContent() {

    const conversation = extractConversation();

    return {

        platform: "ChatGPT",

        sourceType: "Conversation",

        title: getPageTitle(),

        url: getCurrentUrl(),

        content: conversation,

        metadata: {

            promptCount: getPromptCount(),

            conversationLength: conversation.length,

            language: document.documentElement.lang || "en"

        },

        extractedAt: new Date().toISOString()

    };

}

export {
    extractChatGPTContent
};