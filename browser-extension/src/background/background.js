/**
 * ============================================
 * AI Learning Intelligence System
 * Background Service Worker
 * ============================================
 */

import {
    getTabInfo,
    isSupportedWebsite,
    getPlatform
} from "./tabManager.js";

import {
    startTracking,
    pauseTracking,
    resumeTracking,
    endTracking,
    getCurrentTabId
} from "./activityTracker.js";

import {
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    getSession,
    isSessionPaused
} from "./sessionManager.js";

import {
    handleMessage
} from "./messageHandler.js";

import {
    sendLearningEvent
} from "../services/apiService.js";

import {
    savePendingEvent
} from "../services/storageService.js";

import {
    syncPendingEvents
} from "../services/syncService.js";



/**
 * ============================================
 * Handles learning tab lifecycle
 * ============================================
 */
async function handleLearningTab(tab) {

    const tabInfo = getTabInfo(tab);

    if (!tabInfo || !tabInfo.supported) {
        return;
    }

    const currentTab = getCurrentTabId();

    // Pause currently active session
    if (
        currentTab !== null &&
        currentTab !== tab.id
    ) {

        pauseTracking();
        pauseSession(currentTab);

        const previousSession = getSession(currentTab);

        if (previousSession) {

            console.log(
                `⏸ [PAUSE] ${previousSession.platform}`
            );

        }

    }

    const session = getSession(tab.id);

    // Existing session
    if (session) {

    // Refresh page information
    session.url = tabInfo.url;
    session.title = tabInfo.title;
    session.platform = getPlatform(tabInfo.url);

    if (isSessionPaused(tab.id)) {

        resumeSession(tab.id);

        resumeTracking(tab.id);

        console.log(
            `▶ [RESUME] ${session.platform}`
        );

    }

    return;

}

    // New session
    console.log(
        `🟢 [START] ${tabInfo.title}`
    );

    startSession(tabInfo);

    startTracking(tab.id);

}
/**
 * Initial installation
 */
chrome.runtime.onInstalled.addListener(async () => {

    console.log("AI Learning Intelligence Installed");

    await syncPendingEvents();

});

/**
 * Browser startup
 */
chrome.runtime.onStartup.addListener(async () => {

    console.log("Browser Started");

    await syncPendingEvents();

});

/**
 * User switches between tabs
 */chrome.tabs.onActivated.addListener(async ({ tabId }) => {

    const tab = await chrome.tabs.get(tabId);

    await handleLearningTab(tab);

});

/**
 * New page loaded
 */chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    if (changeInfo.status !== "complete") {
        return;
    }

    await handleLearningTab(tab);

});

/**
 * Tab closed
 */
chrome.tabs.onRemoved.addListener(async (tabId) => {

    if (getCurrentTabId() === tabId) {

        const duration = endTracking();

        const learningEvent = endSession(
            tabId,
            duration
        );

        if (!learningEvent) {
            return;
        }

        console.log(
    `🔴 [END] ${learningEvent.platform}`
);

console.log(
    `⏱ Active Time : ${learningEvent.activeStudyTime} sec`
);

console.log(
    "☁ [SYNC] Sending..."
);

        const response = await sendLearningEvent(
            learningEvent
        );

        if (response && response.success) {

    console.log(
        "✅ [SYNC] Success"
    );

}

        if (!response || response.success === false) {

            await savePendingEvent(
                learningEvent
            );

        }

    }

});
/**
 * Initialize tracking for the currently active tab.
 */async function initializeActiveTab() {

    const tabs = await chrome.tabs.query({

        active: true,

        currentWindow: true

    });

    if (tabs.length === 0) {
        return;
    }

    await handleLearningTab(tabs[0]);

}

initializeActiveTab();
/**
 * Content Script Communication
 */
chrome.runtime.onMessage.addListener(
    handleMessage
);