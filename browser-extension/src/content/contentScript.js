/**
 * ============================================
 * AI Learning Intelligence System
 * Content Script
 * ============================================
 */

import { extractContent } from "./extractorManager.js";
import MESSAGE_TYPES from "../utils/messageTypes.js";

async function processCurrentPage() {

    try {

        const extractedContent = await extractContent();

        chrome.runtime.sendMessage(
            {
                type: MESSAGE_TYPES.PAGE_CONTENT,
                payload: extractedContent
            },
            (response) => {

                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    return;
                }

                console.log("Background Response:", response);

            }
        );

    }
    catch (error) {

        console.error("Content Extraction Error:", error);

    }

}

window.addEventListener("load", () => {

    processCurrentPage();

});