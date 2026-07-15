/**
 * ============================================
 * AI Learning Intelligence System
 * Activity Tracker
 * ============================================
 *
 * Responsibilities:
 * - Track active study time
 * - Pause/Resume sessions
 * - End sessions
 * - Ignore idle time
 */

let currentTabId = null;

let sessionStartTime = null;

let totalActiveTime = 0;

let isTracking = false;

/**
 * Starts a brand new session.
 */
function startTracking(tabId) {

    currentTabId = tabId;

    totalActiveTime = 0;

    sessionStartTime = Date.now();

    isTracking = true;

    

}

/**
 * Pause current session.
 */
function pauseTracking() {

    if (!isTracking || sessionStartTime === null) {
        return;
    }

    totalActiveTime += Date.now() - sessionStartTime;

    sessionStartTime = null;

    isTracking = false;

}

/**
 * Resume paused session.
 */
function resumeTracking(tabId) {

    if (isTracking) {
        return;
    }

    currentTabId = tabId;

    sessionStartTime = Date.now();

    isTracking = true;

}

/**
 * Ends current session.
 */
function endTracking() {

    if (isTracking) {

        pauseTracking();

    }

    

    const duration = totalActiveTime;

    currentTabId = null;

    sessionStartTime = null;

    totalActiveTime = 0;

    isTracking = false;

    return duration;

}

/**
 * Returns active time.
 */
function getTotalActiveTime() {

    if (isTracking && sessionStartTime !== null) {

        return totalActiveTime + (Date.now() - sessionStartTime);

    }

    return totalActiveTime;

}

/**
 * Returns tracking state.
 */
function isSessionActive() {

    return isTracking;

}

/**
 * Returns active tab.
 */
function getCurrentTabId() {

    return currentTabId;

}

/**
 * Pause tracking if user becomes idle.
 */
chrome.idle.onStateChanged.addListener((state) => {

    if (state === "idle" || state === "locked") {

        pauseTracking();

    }

    if (state === "active") {

        resumeTracking();

    }

});

function isPaused() {

    return !isTracking && currentTabId !== null;

}

export {

    startTracking,

    pauseTracking,

    resumeTracking,

    endTracking,

    getTotalActiveTime,

    isSessionActive,

    getCurrentTabId,

    isPaused

};