import {
    syncPendingEvents
} from "../services/syncService.js";

const status=document.getElementById("status");

const syncButton=document.getElementById("syncButton");

status.textContent="Extension Active";

syncButton.addEventListener(
    "click",
    async()=>{

        status.textContent="Syncing...";

        await syncPendingEvents();

        status.textContent="Sync Completed";

    }
);