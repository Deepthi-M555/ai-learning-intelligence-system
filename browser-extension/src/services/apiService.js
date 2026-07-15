/**
 * ============================================
 * AI Learning Intelligence System
 * API Service
 * ============================================
 *
 * Responsibilities:
 * - Send learning events to backend
 * - Handle HTTP requests
 * * NOT Responsible For:
 * - Session management
 * - Authentication logic
 * - Local storage
 */

import { getAuthToken } from "./authService.js";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Creates request headers.
 */
async function createHeaders() {

    const headers = {
        "Content-Type": "application/json"
    };

    const token = await getAuthToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;

}

/**
 * Sends a learning event to backend.
 */
async function sendLearningEvent(learningEvent) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/learning-session`,
            {
                method: "POST",
                headers: await createHeaders(),
                body: JSON.stringify(learningEvent)
            }
        );

        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );

        }

        return await response.json();

    }
    catch (error) {

    console.error(
        "Failed to send learning event:",
        error
    );

    return {
        success: false,
        error: error.message
    };

}

}

/**
 * Checks backend availability.
 */
async function checkBackendHealth() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/health`
        );

        return response.ok;

    }
    catch {

        return false;

    }

}

export {
    sendLearningEvent,
    checkBackendHealth
};