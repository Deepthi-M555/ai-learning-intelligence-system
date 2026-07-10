/**
 * ============================================
 * AI Learning Intelligence System
 * Message Handler
 * ============================================
 */

import { updateSessionContent } from "./sessionManager.js";
import MESSAGE_TYPES from "../utils/messageTypes.js";

function handleMessage(message, sender, sendResponse) {

    if (!message || !message.type) {
        sendResponse({
            success: false,
            error: "Invalid message."
        });
        return true;
    }

    switch (message.type) {

        case MESSAGE_TYPES.PAGE_CONTENT:

            updateSessionContent(message.payload || "");

            sendResponse({
                success: true,
                message: "Content received."
            });

            break;

        case MESSAGE_TYPES.SESSION_END:

            sendResponse({
                success: true,
                message: "Session ended."
            });

            break;

        case MESSAGE_TYPES.PING:

            sendResponse({
                success: true,
                message: "Extension is active."
            });

            break;

        default:

            sendResponse({
                success: false,
                error: "Unknown message type."
            });

    }

    return true;

}

export {
    handleMessage
};