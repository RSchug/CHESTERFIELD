// 17B:If 'Inspections' Workflow Task status is updated to 'Completed' then 'Delete' the related Building / Structure / NA / NA record.
if (wfTask == "Inspections" && wfStatus == "Completed"){
    if (parentCapId && appMatch("Building/Structure/NA/NA", parentCapId)) {
        logDebug("Updating Structure " + parentCapId.getCustomID() + " to Demolished");        updateAppStatus("Demolished", "Updated via script from " + capId.getCustomID(), parentCapId);
        logDebug("Deleting Structure " + parentCapId.getCustomID());
        try {
            var removeRecordResult = aa.cap.removeRecord(parentCapId);
            if (removeRecordResult.getSuccess()) {
                logDebug("Successfully deleted structure " + parentCapId.getCustomID());
            } else {
                logDebug("Failed to deleted structure " + parentCapId.getCustomID() + ". Reason: " + removeRecordResult.getErrorMessage());
            }
        } catch (err) {
                logDebug("A JavaScript Error occured: " + err.message + " at line " + err.lineNumber + " stack: " + err.stack);
        }
    }
}
