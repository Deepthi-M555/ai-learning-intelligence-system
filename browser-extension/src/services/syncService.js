/**
 * ============================================
 * AI Learning Intelligence System
 * Sync Service
 * ============================================
 *
 * Responsibilities:
 * - Sync pending learning events
 * - Retry failed uploads
 * - Remove successfully synced events
 */

import {
    getPendingEvents,
    removePendingEvent
} from "./storageService.js";

import {
    sendLearningEvent
} from "./apiService.js";

/**
 * Synchronizes pending learning events.
 */
async function syncPendingEvents() {

    const pendingEvents = await getPendingEvents();

    if (pendingEvents.length === 0) {

        console.log("No pending learning events to sync.");

        return;

    }

    console.log(
        `Syncing ${pendingEvents.length} pending event(s)...`
    );

    for (const learningEvent of pendingEvents) {

        try {

            await sendLearningEvent(learningEvent);

            await removePendingEvent(
                learningEvent.sessionId
            );

            console.log(
                `Synced: ${learningEvent.sessionId}`
            );

        }
        catch (error) {

            console.error(
                `Failed to sync ${learningEvent.sessionId}`,
                error
            );

        }

    }

}

export {
    syncPendingEvents
};