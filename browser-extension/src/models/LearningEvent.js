/**
 * ============================================
 * AI Learning Intelligence System
 * Learning Event Model
 * ============================================
 *
 * Standard data structure shared across
 * the entire browser extension.
 *
 * Every learning session should follow
 * this model before being sent to backend.
 */

class LearningEvent {

    constructor() {

        this.sessionId = crypto.randomUUID();

        this.platform = "";

        this.url = "";

        this.title = "";

        this.content = "";

        this.activeStudyTime = 0;

        this.startedAt = "";

        this.completedAt = "";

        this.browser = "Chrome";

        this.device = navigator.platform;

    }

    /**
     * Returns a plain JavaScript object.
     */
    toJSON() {

        return {
            sessionId: this.sessionId,
            platform: this.platform,
            url: this.url,
            title: this.title,
            content: this.content,
            activeStudyTime: this.activeStudyTime,
            startedAt: this.startedAt,
            completedAt: this.completedAt,
            browser: this.browser,
            device: this.device
        };

    }

}

export default LearningEvent;