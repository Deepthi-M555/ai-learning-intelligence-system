/**
 * ============================================
 * AI Learning Intelligence System
 * Storage Service
 * ============================================
 *
 * Responsibilities:
 * - Store pending learning events
 * - Retrieve pending learning events
 * - Remove synced learning events
 */

const STORAGE_KEY = "AILIS_PENDING_EVENTS";

/**
 * Returns all pending learning events.
 */
async function getPendingEvents() {

    try {

        const result = await chrome.storage.local.get(STORAGE_KEY);

        return result[STORAGE_KEY] || [];

    }
    catch (error) {

        console.error(
            "Failed to retrieve pending events.",
            error
        );

        return [];

    }

}

/**
 * Stores a learning event locally.
 */
async function savePendingEvent(learningEvent) {

    try {

        const events = await getPendingEvents();

        events.push(learningEvent);

        await chrome.storage.local.set({
            [STORAGE_KEY]: events
        });

    }
    catch (error) {

        console.error(
            "Failed to save pending event.",
            error
        );

    }

}

/**
 * Clears all pending events.
 */
async function clearPendingEvents() {

    try {

        await chrome.storage.local.remove(STORAGE_KEY);

    }
    catch (error) {

        console.error(
            "Failed to clear pending events.",
            error
        );

    }

}

/**
 * Removes one synced event.
 */
async function removePendingEvent(sessionId) {

    try {

        const events = await getPendingEvents();

        const updatedEvents = events.filter(event =>
            event.sessionId !== sessionId
        );

        await chrome.storage.local.set({
            [STORAGE_KEY]: updatedEvents
        });

    }
    catch (error) {

        console.error(
            "Failed to remove pending event.",
            error
        );

    }

}

export {
    getPendingEvents,
    savePendingEvent,
    clearPendingEvents,
    removePendingEvent
};