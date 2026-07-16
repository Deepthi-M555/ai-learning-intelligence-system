/**
 * ============================================
 * AI Learning Intelligence System
 * Content Script
 * ============================================
 *
 * Standalone Content Script
 * (No ES Module Imports)
 */

console.log("Content Script Loaded");
let lastUrl = location.href;

let lastSignature = "";

let mutationTimer = null;
/* ============================================
   Constants
============================================ */

const MESSAGE_TYPES = {

    PAGE_CONTENT: "PAGE_CONTENT",

    SESSION_END: "SESSION_END",

    PING: "PING"

};

/* ============================================
   Utility Functions
============================================ */

function cleanText(text) {

    if (!text) {
        return "";
    }

    return text
        .replace(/\s+/g, " ")
        .replace(/\n+/g, " ")
        .trim();

}

function getCurrentUrl() {

    return window.location.href;

}

function getPageTitle() {

    return document.title || "";

}

function getElementText(element) {

    if (!element) {
        return "";
    }

    return cleanText(element.innerText);

}

/* ============================================
   Common Payload Builder
============================================ */

function createPayload({

    platform,

    sourceType,

    title,

    content,

    metadata = {}

}) {

    return {

        platform,

        sourceType,

        title,

        url: getCurrentUrl(),

        content,

        metadata,

        extractedAt: new Date().toISOString()

    };

}

/* ============================================
   Platform Detection
============================================ */

function detectPlatform() {

    const url = window.location.href;

    if (url.includes("chatgpt.com")) {

        return "ChatGPT";

    }

    if (url.includes("youtube.com")) {

        return "YouTube";

    }

    if (url.includes("leetcode.com")) {

        return "LeetCode";

    }

    if (url.includes("geeksforgeeks.org")) {

        return "GeeksforGeeks";

    }

    if (url.includes("hackerrank.com")) {

        return "HackerRank";

    }

    if (url.includes("developer.mozilla.org")) {

        return "MDN";

    }

    if (

        url.includes("docs.") ||

        url.includes("/docs/")

    ) {

        return "Documentation";

    }

    return "Generic";

}

/* ============================================
   ChatGPT Extractor
============================================ */

function extractChatGPTContent() {

    const messages = Array.from(
        document.querySelectorAll("[data-message-author-role]")
    );

    console.log("Messages Found:", messages);
    console.log("Messages Count:", messages.length);

messages.forEach((message, index) => {
    console.log(`Message ${index}:`, message.innerText);
});

    const conversation = messages
        .map((message, index) => {

            console.log(
                `Message ${index}:`,
                message.innerText
            );

            return message.innerText;

        })
        .filter(Boolean)
        .join("\n\n");

    console.log("Conversation:", conversation);

    return createPayload({

        platform: "ChatGPT",

        sourceType: "Conversation",

        title: getPageTitle(),

        content: conversation,

        metadata: {

            messageCount: messages.length,

            conversationLength: conversation.length,

            language: document.documentElement.lang || "en"

        }

    });

}

/* ============================================
   LeetCode Extractor
============================================ */

function extractLeetCodeContent() {

    const title =
        getElementText(
            document.querySelector('[data-cy="question-title"]')
        ) || getPageTitle();

    const description =
        getElementText(
            document.querySelector(
                '[data-track-load="description_content"]'
            )
        );

    let difficulty = "";

    document.querySelectorAll("div").forEach(div => {

        const text = div.textContent?.trim();

        if (
            text === "Easy" ||
            text === "Medium" ||
            text === "Hard"
        ) {

            difficulty = text;

        }

    });

    const tags = Array.from(
        document.querySelectorAll(
            'a[href*="/tag/"]'
        )
    ).map(tag => getElementText(tag));

    return createPayload({

        platform: "LeetCode",

        sourceType: "Problem",

        title,

        content: description,

        metadata: {

            difficulty,

            tags,

            contentLength: description.length,

            language: document.documentElement.lang || "en"

        }

    });

}

/* ============================================
   GeeksforGeeks Extractor
============================================ */

function extractGeeksforGeeksContent() {

    const title =
        getElementText(document.querySelector("h1")) ||
        getPageTitle();

    const article =
        document.querySelector(".text") ||
        document.querySelector("article") ||
        document.querySelector("main");

    const content = getElementText(article);

    const headings = Array.from(
        document.querySelectorAll("h2,h3")
    ).map(h => getElementText(h));

    return createPayload({

        platform: "GeeksforGeeks",

        sourceType: "Documentation",

        title,

        content,

        metadata: {

            headings,

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        }

    });

}

/* ============================================
   HackerRank Extractor
============================================ */

function extractHackerRankContent() {

    const title =
        getElementText(
            document.querySelector("h1")
        ) ||
        getPageTitle();

    const body =
        document.querySelector(".challenge-body-html") ||
        document.querySelector("main");

    const content = getElementText(body);

    return createPayload({

        platform: "HackerRank",

        sourceType: "Problem",

        title,

        content,

        metadata: {

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        }

    });

}

/* ============================================
   MDN Extractor
============================================ */

function extractMDNContent() {

    const title =
        getElementText(document.querySelector("h1")) ||
        getPageTitle();

    const article =
        document.querySelector("main") ||
        document.querySelector("article");

    const content = getElementText(article);

    const headings = Array.from(
        document.querySelectorAll("h2,h3")
    ).map(h => getElementText(h));

    return createPayload({

        platform: "MDN",

        sourceType: "Documentation",

        title,

        content,

        metadata: {

            headings,

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        }

    });

}

/* ============================================
   Documentation Extractor
============================================ */

function extractDocumentationContent() {

    const article =
        document.querySelector("main") ||
        document.querySelector("article") ||
        document.body;

    const content = getElementText(article);

    return createPayload({

        platform: "Documentation",

        sourceType: "Documentation",

        title: getPageTitle(),

        content,

        metadata: {

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        }

    });

}

/* ============================================
   Generic Extractor
============================================ */

function extractGenericContent() {

    const content =
        cleanText(document.body?.innerText);

    return createPayload({

        platform: "Generic",

        sourceType: "Web Page",

        title: getPageTitle(),

        content,

        metadata: {

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        }

    });

}

/* ============================================
   YouTube Extractor
============================================ */

function extractYouTubeContent() {

    const title =
        getElementText(
            document.querySelector("h1.ytd-watch-metadata")
        ) ||
        getPageTitle();

    const description =
        getElementText(
            document.querySelector(
                "#description-inline-expander"
            )
        );

    const transcript =
        getElementText(
            document.querySelector(
                "ytd-transcript-renderer"
            )
        );

    const content =
        [description, transcript]
            .filter(Boolean)
            .join("\n\n");

    return createPayload({

        platform: "YouTube",

        sourceType: "Video",

        title,

        content,

        metadata: {

            transcriptAvailable: transcript.length > 0,

            contentLength: content.length,

            language: document.documentElement.lang || "en"

        }

    });

}


/* ============================================
   Extract Current Page
============================================ */

function extractContent() {

    const platform = detectPlatform();

    switch (platform) {

        case "ChatGPT":
            return extractChatGPTContent();

        case "YouTube":
            return extractYouTubeContent();

        case "LeetCode":
            return extractLeetCodeContent();

        case "GeeksforGeeks":
            return extractGeeksforGeeksContent();

        case "HackerRank":
            return extractHackerRankContent();

        case "MDN":
            return extractMDNContent();

        case "Documentation":
            return extractDocumentationContent();

        default:
            return extractGenericContent();

    }

}


function shouldExtract(payload) {

    const signature =
        payload.url +
        payload.title +
        payload.content.length;

    if (signature === lastSignature) {

        return false;

    }

    lastSignature = signature;

    return true;

}

/* ============================================
   Process Current Page
============================================ */

async function processCurrentPage() {

    console.log("processCurrentPage called");

    try {

        const extractedContent = extractContent();

        console.log("Extracted Content:", extractedContent);
        if (!shouldExtract(extractedContent)) {

            console.log("Duplicate Extraction Skipped");

            return;

        }
        chrome.runtime.sendMessage(
            {
                type: MESSAGE_TYPES.PAGE_CONTENT,
                payload: extractedContent
            },
            (response) => {

                if (chrome.runtime.lastError) {

                    console.error(
                        chrome.runtime.lastError.message
                    );

                    return;

                }

                console.log(
                    "Background Response:",
                    response
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Content Extraction Error:",
            error
        );

    }

}

/* ============================================
   Initialize
============================================ */
function waitForContent() {

    const interval = setInterval(() => {

        const platform = detectPlatform();

        let ready = false;

        switch (platform) {

            case "ChatGPT": {

                const messages = Array.from(
                    document.querySelectorAll("[data-message-author-role]")
                );

                const conversation = messages
                    .map(message => message.innerText.trim())
                    .join("");

                ready = conversation.length > 100;

                break;

            }

            case "LeetCode": {

    const title =
        document.querySelector(
            '[data-cy="question-title"]'
        );

    const description =
        document.querySelector(
            '[data-track-load="description_content"]'
        );

    ready =
        title &&
        description &&
        description.innerText.trim().length > 100;

    break;

}
            case "GeeksforGeeks":
                ready = document.querySelector("article, main") !== null;
                break;

            case "HackerRank":
                ready = document.querySelector(".challenge-body-html, main") !== null;
                break;

            case "MDN":
                ready = document.querySelector("article, main") !== null;
                break;

            case "YouTube": {

    const title =
        document.querySelector(
            "h1.ytd-watch-metadata"
        );

    const description =
        document.querySelector(
            "#description-inline-expander"
        );

    ready =
        title &&
        (
            title.innerText.trim().length > 0 ||
            description?.innerText.trim().length > 0
        );

    break;

}

            default:
                ready = document.body !== null;

        }

        if (ready) {

            clearInterval(interval);

            console.log("Content Ready");

            processCurrentPage();

        }

    }, 500);

}

function observeUrlChanges() {

    setInterval(() => {

        if (location.href !== lastUrl) {

            lastUrl = location.href;

            console.log("URL Changed");

            waitForContent();

        }

    }, 500);

}

function observeDomChanges() {

    const observer = new MutationObserver(() => {

        clearTimeout(mutationTimer);

        mutationTimer = setTimeout(() => {

            processCurrentPage();

        }, 1000);

    });

    observer.observe(document.body, {

        childList: true,

        subtree: true,

        characterData: true

    });

}
window.addEventListener("load", () => {

    waitForContent();

    observeUrlChanges();

    observeDomChanges();

});