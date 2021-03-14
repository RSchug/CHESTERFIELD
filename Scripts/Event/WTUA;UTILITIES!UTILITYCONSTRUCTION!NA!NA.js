try {
	if (wfTask == 'As Built' && (matches(wfStatus, "Completed for Warranty","Completed for Both"))) {
		scheduleInspection("One-Year Warranty Inspection", 330, null, null, "Auto Scheduled from As Built Warranty Completed Workflow Task");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}