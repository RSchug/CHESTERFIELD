try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
		activateTask("CDOT Review");
		editTaskDueDate('CDOT Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("Community Enhancement Review");
		editTaskDueDate('Community Enhancement Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("Environmental Engineering Review");
		editTaskDueDate('Environmental Engineering Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("Fire and Life Safety Review");
		editTaskDueDate('Fire and Life Safety Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("Department of Health Review");
		editTaskDueDate('Department of Health Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("Police Review");
		editTaskDueDate('Police Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("Planning Review");
		editTaskDueDate('Planning Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("Utilities Review");
		editTaskDueDate('Utilities Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("VDOT Review");
		editTaskDueDate('VDOT Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		activateTask("Real Property Review");
		editTaskDueDate('Real Property Review', dateAdd(getTaskDueDate('Review Distribution'),13));
		deactivateTask("Default");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}