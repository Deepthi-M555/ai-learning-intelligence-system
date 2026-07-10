/**
 * ============================================
 * AI Learning Intelligence System
 * Extractor Manager
 * ============================================
 *
 * Responsibilities:
 * - Detect current platform
 * - Invoke the correct extractor
 * - Return extracted content
 *
 * NOT Responsible For:
 * - Backend communication
 * - Session management
 * - AI processing
 */

import { extractYouTubeContent } from "../extractors/youtubeExtractor.js";
import { extractChatGPTContent } from "../extractors/chatgptExtractor.js";
import { extractLeetCodeContent } from "../extractors/leetcodeExtractor.js";
import { extractGeeksforGeeksContent } from "../extractors/gfgExtractor.js";
import { extractHackerRankContent } from "../extractors/hackerRankExtractor.js";
import { extractMDNContent } from "../extractors/mdnExtractor.js";
import { extractDocumentationContent } from "../extractors/docsExtractor.js";
import { extractGenericContent } from "../extractors/genericExtractor.js";

/**
 * Detects which extractor should handle
 * the current webpage.
 */
export async function extractContent() {

    const url = window.location.href;

    if (url.includes("youtube.com")) {
        return extractYouTubeContent();
    }

    if (url.includes("chatgpt.com")) {
        return extractChatGPTContent();
    }

    if (url.includes("leetcode.com")) {
        return extractLeetCodeContent();
    }

    if (url.includes("geeksforgeeks.org")) {
        return extractGeeksforGeeksContent();
    }

    if (url.includes("hackerrank.com")) {
        return extractHackerRankContent();
    }

    if (url.includes("developer.mozilla.org")) {
        return extractMDNContent();
    }

    if (
        url.includes("docs.") ||
        url.includes("/docs/")
    ) {
        return extractDocumentationContent();
    }

    return extractGenericContent();

}