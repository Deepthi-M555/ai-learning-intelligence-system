import LearningEvent from "../models/LearningEvent.js";

import {
    getPlatform
} from "./tabManager.js";

const SESSION_STATE = {
    ACTIVE: "ACTIVE",
    PAUSED: "PAUSED"
};

const sessions = new Map();

/**
 * Creates a new session for a tab.
 */
function startSession(tabInfo) {

    if (!tabInfo) {
        return;
    }

    if (sessions.has(tabInfo.id)) {
        return;
    }

    const session = new LearningEvent();

    session.tabId = tabInfo.id;

    // Platform Information
    session.platform = getPlatform(tabInfo.url);
    session.url = tabInfo.url;
    session.title = tabInfo.title;

    // Decide the source type
    switch (session.platform) {

        case "ChatGPT":
            session.sourceType = "Conversation";
            break;

        case "YouTube":
            session.sourceType = "Video";
            break;

        case "LeetCode":
        case "HackerRank":
            session.sourceType = "Problem";
            break;

        case "GeeksforGeeks":
        case "MDN":
        case "W3Schools":
            session.sourceType = "Documentation";
            break;

        default:
            session.sourceType = "Learning Resource";

    }

    // Empty metadata (filled later by content extractors)
    session.metadata = {};

    session.startedAt = new Date().toISOString();

    session.state = SESSION_STATE.ACTIVE;

    sessions.set(tabInfo.id, session);

}

/**
 * Updates extracted page content.
 */
function updateSessionContent(tabId, content) {

    const session = sessions.get(tabId);

    if (!session) {
        return;
    }
    console.log("Updating Session:", tabId);
console.log("Content Length:", content?.length);
    session.content = content || "";

}

/**
 * Updates metadata.
 */
function updateSessionMetadata(tabId, metadata) {

    const session = sessions.get(tabId);

    if (!session) {
        return;
    }

    session.metadata = metadata || {};

}

/**
 * Pause a session.
 */
function pauseSession(tabId) {

    const session = sessions.get(tabId);

    if (!session) {
        return;
    }

    session.state = SESSION_STATE.PAUSED;

}

/**
 * Resume a session.
 */
function resumeSession(tabId) {

    const session = sessions.get(tabId);

    if (!session) {
        return;
    }

    session.state = SESSION_STATE.ACTIVE;

}

/**
 * Ends a tab session.
 */
function endSession(tabId, activeStudyTime) {

    const session = sessions.get(tabId);

    if (!session) {
        return null;
    }

    session.activeStudyTime = Math.floor(activeStudyTime / 1000);

    session.completedAt = new Date().toISOString();

    sessions.delete(tabId);
    console.log("Ending Session:");
    console.log("Content:", session.content);
console.log("Metadata:", session.metadata);
console.log(session);
    return session.toJSON();

}

/**
 * Returns a session.
 */
function getSession(tabId) {

    return sessions.get(tabId);

}

/**
 * Returns true if paused.
 */
function isSessionPaused(tabId) {

    const session = sessions.get(tabId);

    return session?.state === SESSION_STATE.PAUSED;

}

/**
 * Returns all active sessions.
 */
function getAllSessions() {

    return sessions;

}

export {

    startSession,

    updateSessionContent,

    updateSessionMetadata,

    pauseSession,

    resumeSession,

    endSession,

    getSession,

    isSessionPaused,

    getAllSessions

};