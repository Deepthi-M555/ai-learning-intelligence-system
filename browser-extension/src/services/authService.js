/**
 * ============================================
 * AI Learning Intelligence System
 * Authentication Service
 * ============================================
 *
 * Responsibilities:
 * - Store authentication token
 * - Retrieve authentication token
 * - Remove authentication token
 * - Check authentication status
 */

const AUTH_TOKEN_KEY = "AILIS_AUTH_TOKEN";

/**
 * Saves authentication token.
 */
async function saveAuthToken(token) {

    try {

        await chrome.storage.local.set({
            [AUTH_TOKEN_KEY]: token
        });

    }
    catch (error) {

        console.error("Failed to save auth token.", error);

    }

}

/**
 * Returns authentication token.
 */
async function getAuthToken() {

    try {

        const result = await chrome.storage.local.get(
            AUTH_TOKEN_KEY
        );

        return result[AUTH_TOKEN_KEY] || null;

    }
    catch (error) {

        console.error("Failed to retrieve auth token.", error);

        return null;

    }

}

/**
 * Removes authentication token.
 */
async function removeAuthToken() {

    try {

        await chrome.storage.local.remove(
            AUTH_TOKEN_KEY
        );

    }
    catch (error) {

        console.error("Failed to remove auth token.", error);

    }

}

/**
 * Returns true if user is authenticated.
 */
async function isAuthenticated() {

    const token = await getAuthToken();

    return token !== null;

}

export {
    saveAuthToken,
    getAuthToken,
    removeAuthToken,
    isAuthenticated
};