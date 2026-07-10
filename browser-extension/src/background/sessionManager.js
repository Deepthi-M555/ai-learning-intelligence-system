/**
 * ============================================
 * AI Learning Intelligence System
 * Session Manager
 * ============================================
 *
 * Responsibilities:
 * - Maintain one learning session per tab
 * - Build final learning events
 * - Return completed session data
 */

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
    session.platform = getPlatform(tabInfo.url);
    session.url = tabInfo.url;
    session.title = tabInfo.title;
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

    session.content = content || "";

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

    return session.toJSON();

}

/**
 * Returns a session.
 */
function getSession(tabId) {

    return sessions.get(tabId);

}


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

    pauseSession,

    resumeSession,

    endSession,

    getSession,

    isSessionPaused,

    getAllSessions

};