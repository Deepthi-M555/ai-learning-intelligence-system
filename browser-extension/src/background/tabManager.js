/**
 * ============================================
 * AI Learning Intelligence System
 * Tab Manager
 * ============================================
 *
 * Responsibilities:
 * - Identify supported learning websites
 * - Read tab information
 * - Validate browser tabs
 *
 * NOT Responsible For:
 * - Extracting page content
 * - Tracking study time
 * - Calling backend APIs
 * - AI processing
 */

const SUPPORTED_DOMAINS = [
    "youtube.com",
    "chatgpt.com",
    "leetcode.com",
    "geeksforgeeks.org",
    "hackerrank.com",
    "developer.mozilla.org",
    "w3schools.com"
];

/**
 * Returns true if the tab belongs to a supported learning website.
 */
function isSupportedWebsite(url) {

    if (!url) {
        return false;
    }

    return SUPPORTED_DOMAINS.some(domain => url.includes(domain));

}

/**
 * Returns simplified tab information.
 */
function getTabInfo(tab) {

    if (!tab) {
        return null;
    }

    return {
        id: tab.id,
        title: tab.title || "",
        url: tab.url || "",
        favIconUrl: tab.favIconUrl || "",
        active: tab.active || false,
        windowId: tab.windowId,
        supported: isSupportedWebsite(tab.url)
    };

}

/**
 * Gets the currently active tab.
 */
async function getActiveTab() {

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (tabs.length === 0) {
        return null;
    }

    return getTabInfo(tabs[0]);

}

/**
 * Returns the platform name.
 */
function getPlatform(url) {

    if (!url) {
        return "Unknown";
    }

    if (url.includes("youtube.com")) {
        return "YouTube";
    }

    if (url.includes("chatgpt.com")) {
        return "ChatGPT";
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

    
    if (url.includes("w3schools.com")) {
        return "W3Schools";
    }

    return "Other";

}

export {
    SUPPORTED_DOMAINS,
    isSupportedWebsite,
    getTabInfo,
    getActiveTab,
    getPlatform
};