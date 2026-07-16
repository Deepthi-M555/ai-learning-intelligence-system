/**
 * ============================================
 * AI Learning Intelligence System
 * Learning Event Model
 * ============================================
 *
 * Represents one learning session collected
 * by the Browser Extension.
 *
 * This object contains only RAW learning data.
 * AI-generated fields (summary, quiz,
 * flashcards, etc.) will be created later
 * by the AI Processing Module.
 */

class LearningEvent {

    constructor() {

        this.sessionId = crypto.randomUUID();

        // User (filled after authentication)
        this.user = null;

        // Platform Information
        this.platform = "";
        this.sourceType = "";

        // Learning Resource
        this.title = "";
        this.url = "";
        this.content = "";

        // Flexible platform-specific information
        this.metadata = {};

        // Session Information
        this.activeStudyTime = 0;
        this.startedAt = "";
        this.completedAt = "";

        // Device Information
        this.browser = "Chrome";
        this.device = navigator.platform;

    }

    /**
     * Returns a plain JavaScript object.
     */
    toJSON() {

        return {

            sessionId: this.sessionId,

            user: this.user,

            platform: this.platform,
            sourceType: this.sourceType,

            title: this.title,
            url: this.url,
            content: this.content,

            metadata: this.metadata,

            activeStudyTime: this.activeStudyTime,

            startedAt: this.startedAt,
            completedAt: this.completedAt,

            browser: this.browser,
            device: this.device

        };

    }

}

export default LearningEvent;