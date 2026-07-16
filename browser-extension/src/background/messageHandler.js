/**
 * ============================================
 * AI Learning Intelligence System
 * Message Handler
 * ============================================
 */

import {
    updateSessionContent,
    updateSessionMetadata,
    getSession
} from "./sessionManager.js";

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

        case MESSAGE_TYPES.PAGE_CONTENT: {

            const payload = message.payload;

            const tabId = sender.tab?.id;

            if (!payload || !tabId) {

                sendResponse({

                    success: false,

                    error: "Invalid payload."

                });

                return true;

            }
 console.log("Message Tab ID:", tabId);

const session = getSession(tabId);

console.log("Session Found:", session);
console.log("Payload Content:", payload.content);

// Update extracted learning content
updateSessionContent(
    tabId,
    payload.content
);

// Update platform-specific metadata
updateSessionMetadata(
    tabId,
    payload.metadata
);

// Update remaining session fields
if (session) {

    session.platform = payload.platform || session.platform;

    session.sourceType = payload.sourceType || session.sourceType;

    session.title = payload.title || session.title;

    session.url = payload.url || session.url;

}

            sendResponse({

                success: true,

                message: "Content received."

            });

            break;

        }

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