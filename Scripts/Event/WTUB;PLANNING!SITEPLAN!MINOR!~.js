//36P if Adjacents Workflow Task Status Date of 'Create List' Status is less than 15 days display error when updating Case Complete task.
try {
    if (wfTask == 'Adjacents' && wfStatus == 'Completed') {
        var tasks = loadTasks(capId);
        if (tasks[wfTask] && tasks[wfTask].status == 'Create List') {
            var wfTaskStatusDateLast = tasks[wfTask].statusdate;
            if (wfTaskStatusDateLast) wfTaskStatusDateLast = new Date(dateAdd(wfTaskStatusDateLast, 15));
            logDebug("Last Status: " + tasks[wfTask].status + " , Date: " + tasks[wfTask].statusdate + " , Date + 15: " + wfTaskStatusDateLast);
            if (wfTaskStatusDateLast && wfTaskStatusDateLast.getTime() > startDate.getTime()) {
                showMessage = true;
                comment('<font size=small><b>Need to assure that residential neighbors have had 15 days of notification</b></font>');
                cancel = true;
            }
        }
    }
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}