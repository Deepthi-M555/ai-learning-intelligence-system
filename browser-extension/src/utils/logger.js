/**
 * Logger Utility
 */

function log(...message){

    console.log(
        "[AILIS]",
        ...message
    );

}

function error(...message){

    console.error(
        "[AILIS]",
        ...message
    );

}

export{
    log,
    error
};