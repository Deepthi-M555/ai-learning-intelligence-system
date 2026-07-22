const Activity = require("../models/Activity");

const {
    processActivity,
} = require("./aiProcessingService");

const {
    integrateClassification,
} = require("./dashboardService");

const createActivity = async (userId, activityData) => {
    const {
        sessionId,
        platform,
        sourceType,
        title,
        url,
        content,
        metadata,
        activeStudyTime,
        startedAt,
        completedAt,
        browser,
        device,
    } = activityData;


    /*
    Validate duration
    */
    if (
        new Date(completedAt) <=
        new Date(startedAt)
    ) {
        throw new Error(
            "Invalid activity duration"
        );
    }


    const duration = Math.floor(
        (
            new Date(completedAt) -
            new Date(startedAt)
        ) / 1000
    );


    /*
    STEP 1

    Save activity before attempting AI processing.
    */
    const activity = await Activity.create({
        userId,
        sessionId,
        platform,
        sourceType,
        title,
        url,
        content,
        metadata,
        activeStudyTime,
        startedAt,
        completedAt,
        duration,
        browser,
        device,
    });


    /*
    STEP 2

    Submit activity to FastAPI.
    */
    try {

        const aiResponse =
            await processActivity(activity);


        /*
        CASE 1
        Redis cache hit.

        Classification already exists,
        therefore no Celery callback is needed.
        */
        if (
            aiResponse.cached &&
            aiResponse.data?.classification
        ) {
            const classification =
                aiResponse.data.classification;

            await Activity.updateOne(
                {
                    _id: activity._id,
                },
                {
                    $set: {
                        classificationStatus:
                            "COMPLETED",

                        classification,

                        processed: true,
                    },
                }
            );

            /*
            Cache hit has no Celery callback,
            so update Dashboard here.
            */
            await integrateClassification(
                activity.userId,
                activity._id,
                classification
            );
        }


        /*
        CASE 2
        Cache miss.

        Celery accepted the task.
        */
        else if (aiResponse.task_id) {

            await Activity.updateOne(
                {
                    _id: activity._id,

                    /*
                    Callback may have already
                    completed the activity.
                    */
                    classificationStatus: {
                        $ne: "COMPLETED",
                    },
                },
                {
                    $set: {
                        classificationStatus:
                            "PROCESSING",

                        classificationTaskId:
                            aiResponse.task_id,
                    },
                }
            );
        }


        console.log(
            `AI processing submitted for activity ${activity._id}`
        );

    } catch (error) {

        /*
        Do not overwrite COMPLETED.

        The callback may have completed while
        another request encountered an error.
        */
        await Activity.updateOne(
            {
                _id: activity._id,

                classificationStatus: {
                    $ne: "COMPLETED",
                },
            },
            {
                $set: {
                    classificationStatus:
                        "FAILED",
                },
            }
        );

        console.error(
            `Failed to submit activity ${activity._id} for AI processing:`,
            error.message
        );
    }


    /*
    STEP 3

    Read the latest MongoDB state.

    Important because the callback could have
    modified the activity while this function
    was running.
    */
    const updatedActivity =
        await Activity.findById(
            activity._id
        );


    return updatedActivity;
};


const getActivities = async (userId) => {
    return await Activity.find({
        userId,
    }).sort({
        startedAt: -1,
    });
};


const getTodayActivities = async (userId) => {

    const startOfDay = new Date();

    startOfDay.setHours(
        0,
        0,
        0,
        0
    );

    return await Activity.find({
        userId,

        startedAt: {
            $gte: startOfDay,
        },

    }).sort({
        startedAt: -1,
    });
};


module.exports = {
    createActivity,
    getActivities,
    getTodayActivities,
};