function getWorkflowHistory_TPS() { // Get Workflow History.
    var wfstr = arguments.length > 0 && arguments[0] ? arguments[0] : null;
    var wfstat = arguments.length > 1 && arguments[1] ? arguments[1] : null;
    var processName = arguments.length > 2 && arguments[2] ? arguments[2] : "";
    var itemCap = arguments.length > 3 && arguments[3] ? arguments[3] : capId;

    var useProcess = processName != "" ? true : false;
    var wfStatArray = wfstat && typeof (wfstat) == "string" ? [wfstat] : wfstat; // Convert to array
    if (typeof (itemCap) == "string") {
        var result = aa.cap.getCapID(itemCap);
        if (result.getSuccess()) {
            itemCap = result.getOutput();
        } else {
            logMessage("**ERROR: Failed to get cap ID: " + result + " error: " + result.getErrorMessage()); return false;
        }
    }

    var taskArr = new Array();

    var workflowResult = aa.workflow.getHistory(itemCap);
    if (!workflowResult.getSuccess()) {
        logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
        return false;
    }

    var tasks = [];
    var wfObj = workflowResult.getOutput();
    for (var x = 0; x < wfObj.length; x++) {
        var fTask = wfObj[x];
        if (useProcess && !fTask.getProcessCode().equals(processName)) continue;
        if (wfstr && !fTask.getTaskDescription().equals(wfstr)) continue;
        if (wfStatArray && !exists(wfTask, fTask.getDisposition(), wfStatArray)) continue;
        tasks.push(fTask);
        logDebug("History[" + x + "]: # " + fTask.getProcessHistorySeq()
            + ", ID: " + fTask.getProcessID() + "." + fTask.getStepNumber()
            + " , TaskID:" + fTask.getCurrentTaskID() + " - " + fTask.getNextTaskID()
            + ", Task: " + fTask.getProcessCode() + "." + fTask.getTaskDescription()
            + ", Status: " + fTask.getDisposition() + " " + fTask.getStatusDate()
            //  + br + describe_TPS(fTask)
        );
    }
    return tasks;
}
